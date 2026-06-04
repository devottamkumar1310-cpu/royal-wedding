import { motion } from 'framer-motion';

const Balloon = ({ className = "", width = "60", height = "100", delay = 0, color = "ivory" }) => {
  const gradientId = `balloonGrad_${color}`;
  
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 150"
      width={width}
      height={height}
      className={className}
      animate={{ y: ["0px", "-20px", "0px"], rotate: ["-2deg", "2deg", "-2deg"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={color === "gold" ? "#F3E5AB" : "#FFFFFF"} />
          <stop offset="70%" stopColor={color === "gold" ? "#D4AF37" : "#FFFFF0"} />
          <stop offset="100%" stopColor={color === "gold" ? "#8c7322" : "#e0e0d0"} />
        </radialGradient>
      </defs>

      {/* Balloon String */}
      <path d="M 50 100 C 45 110, 55 130, 50 150" fill="none" stroke="rgba(212,175,55,0.6)" strokeWidth="1" />
      
      {/* Balloon Body */}
      <path 
        d="M 50 10 C 20 10, 10 40, 20 70 C 30 90, 45 95, 50 100 C 55 95, 70 90, 80 70 C 90 40, 80 10, 50 10 Z" 
        fill={`url(#${gradientId})`} 
        opacity="0.9"
      />
      
      {/* Balloon Tie */}
      <path d="M 45 100 L 55 100 L 53 105 L 47 105 Z" fill={`url(#${gradientId})`} />
      
      {/* Highlight/Reflection */}
      <path d="M 35 25 C 25 35, 25 50, 30 60 C 32 50, 38 40, 45 35 C 40 32, 38 28, 35 25 Z" fill="#ffffff" opacity="0.4" />
    </motion.svg>
  );
};

export default Balloon;
