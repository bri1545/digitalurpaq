import { motion } from "framer-motion";

interface BrainCharacterProps {
  size?: "small" | "medium" | "large";
  emotion?: "normal" | "thinking" | "excited" | "happy";
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BrainCharacter({ 
  size = "medium", 
  emotion = "normal",
  animated = true,
  onClick,
  className = ""
}: BrainCharacterProps) {
  const sizeMap = {
    small: { width: 60, height: 60 },
    medium: { width: 200, height: 200 },
    large: { width: 300, height: 300 }
  };

  const dimensions = sizeMap[size];

  // Get color based on emotion
  const getEmotionColors = () => {
    switch (emotion) {
      case "thinking":
        return {
          primary: "url(#brainGradientThinking)",
          glow: "#9333EA",
          synapse: "#A855F7"
        };
      case "excited":
        return {
          primary: "url(#brainGradientExcited)",
          glow: "#EF4444",
          synapse: "#F59E0B"
        };
      case "happy":
        return {
          primary: "url(#brainGradientHappy)",
          glow: "#10B981",
          synapse: "#34D399"
        };
      default:
        return {
          primary: "url(#brainGradientNormal)",
          glow: "#3B82F6",
          synapse: "#60A5FA"
        };
    }
  };

  const colors = getEmotionColors();

  const containerVariants = animated ? {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } : {};

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      filter: [
        `drop-shadow(0 0 10px ${colors.glow})`,
        `drop-shadow(0 0 25px ${colors.glow})`,
        `drop-shadow(0 0 10px ${colors.glow})`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`inline-block cursor-pointer ${className}`}
      variants={containerVariants}
      animate={animated ? "float" : undefined}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={pulseVariants}
        animate="pulse"
      >
        <defs>
          {/* Gradient definitions for different emotions */}
          <linearGradient id="brainGradientNormal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          
          <linearGradient id="brainGradientThinking" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
          
          <linearGradient id="brainGradientExcited" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          
          <linearGradient id="brainGradientHappy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main brain shape - left hemisphere */}
        <path
          d="M 100 40 
             Q 70 40, 55 60
             Q 45 75, 50 95
             Q 52 110, 60 125
             Q 70 140, 85 150
             Q 95 155, 100 155
             L 100 40 Z"
          fill={colors.primary}
          filter="url(#glow)"
        />

        {/* Main brain shape - right hemisphere */}
        <path
          d="M 100 40
             Q 130 40, 145 60
             Q 155 75, 150 95
             Q 148 110, 140 125
             Q 130 140, 115 150
             Q 105 155, 100 155
             L 100 40 Z"
          fill={colors.primary}
          filter="url(#glow)"
        />

        {/* Brain folds - left hemisphere */}
        <path
          d="M 60 70 Q 70 65, 80 70 T 95 75"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 58 85 Q 68 80, 78 85 T 95 90"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 62 100 Q 72 95, 82 100 T 95 105"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 68 115 Q 78 110, 88 115 T 98 120"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 75 130 Q 85 125, 95 130"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />

        {/* Brain folds - right hemisphere */}
        <path
          d="M 105 75 Q 115 70, 125 75 T 140 80"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 105 90 Q 115 85, 125 90 T 142 95"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 105 105 Q 115 100, 125 105 T 138 110"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 102 120 Q 112 115, 122 120 T 132 125"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 105 130 Q 115 125, 125 130"
          stroke="#E0E7FF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />

        {/* Animated neural connections */}
        {animated && (
          <>
            <motion.circle
              cx="75"
              cy="80"
              r="3"
              fill={colors.synapse}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.circle
              cx="125"
              cy="90"
              r="3"
              fill={colors.synapse}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.3
              }}
            />
            <motion.circle
              cx="70"
              cy="110"
              r="3"
              fill={colors.synapse}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.6
              }}
            />
            <motion.circle
              cx="130"
              cy="115"
              r="3"
              fill={colors.synapse}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.9
              }}
            />
            <motion.circle
              cx="90"
              cy="135"
              r="3"
              fill={colors.synapse}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 1.2
              }}
            />
            <motion.circle
              cx="110"
              cy="135"
              r="3"
              fill={colors.synapse}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 1.5
              }}
            />
          </>
        )}

        {/* Corpus callosum (connection between hemispheres) */}
        <ellipse
          cx="100"
          cy="100"
          rx="8"
          ry="40"
          fill="white"
          opacity="0.2"
        />

        {/* Highlight for 3D effect */}
        <ellipse
          cx="80"
          cy="60"
          rx="15"
          ry="10"
          fill="white"
          opacity="0.3"
        />
        <ellipse
          cx="120"
          cy="65"
          rx="12"
          ry="8"
          fill="white"
          opacity="0.3"
        />
      </motion.svg>
    </motion.div>
  );
}
