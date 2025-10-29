import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
  const [assistantEmotion, setAssistantEmotion] = useState<"happy" | "thinking" | "excited" | "wink">("happy");
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
      setTimeout(() => setAssistantEmotion("happy"), 2000);
    },
    onError: (error: Error) => {
      setAssistantEmotion("happy");
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

  // Text-to-Speech functionality
  const speakText = (text: string) => {
    if (!speechEnabled || isSpeaking) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === "kz" ? "kk-KZ" : i18n.language === "ru" ? "ru-RU" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.2; // Slightly higher pitch for a friendly voice
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setAssistantEmotion("excited");
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setAssistantEmotion("happy");
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAssistantEmotion("happy");
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setAssistantEmotion("happy");
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
      setAssistantEmotion("wink");
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
      setAssistantEmotion("happy");
    };
    
    recognition.onerror = (event: any) => {
      setIsListening(false);
      setAssistantEmotion("happy");
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
      setAssistantEmotion("happy");
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setAssistantEmotion("happy");
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
    const emotions: Array<"happy" | "thinking" | "excited" | "wink"> = ["happy", "thinking", "excited", "wink"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setAssistantEmotion(randomEmotion);
    setTimeout(() => setAssistantEmotion("happy"), 2000);
  };

  // Animated assistant character component
  const AnimatedAssistant = ({ emotion }: { emotion: string }) => {
    const getMouthPath = () => {
      const emotionState = emotion || "happy";
      switch (emotionState) {
        case "happy":
          return "M 100 100 Q 120 112 140 100";
        case "thinking":
          return "M 105 102 L 135 102";
        case "excited":
          return "M 95 95 Q 120 118 145 95";
        case "wink":
          return "M 105 102 Q 120 108 135 102";
        default:
          return "M 100 100 Q 120 112 140 100";
      }
    };

    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAssistantClick}
        className="cursor-pointer"
        animate={emotion === "thinking" ? { rotate: [0, -3, 3, 0] } : {}}
        transition={{ duration: 1, repeat: emotion === "thinking" ? Infinity : 0 }}
      >
        <svg
          width="140"
          height="160"
          viewBox="0 0 240 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Head */}
          <ellipse cx="120" cy="80" rx="45" ry="50" fill="#FFE0BD" />
          
          {/* Hair */}
          <path d="M 75 60 Q 75 30 95 35 Q 105 25 120 25 Q 135 25 145 35 Q 165 30 165 60 Z" fill="#8B4513" />
          <circle cx="90" cy="50" r="12" fill="#8B4513" />
          <circle cx="150" cy="50" r="12" fill="#8B4513" />
          
          {/* Eyes */}
          <g>
            <ellipse cx="105" cy="75" rx="8" ry={emotion === "wink" ? "2" : "10"} fill="white" />
            <circle cx="107" cy="76" r={emotion === "wink" ? "0" : "5"} fill="#2C3E50" />
            <circle cx="108" cy="74" r={emotion === "wink" ? "0" : "2"} fill="white" />
          </g>
          <g>
            <ellipse cx="135" cy="75" rx="8" ry="10" fill="white" />
            <circle cx="137" cy="76" r="5" fill="#2C3E50" />
            <circle cx="138" cy="74" r="2" fill="white" />
          </g>
          
          {/* Eyebrows */}
          <path 
            d={emotion === "excited" ? "M 95 62 Q 100 58 110 60" : "M 95 65 Q 100 62 110 64"} 
            stroke="#8B4513" 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none" 
          />
          <path 
            d={emotion === "excited" ? "M 130 60 Q 140 58 145 62" : "M 130 64 Q 140 62 145 65"} 
            stroke="#8B4513" 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none" 
          />
          
          {/* Nose */}
          <ellipse cx="120" cy="88" rx="6" ry="8" fill="#FFD4A3" />
          
          {/* Smile */}
          <motion.path
            d={getMouthPath()}
            stroke="#E74C3C"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            animate={{ d: getMouthPath() }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Rosy cheeks */}
          <circle cx="85" cy="90" r="10" fill="#FFB6C1" opacity="0.5" />
          <circle cx="155" cy="90" r="10" fill="#FFB6C1" opacity="0.5" />
          
          {/* Neck */}
          <rect x="105" y="120" width="30" height="15" fill="#FFE0BD" />
          
          {/* Body - T-shirt */}
          <path d="M 70 135 L 85 145 L 85 220 L 155 220 L 155 145 L 170 135 L 165 155 L 155 155 L 155 240 L 85 240 L 85 155 L 75 155 Z" fill="#42A5F5" />
          
          {/* Collar */}
          <path d="M 105 135 L 105 145 L 120 150 L 135 145 L 135 135" fill="#1976D2" />
          
          {/* Arms */}
          <motion.g
            animate={emotion === "excited" ? { rotate: [-10, 10, -10] } : {}}
            transition={{ duration: 0.5, repeat: emotion === "excited" ? 3 : 0 }}
            style={{ transformOrigin: "65px 160px" }}
          >
            <ellipse cx="65" cy="180" rx="18" ry="50" fill="#FFE0BD" transform="rotate(-10 65 180)" />
            <path d="M 55 160 Q 45 165 50 175 L 65 170" fill="#42A5F5" />
          </motion.g>
          
          <ellipse cx="175" cy="180" rx="18" ry="50" fill="#FFE0BD" transform="rotate(10 175 180)" />
          <path d="M 185 160 Q 195 165 190 175 L 175 170" fill="#42A5F5" />
          
          {/* Hand holding tablet */}
          <rect x="90" y="200" width="60" height="45" rx="5" fill="#34495E" />
          <rect x="95" y="205" width="50" height="35" rx="2" fill="#3498DB" />
          
          {/* Tablet screen details */}
          <motion.circle 
            cx="120" 
            cy="222" 
            r="8" 
            fill="#2ECC71"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="120" y="227" fontSize="10" fill="white" textAnchor="middle">★</text>
        </svg>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-4">
            <AnimatedAssistant emotion={assistantEmotion} />
          </div>
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-chat-title">
            {t("chatWithAssistant")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("askAboutDigitalurpaq")}
          </p>
        </div>

        <Card className="h-[600px] flex flex-col" data-testid="chat-container">
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
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {message.role === "assistant" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(message.content)}
                        disabled={isSpeaking || !speechEnabled}
                        className="h-8"
                        title={i18n.language === "ru" ? "Озвучить" : "Speak"}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={isListening ? stopListening : startListening}
                disabled={chatMutation.isPending}
                className="self-end shrink-0"
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
                className="flex-1 resize-none"
                rows={2}
                disabled={chatMutation.isPending || isListening}
                data-testid="chat-input"
              />
              <Button
                type="submit"
                disabled={!input.trim() || chatMutation.isPending}
                className="self-end shrink-0"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            
            <div className="mt-2 flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={speechEnabled}
                    onChange={(e) => setSpeechEnabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>
                    {i18n.language === "ru" ? "Автоозвучка ответов" : "Auto-speak responses"}
                  </span>
                </label>
              </div>
              {isSpeaking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeaking}
                  className="h-6"
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
