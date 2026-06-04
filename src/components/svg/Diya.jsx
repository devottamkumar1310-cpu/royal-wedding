import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Diya = ({ className = "", flipped = false }) => {
  // Memoize random delay to fix linter and desync multiple diyas
  const animDelay = useMemo(() => Math.random() * 2, []);

  return (
    <div className={`relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 ${className}`}>
      
      {/* Gentle Volumetric Glow behind the diya */}
      <motion.div 
        className="absolute bottom-2 w-20 h-20 bg-[radial-gradient(circle,rgba(212,175,55,0.25)_0%,transparent_60%)] rounded-full mix-blend-screen pointer-events-none"
        animate={{ scale: [1, 1.15, 0.95, 1.1, 1], opacity: [0.5, 0.8, 0.6, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: animDelay }}
      />
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        className="relative z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" 
        style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
      >
        <defs>
          <radialGradient id="flameGlow">
            <stop offset="0%" stopColor="#FFF" />
            <stop offset="25%" stopColor="#F3E5AB" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Diya Base (Champagne Gold) */}
        <g fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Base Stand */}
          <path d="M 40 85 L 70 85 M 45 80 L 65 80 M 55 85 L 55 70" />
          {/* Main Bowl */}
          <path d="M 25 55 C 25 80, 85 80, 85 55 Z" fill="rgba(11,48,70,0.9)" />
          {/* Bowl Detailing/Engraving */}
          <path d="M 35 62 Q 55 72 75 62" strokeWidth="1.5" opacity="0.6" />
          <path d="M 45 68 Q 55 72 65 68" strokeWidth="1.5" opacity="0.4" />
          {/* Spout for Flame */}
          <path d="M 20 50 Q 25 55 30 55 L 25 55 Z" fill="#D4AF37" />
        </g>

        {/* Flickering Flame (Positioned over the spout at X=25) */}
        <motion.path 
          d="M 25 52 Q 20 30 30 25 Q 26 38 29 50 Z" 
          fill="url(#flameGlow)" 
          stroke="none"
          style={{ transformOrigin: "25px 52px" }}
          animate={{ 
            scaleY: [1, 1.15, 0.9, 1.1, 1],
            skewX: [0, -6, 4, -3, 0],
            scaleX: [1, 0.95, 1.05, 0.95, 1]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: animDelay }}
        />
        
        {/* Core Hotspot of the Flame */}
        <motion.circle 
          cx="27" cy="48" r="2" fill="#FFF" stroke="none"
          animate={{ opacity: [0.6, 1, 0.7, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: animDelay }}
        />
      </svg>
      
      {/* Occasional Spark Particles */}
      <motion.div
        className="absolute bottom-[40%] left-[25%] w-[3px] h-[3px] bg-[#F3E5AB] rounded-full mix-blend-screen pointer-events-none"
        animate={{ y: [0, -35], x: [0, -10], opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: animDelay + 1, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-[45%] left-[30%] w-[2px] h-[2px] bg-[#D4AF37] rounded-full mix-blend-screen pointer-events-none"
        animate={{ y: [0, -25], x: [0, 8], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: animDelay + 3, ease: "easeOut" }}
      />
    </div>
  );
};

export default Diya;
