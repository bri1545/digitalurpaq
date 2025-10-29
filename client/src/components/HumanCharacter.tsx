import { motion } from "framer-motion";

interface HumanCharacterProps {
  size?: "small" | "medium" | "large";
  emotion?: "normal" | "thinking" | "excited" | "happy";
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HumanCharacter({ 
  size = "medium", 
  emotion = "normal",
  animated = true,
  onClick,
  className = ""
}: HumanCharacterProps) {
  const sizeMap = {
    small: { width: 60, height: 60 },
    medium: { width: 200, height: 200 },
    large: { width: 300, height: 300 }
  };

  const dimensions = sizeMap[size];

  const containerVariants = animated ? {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } : {};

  const getMouthPath = () => {
    switch (emotion) {
      case "happy":
        return "M 95 105 Q 100 118 105 105";
      case "thinking":
        return "M 96 105 L 104 105";
      case "excited":
        return "M 92 100 Q 100 125 108 100";
      default:
        return "M 95 105 Q 100 112 105 105";
    }
  };

  const getEyeHeight = () => {
    return emotion === "happy" ? 3 : 7;
  };

  return (
    <motion.div
      className={`inline-block cursor-pointer ${className}`}
      variants={containerVariants}
      animate={animated ? "float" : undefined}
      whileHover={{ scale: 1.15, rotate: [0, -3, 3, 0] }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE0BD" />
            <stop offset="100%" stopColor="#FFD4A3" />
          </linearGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B6F47" />
            <stop offset="50%" stopColor="#6B5637" />
            <stop offset="100%" stopColor="#4A3728" />
          </linearGradient>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Head with subtle animation */}
        <motion.circle 
          cx="100" 
          cy="80" 
          r="38" 
          fill="url(#skinGradient)"
          filter="url(#shadow)"
          animate={emotion === "thinking" ? {
            rotate: [-2, 2, -2],
            transformOrigin: "100px 100px"
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Hair with wave animation */}
        <motion.path 
          d="M 62 68 Q 62 42 100 40 Q 138 42 138 68 Q 135 65 132 68 L 128 72 Q 123 64 118 68 L 113 72 Q 108 64 103 68 L 98 72 Q 93 64 88 68 L 83 72 Q 78 64 73 68 L 68 72 Q 65 66 62 68 Z" 
          fill="url(#hairGradient)"
          filter="url(#shadow)"
          animate={animated ? {
            d: [
              "M 62 68 Q 62 42 100 40 Q 138 42 138 68 Q 135 65 132 68 L 128 72 Q 123 64 118 68 L 113 72 Q 108 64 103 68 L 98 72 Q 93 64 88 68 L 83 72 Q 78 64 73 68 L 68 72 Q 65 66 62 68 Z",
              "M 62 70 Q 62 44 100 42 Q 138 44 138 70 Q 135 67 132 70 L 128 74 Q 123 66 118 70 L 113 74 Q 108 66 103 70 L 98 74 Q 93 66 88 70 L 83 74 Q 78 66 73 70 L 68 74 Q 65 68 62 70 Z",
              "M 62 68 Q 62 42 100 40 Q 138 42 138 68 Q 135 65 132 68 L 128 72 Q 123 64 118 68 L 113 72 Q 108 64 103 68 L 98 72 Q 93 64 88 68 L 83 72 Q 78 64 73 68 L 68 72 Q 65 66 62 68 Z"
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Eyes with blink animation */}
        <motion.g
          animate={animated ? {
            scaleY: [1, 0.1, 1],
          } : {}}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
          style={{ transformOrigin: "88px 76px" }}
        >
          <ellipse cx="88" cy="76" rx="7" ry={getEyeHeight()} fill="white" />
          <circle cx="88" cy="77" r="4.5" fill="#2C3E50" />
          <circle cx="89" cy="75" r="2" fill="white" />
        </motion.g>
        
        <motion.g
          animate={animated ? {
            scaleY: [1, 0.1, 1],
          } : {}}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }}
          style={{ transformOrigin: "112px 76px" }}
        >
          <ellipse cx="112" cy="76" rx="7" ry={getEyeHeight()} fill="white" />
          <circle cx="112" cy="77" r="4.5" fill="#2C3E50" />
          <circle cx="113" cy="75" r="2" fill="white" />
        </motion.g>
        
        {/* Animated eyebrows */}
        <motion.path 
          d={emotion === "excited" ? "M 78 66 Q 83 62 91 65" : emotion === "thinking" ? "M 78 70 Q 83 67 91 68" : "M 78 68 Q 83 65 91 67"} 
          stroke="#4A3728" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none"
          animate={emotion === "thinking" ? {
            d: ["M 78 70 Q 83 67 91 68", "M 78 68 Q 83 65 91 67", "M 78 70 Q 83 67 91 68"]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.path 
          d={emotion === "excited" ? "M 109 65 Q 117 62 122 66" : emotion === "thinking" ? "M 109 68 Q 117 67 122 70" : "M 109 67 Q 117 65 122 68"} 
          stroke="#4A3728" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none"
          animate={emotion === "thinking" ? {
            d: ["M 109 68 Q 117 67 122 70", "M 109 67 Q 117 65 122 68", "M 109 68 Q 117 67 122 70"]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Nose */}
        <path d="M 100 86 L 98 94 L 100 95 L 102 94 Z" fill="#FFD4A3" />
        
        {/* Animated Mouth */}
        <motion.path
          d={getMouthPath()}
          stroke="#E74C3C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={{ d: getMouthPath() }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Cheeks with pulse */}
        <motion.circle 
          cx="72" 
          cy="88" 
          r="9" 
          fill="#FFB6C1" 
          opacity="0.5"
          animate={emotion === "excited" || emotion === "happy" ? {
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle 
          cx="128" 
          cy="88" 
          r="9" 
          fill="#FFB6C1" 
          opacity="0.5"
          animate={emotion === "excited" || emotion === "happy" ? {
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Neck - more natural with shadow */}
        <path 
          d="M 92 115 Q 92 118 90 122 L 90 128 L 110 128 L 110 122 Q 108 118 108 115 Z" 
          fill="url(#skinGradient)"
        />
        <ellipse cx="100" cy="120" rx="8" ry="4" fill="#FFD4A3" opacity="0.3" />
        
        {/* Shoulders */}
        <ellipse cx="78" cy="130" rx="14" ry="8" fill="url(#shirtGradient)" filter="url(#shadow)" />
        <ellipse cx="122" cy="130" rx="14" ry="8" fill="url(#shirtGradient)" filter="url(#shadow)" />
        
        {/* Body - Shirt with breathing animation */}
        <motion.path 
          d="M 70 132 Q 70 136 74 140 L 74 172 L 126 172 L 126 140 Q 130 136 130 132 Q 126 134 122 138 L 115 134 L 100 138 L 85 134 L 78 138 Q 74 134 70 132 Z" 
          fill="url(#shirtGradient)"
          filter="url(#shadow)"
          animate={animated ? {
            scaleY: [1, 1.02, 1],
            transformOrigin: "100px 150px"
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* Collar */}
        <path d="M 90 132 L 90 140 L 100 144 L 110 140 L 110 132" fill="#1E40AF" />
        
        {/* Left Arm - with shoulder and elbow articulation */}
        <motion.g
          animate={emotion === "excited" ? {
            rotate: [-10, 20, -10],
            transformOrigin: "70px 135px"
          } : animated ? {
            rotate: [-2, 2, -2],
            transformOrigin: "70px 135px"
          } : {}}
          transition={{ duration: emotion === "excited" ? 0.5 : 3, repeat: Infinity }}
        >
          {/* Upper arm (shoulder to elbow) */}
          <ellipse cx="66" cy="142" rx="10" ry="18" fill="url(#shirtGradient)" />
          
          {/* Forearm + hand group with elbow pivot */}
          <motion.g
            animate={emotion === "excited" ? {
              rotate: [-10, 15, -10],
              transformOrigin: "66px 158px"
            } : animated ? {
              rotate: [-5, 8, -5],
              transformOrigin: "66px 158px"
            } : {}}
            transition={{ 
              duration: emotion === "excited" ? 0.4 : 2.5, 
              repeat: Infinity,
              delay: 0.2
            }}
          >
            {/* Forearm */}
            <ellipse cx="62" cy="165" rx="8" ry="14" fill="url(#skinGradient)" />
            {/* Hand */}
            <ellipse cx="60" cy="178" rx="7" ry="8" fill="url(#skinGradient)" />
          </motion.g>
        </motion.g>
        
        {/* Right Arm - with shoulder and elbow articulation */}
        <motion.g
          animate={animated ? {
            rotate: [2, -2, 2],
            transformOrigin: "130px 135px"
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Upper arm (shoulder to elbow) */}
          <ellipse cx="134" cy="142" rx="10" ry="18" fill="url(#shirtGradient)" />
          
          {/* Forearm + hand group with elbow pivot */}
          <motion.g
            animate={animated ? {
              rotate: [5, -8, 5],
              transformOrigin: "134px 158px"
            } : {}}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              delay: 0.3
            }}
          >
            {/* Forearm */}
            <ellipse cx="138" cy="165" rx="8" ry="14" fill="url(#skinGradient)" />
            {/* Hand */}
            <ellipse cx="140" cy="178" rx="7" ry="8" fill="url(#skinGradient)" />
          </motion.g>
        </motion.g>
        
        {/* Book in hands with glow */}
        <motion.g
          animate={animated ? {
            y: [0, -3, 0],
            filter: [
              "drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))",
              "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
              "drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <rect x="83" y="158" width="34" height="22" rx="2" fill="#DC2626" />
          <rect x="85" y="160" width="30" height="18" rx="1" fill="#FEF3C7" />
          <line x1="100" y1="160" x2="100" y2="178" stroke="#DC2626" strokeWidth="1.5" />
          <text x="100" y="172" fontSize="10" fill="#DC2626" textAnchor="middle" fontWeight="bold">AI</text>
        </motion.g>
        
        {/* Sparkles for excited emotion */}
        {emotion === "excited" && (
          <>
            <motion.path
              d="M 135 60 L 137 66 L 143 68 L 137 70 L 135 76 L 133 70 L 127 68 L 133 66 Z"
              fill="#FCD34D"
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.path
              d="M 65 60 L 67 66 L 73 68 L 67 70 L 65 76 L 63 70 L 57 68 L 63 66 Z"
              fill="#FCD34D"
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.5, 1.2, 0.5],
                rotate: [0, -180, -360]
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
            <motion.path
              d="M 100 50 L 102 55 L 107 57 L 102 59 L 100 64 L 98 59 L 93 57 L 98 55 Z"
              fill="#F97316"
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.3, 1, 0.3],
                y: [-5, 5, -5]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.25 }}
            />
          </>
        )}
        
        {/* Thought bubble for thinking */}
        {emotion === "thinking" && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <circle cx="130" cy="55" r="3" fill="white" stroke="#3B82F6" strokeWidth="1" />
            <circle cx="138" cy="48" r="5" fill="white" stroke="#3B82F6" strokeWidth="1" />
            <ellipse cx="150" cy="38" rx="15" ry="12" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="150" y="42" fontSize="14" fill="#3B82F6" textAnchor="middle">?</text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
