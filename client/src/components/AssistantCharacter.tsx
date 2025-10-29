import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HumanCharacter } from "./HumanCharacter";

export function AssistantCharacter() {
  const { t } = useTranslation();
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState("");
  const [emotion, setEmotion] = useState<"normal" | "thinking" | "excited" | "happy">("normal");
  
  const messages = [
    t("readyToDiscover"),
    t("exploreClubs"),
    t("checkSchedule")
  ];
  
  // Speech bubble every 2-3 minutes
  useEffect(() => {
    const bubbleInterval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setBubbleMessage(randomMessage);
      setShowBubble(true);
      setEmotion("happy");
      
      setTimeout(() => {
        setShowBubble(false);
        setEmotion("normal");
      }, 5000);
    }, 150000); // 2.5 minutes
    
    // Show initial bubble after 5 seconds
    const initialTimeout = setTimeout(() => {
      setBubbleMessage(messages[0]);
      setShowBubble(true);
      setEmotion("excited");
      setTimeout(() => {
        setShowBubble(false);
        setEmotion("normal");
      }, 5000);
    }, 5000);
    
    return () => {
      clearInterval(bubbleInterval);
      clearTimeout(initialTimeout);
    };
  }, [messages]);

  const handleClick = () => {
    const emotions: Array<"normal" | "thinking" | "excited" | "happy"> = ["thinking", "excited", "happy"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setEmotion(randomEmotion);
    setTimeout(() => setEmotion("normal"), 2000);
  };
  
  return (
    <div className="relative flex justify-center items-center" data-testid="assistant-character">
      {/* Speech Bubble */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          showBubble ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
        data-testid="speech-bubble"
      >
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-3xl shadow-2xl max-w-xs text-center relative backdrop-blur-sm">
          <p className="text-lg font-semibold">{bubbleMessage}</p>
          {/* Tail */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rotate-45"></div>
        </div>
      </div>
      
      {/* Human Character */}
      <HumanCharacter 
        size="large" 
        emotion={emotion}
        animated={true}
        onClick={handleClick}
      />
    </div>
  );
}
