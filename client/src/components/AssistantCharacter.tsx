import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function AssistantCharacter() {
  const { t } = useTranslation();
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState("");
  const [bounce, setBounce] = useState(false);
  
  const messages = [
    t("readyToDiscover"),
    t("exploreClubs"),
    t("checkSchedule")
  ];
  
  // Idle bounce animation every 8-10 seconds
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }, 9000);
    
    return () => clearInterval(bounceInterval);
  }, []);
  
  // Speech bubble every 2-3 minutes
  useEffect(() => {
    const bubbleInterval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setBubbleMessage(randomMessage);
      setShowBubble(true);
      
      setTimeout(() => setShowBubble(false), 5000);
    }, 150000); // 2.5 minutes
    
    // Show initial bubble after 5 seconds
    const initialTimeout = setTimeout(() => {
      setBubbleMessage(messages[0]);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 5000);
    }, 5000);
    
    return () => {
      clearInterval(bubbleInterval);
      clearTimeout(initialTimeout);
    };
  }, [messages]);
  
  return (
    <div className="relative flex justify-center items-center" data-testid="assistant-character">
      {/* Speech Bubble */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 transition-all duration-200 ${
          showBubble ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        data-testid="speech-bubble"
      >
        <div className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-lg max-w-xs text-center relative">
          <p className="text-lg font-medium">{bubbleMessage}</p>
          {/* Tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45"></div>
        </div>
      </div>
      
      {/* Assistant Character - Friendly Teacher SVG */}
      <div
        className={`transition-transform duration-600 ${
          bounce ? "animate-bounce-subtle animate-wave" : ""
        }`}
        data-testid="assistant-svg"
      >
        <svg
          width="240"
          height="280"
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
          <g className="animate-blink">
            <ellipse cx="105" cy="75" rx="8" ry="10" fill="white" />
            <circle cx="107" cy="76" r="5" fill="#2C3E50" />
            <circle cx="108" cy="74" r="2" fill="white" />
          </g>
          <g className="animate-blink">
            <ellipse cx="135" cy="75" rx="8" ry="10" fill="white" />
            <circle cx="137" cy="76" r="5" fill="#2C3E50" />
            <circle cx="138" cy="74" r="2" fill="white" />
          </g>
          
          {/* Eyebrows */}
          <path d="M 95 65 Q 100 62 110 64" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 130 64 Q 140 62 145 65" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" fill="none" />
          
          {/* Nose */}
          <ellipse cx="120" cy="88" rx="6" ry="8" fill="#FFD4A3" />
          
          {/* Smile */}
          <path
            d="M 100 100 Q 120 112 140 100"
            stroke="#E74C3C"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
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
          
          {/* Arms - Left */}
          <g className="animate-wave">
            <ellipse cx="65" cy="180" rx="18" ry="50" fill="#FFE0BD" transform="rotate(-10 65 180)" />
            <path d="M 55 160 Q 45 165 50 175 L 65 170" fill="#42A5F5" />
          </g>
          
          {/* Arms - Right */}
          <ellipse cx="175" cy="180" rx="18" ry="50" fill="#FFE0BD" transform="rotate(10 175 180)" />
          <path d="M 185 160 Q 195 165 190 175 L 175 170" fill="#42A5F5" />
          
          {/* Hand holding tablet */}
          <rect x="90" y="200" width="60" height="45" rx="5" fill="#34495E" />
          <rect x="95" y="205" width="50" height="35" rx="2" fill="#3498DB" />
          
          {/* Tablet screen details */}
          <circle cx="120" cy="222" r="8" fill="#2ECC71" className="animate-pulse" />
          <text x="120" y="227" fontSize="10" fill="white" textAnchor="middle">★</text>
          
          {/* Legs */}
          <rect x="95" y="240" width="20" height="35" fill="#2C3E50" />
          <rect x="125" y="240" width="20" height="35" fill="#2C3E50" />
          
          {/* Shoes */}
          <ellipse cx="105" cy="275" rx="15" ry="8" fill="#E74C3C" />
          <ellipse cx="135" cy="275" rx="15" ry="8" fill="#E74C3C" />
        </svg>
      </div>
      
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(-5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 0.6s ease-in-out;
        }
        
        .animate-blink {
          animation: blink 4s infinite;
        }
        
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: 65px 160px;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
