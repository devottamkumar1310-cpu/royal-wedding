import { motion } from 'framer-motion';

const LightRays = ({ intensity = 0.5, direction = "top" }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-70 z-0">
      
      {/* Ambient Breathing Bloom */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${direction === 'top' ? '50% -10%' : '50% 110%'}, rgba(243, 229, 171, ${intensity}) 0%, rgba(212, 175, 55, ${intensity * 0.3}) 40%, transparent 80%)`,
          filter: 'blur(40px)'
        }}
        animate={{ 
          opacity: [0.6, 0.9, 0.6],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Subtle Floating Light Rays */}
      <motion.div 
        className="absolute top-[-20%] left-[15%] w-[15%] h-[150%] bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-transparent transform origin-top blur-[2px]"
        animate={{ 
          opacity: [0.1, 0.25, 0.1],
          skewX: ["-28deg", "-32deg", "-28deg"],
          x: ["0%", "2%", "0%"]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute top-[-20%] left-[65%] w-[20%] h-[150%] bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-transparent transform origin-top blur-[4px]"
        animate={{ 
          opacity: [0.05, 0.15, 0.05],
          skewX: ["-18deg", "-22deg", "-18deg"],
          x: ["0%", "-2%", "0%"]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
};

export default LightRays;
