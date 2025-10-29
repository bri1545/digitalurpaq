import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { HumanCharacter } from "@/components/HumanCharacter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: i18n.language === "ru" 
        ? "Здравствуйте! Я ваш помощник по Digital Urpaq. Чем могу помочь вам сегодня?" 
        : i18n.language === "kz"
        ? "Сәлеметсіз бе! Мен Digital Urpaq бойынша сіздің көмекшіңізбін. Бүгін сізге қалай көмектесе аламын?"
        : "Hello! I'm your Digital Urpaq assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [assistantEmotion, setAssistantEmotion] = useState<"normal" | "thinking" | "excited" | "happy">("normal");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      setAssistantEmotion("thinking");
      
      // Get current messages state
      let currentMessages: Message[] = [];
      setMessages(prev => {
        currentMessages = prev;
        return prev;
      });
      
      // Add the user message to the conversation
      const newMessages = [...currentMessages, { role: "user" as const, content: userMessage }];
      
      // Send the full conversation history to the backend
      const response = await apiRequest("POST", "/api/chat", {
        messages: newMessages,
        language: i18n.language
      });
      
      return { response, userMessage };
    },
    onSuccess: (data) => {
      // Only append user message and assistant response
      setMessages(prev => [
        ...prev,
        { role: "user", content: data.userMessage },
        { role: "assistant", content: data.response.message }
      ]);
      setAssistantEmotion("excited");
      
      // Auto-speak if enabled
      if (speechEnabled) {
        speakText(data.response.message);
      }
      
      setTimeout(() => setAssistantEmotion("normal"), 2000);
    },
    onError: (error: Error) => {
      setAssistantEmotion("normal");
      console.error("Chat error:", error);
      // Show error to user
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: i18n.language === "ru" 
            ? "Извините, произошла ошибка. Пожалуйста, попробуйте ещё раз."
            : i18n.language === "kz"
            ? "Кешіріңіз, қате орын алды. Қайталап көріңіз."
            : "Sorry, an error occurred. Please try again."
        }
      ]);
    }
  });

  // Text-to-Speech functionality with improved voice quality
  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = i18n.language === "kz" ? "kk-KZ" : i18n.language === "ru" ? "ru-RU" : "en-US";
    
    // Improved voice settings for better quality
    utterance.rate = 0.95;  // Slightly slower for clarity
    utterance.pitch = 1.1;  // Natural, friendly pitch
    utterance.volume = 1.0;
    
    // Try to use a better quality voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => {
      if (i18n.language === "ru") {
        return voice.lang.startsWith("ru") && (voice.name.includes("Google") || voice.name.includes("Microsoft"));
      } else if (i18n.language === "kz") {
        return voice.lang.startsWith("kk");
      } else {
        return voice.lang.startsWith("en") && (voice.name.includes("Google") || voice.name.includes("Microsoft"));
      }
    });
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setAssistantEmotion("excited");
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setAssistantEmotion("happy");
      setTimeout(() => setAssistantEmotion("normal"), 1000);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAssistantEmotion("normal");
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setAssistantEmotion("normal");
  };
  
  // Voice recognition functionality
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: i18n.language === "ru" ? "Не поддерживается" : "Not supported",
        description: i18n.language === "ru" 
          ? "Ваш браузер не поддерживает голосовой ввод"
          : "Your browser doesn't support voice input",
        variant: "destructive"
      });
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = i18n.language === "kz" ? "kk-KZ" : i18n.language === "ru" ? "ru-RU" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setAssistantEmotion("happy");
      toast({
        title: i18n.language === "ru" ? "Слушаю..." : "Listening...",
        description: i18n.language === "ru" 
          ? "Говорите сейчас!"
          : "Speak now!",
      });
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setAssistantEmotion("normal");
    };
    
    recognition.onerror = (event: any) => {
      setIsListening(false);
      setAssistantEmotion("normal");
      toast({
        title: i18n.language === "ru" ? "Ошибка" : "Error",
        description: i18n.language === "ru" 
          ? "Не удалось распознать речь. Попробуйте еще раз."
          : "Failed to recognize speech. Try again.",
        variant: "destructive"
      });
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setAssistantEmotion("normal");
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setAssistantEmotion("normal");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setInput("");
    chatMutation.mutate(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle clicking on assistant character
  const handleAssistantClick = () => {
    const emotions: Array<"normal" | "thinking" | "excited" | "happy"> = ["thinking", "excited", "happy"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setAssistantEmotion(randomEmotion);
    setTimeout(() => setAssistantEmotion("normal"), 2000);
  };

  return (
    <div className="min-h-screen py-8 relative z-10">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="text-center space-y-4 mb-6">
          <div className="flex justify-center mb-4">
            <HumanCharacter 
              size="medium" 
              emotion={assistantEmotion}
              animated={true}
              onClick={handleAssistantClick}
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" data-testid="text-chat-title">
            {t("chatWithAssistant")}
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            {t("askAboutDigitalurpaq")}
          </p>
        </div>

        <Card className="h-[600px] flex flex-col shadow-2xl border-2 border-purple-100 bg-white/90 backdrop-blur-sm" data-testid="chat-container">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
                data-testid={`chat-message-${index}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <HumanCharacter 
                      size="small" 
                      emotion={index === messages.length - 1 && !chatMutation.isPending ? assistantEmotion : "normal"}
                      animated={false}
                    />
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-gradient-to-r from-gray-50 to-purple-50 text-gray-800 border border-purple-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </motion.div>
                  
                  {message.role === "assistant" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(message.content)}
                        disabled={isSpeaking}
                        className="h-8 hover:bg-purple-100"
                        title={i18n.language === "ru" ? "Озвучить" : "Speak"}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-purple-600" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <HumanCharacter 
                    size="small" 
                    emotion="thinking"
                    animated={true}
                  />
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex gap-1">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-purple-100 p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={isListening ? stopListening : startListening}
                disabled={chatMutation.isPending}
                className="self-end shrink-0 border-2 border-purple-200"
                title={i18n.language === "ru" ? "Голосовой ввод" : "Voice input"}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <MicOff className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("typeYourMessage") || "Type your message..."}
                className="flex-1 resize-none border-2 border-purple-200 focus:border-purple-400 bg-white"
                rows={2}
                disabled={chatMutation.isPending || isListening}
                data-testid="chat-input"
              />
              <Button
                type="submit"
                disabled={!input.trim() || chatMutation.isPending}
                className="self-end shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            
            <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={speechEnabled}
                    onChange={(e) => setSpeechEnabled(e.target.checked)}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="font-medium">
                    {i18n.language === "ru" ? "Автоозвучка ответов" : "Auto-speak responses"}
                  </span>
                </label>
              </div>
              {isSpeaking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeaking}
                  className="h-6 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                >
                  {i18n.language === "ru" ? "Остановить" : "Stop"} <VolumeX className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
