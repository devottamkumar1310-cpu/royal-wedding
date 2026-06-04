import { motion } from 'framer-motion';

const Lantern = ({ className = "", width = "60", height = "120", delay = 0 }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 200"
      width={width}
      height={height}
      className={className}
      animate={{ y: ["-5px", "5px", "-5px"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <defs>
        <linearGradient id="lanternMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8c7322" />
          <stop offset="50%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#8c7322" />
        </linearGradient>
        <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 230, 150, 1)" />
          <stop offset="50%" stopColor="rgba(255, 200, 100, 0.6)" />
          <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
        </radialGradient>
      </defs>

      {/* Hanging Chain */}
      <line x1="50" y1="0" x2="50" y2="30" stroke="url(#lanternMetal)" strokeWidth="3" />
      
      {/* Top Cap */}
      <path d="M 35 30 L 65 30 L 75 50 L 25 50 Z" fill="url(#lanternMetal)" />
      <circle cx="50" cy="25" r="5" fill="url(#lanternMetal)" />

      {/* Glass Body Glow */}
      <motion.circle 
        cx="50" cy="90" r="40" 
        fill="url(#lanternGlow)" 
        animate={{ opacity: [0.7, 1, 0.7], r: [35, 45, 35] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}
      />
      
      {/* Glass Body */}
      <path d="M 30 50 L 70 50 L 80 130 L 20 130 Z" fill="rgba(255,255,255,0.1)" stroke="url(#lanternMetal)" strokeWidth="2" />
      <line x1="40" y1="50" x2="30" y2="130" stroke="url(#lanternMetal)" strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="50" x2="70" y2="130" stroke="url(#lanternMetal)" strokeWidth="1" opacity="0.5" />

      {/* Inner Flame */}
      <motion.path 
        d="M 50 70 C 45 90, 60 100, 50 115 C 40 100, 55 90, 50 70 Z" 
        fill="#ffcc00"
        animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ originX: '50%', originY: '115px' }}
      />

      {/* Bottom Cap */}
      <path d="M 20 130 L 80 130 L 65 150 L 35 150 Z" fill="url(#lanternMetal)" />
      
      {/* Tassel */}
      <path d="M 50 150 L 45 190 L 55 190 Z" fill="url(#lanternMetal)" opacity="0.8" />
    </motion.svg>
  );
};

export default Lantern;
