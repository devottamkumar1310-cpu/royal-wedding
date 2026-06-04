import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

// F6 FIX: Added `type` prop (default 'button') forwarded to <motion.button>.
// Without this, MagneticButton inside a <form> context (BlessingsWall, RsvpWidget)
// relied on the browser's implicit type="submit" inference, which is unreliable
// on older Android WebView and Samsung Internet.

const MagneticButton = ({ children, onClick, className = '', type = 'button' }) => {
  const ref = useRef(null);
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (isTouchDevice || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((e.clientX - (left + width  / 2)) * 0.1);
    y.set((e.clientY - (top  + height / 2)) * 0.1);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isTouchDevice ? undefined : { x: springX, y: springY }}
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </motion.button>
  );
};

export default MagneticButton;
