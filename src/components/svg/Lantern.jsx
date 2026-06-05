import { motion } from 'framer-motion';
import { useId } from 'react';

// F1 FIX: Unique gradient IDs per instance via useId()
// F4 FIX: SVG `r` attribute animation removed — replaced with opacity-only pulse
//         Animating `r` forces SVG geometry recalc + repaint every frame.
//         Pure opacity pulsing achieves the same warm glow effect at zero layout cost.

const Lantern = ({ className = "", width = "60", height = "120", delay = 0 }) => {
  const rawId     = useId();
  const uid       = rawId.replace(/:/g, '-');
  const metalId   = `lanternMetal-${uid}`;
  const glowId    = `lanternGlow-${uid}`;

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
        {/* F1: IDs are now unique per Lantern instance */}
        <linearGradient id={metalId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FFC300" />
          <stop offset="50%"  stopColor="#5FA8D3" />
          <stop offset="100%" stopColor="#FFC300" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255, 248, 230, 1)" />
          <stop offset="50%"  stopColor="rgba(253, 251, 247, 0.7)" />
          <stop offset="100%" stopColor="rgba(164, 195, 210, 0)" />
        </radialGradient>
      </defs>

      {/* Hanging Chain */}
      <line x1="50" y1="0" x2="50" y2="30" stroke={`url(#${metalId})`} strokeWidth="3" />
      
      {/* Top Cap */}
      <path d="M 35 30 L 65 30 L 75 50 L 25 50 Z" fill={`url(#${metalId})`} />
      <circle cx="50" cy="25" r="5" fill={`url(#${metalId})`} />

      {/* Glass Body Glow — F4: animate opacity only, NOT `r` */}
      <motion.circle 
        cx="50" cy="90" r="40" 
        fill={`url(#${glowId})`}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}
      />
      
      {/* Glass Body (Ivory Paper Appearance) */}
      <path d="M 30 50 L 70 50 L 80 130 L 20 130 Z" fill="rgba(253,251,247,0.96)" stroke={`url(#${metalId})`} strokeWidth="2.5" />
      <line x1="40" y1="50" x2="30" y2="130" stroke={`url(#${metalId})`} strokeWidth="1.2" opacity="0.6" />
      <line x1="60" y1="50" x2="70" y2="130" stroke={`url(#${metalId})`} strokeWidth="1.2" opacity="0.6" />

      {/* Inner Flame (Matte Gold) */}
      <motion.path 
        d="M 50 70 C 45 90, 60 100, 50 115 C 40 100, 55 90, 50 70 Z" 
        fill="#FFC300"
        animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ originX: '50%', originY: '115px' }}
      />

      {/* Bottom Cap */}
      <path d="M 20 130 L 80 130 L 65 150 L 35 150 Z" fill={`url(#${metalId})`} />
      
      {/* Tassel */}
      <path d="M 50 150 L 45 190 L 55 190 Z" fill={`url(#${metalId})`} opacity="0.8" />
    </motion.svg>
  );
};

export default Lantern;
