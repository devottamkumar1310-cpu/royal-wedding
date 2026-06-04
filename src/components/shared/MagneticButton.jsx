import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const MagneticButton = ({ children, onClick, className = "" }) => {
  const ref = useRef(null);
  
  // Subtle magnetic tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate center of button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Distance from center (dampened for subtlety)
    const distanceX = (clientX - centerX) * 0.1;
    const distanceY = (clientY - centerY) * 0.1;
    
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`relative group overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* The shimmering liquid reflection */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"
        style={{
          background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Content wrapper to ensure text stays above shimmer */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </motion.button>
  );
};

export default MagneticButton;
