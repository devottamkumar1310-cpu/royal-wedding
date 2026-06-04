import { motion } from 'framer-motion';
import { useMemo } from 'react';

const SkyLanterns = ({ count = 12 }) => {
  const lanterns = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      size: 15 + Math.random() * 35, // Random sizes
      delay: Math.random() * 20, // Stagger widely
      duration: 25 + Math.random() * 30, // Slow upward movement
      drift: -40 + Math.random() * 80, // Side drift
      blur: 2 + Math.random() * 8, // Depth of field blur
      opacity: 0.2 + Math.random() * 0.6, // Different opacities
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
      {lanterns.map((lantern) => (
        <motion.div
          key={lantern.id}
          className="absolute bottom-0 rounded-full"
          style={{ 
            left: lantern.left, 
            width: lantern.size, 
            height: lantern.size * 1.3, // Slightly oval
            background: 'radial-gradient(circle, #FFF 0%, #F3E5AB 30%, #D4AF37 70%, transparent 100%)',
            filter: `blur(${lantern.blur}px)`,
            boxShadow: `0 0 ${lantern.size}px ${lantern.size/2}px rgba(212,175,55,0.4)`
          }}
          initial={{ y: "15vh", opacity: 0, x: 0 }}
          animate={{
            y: ["15vh", "-115vh"],
            opacity: [0, lantern.opacity, lantern.opacity * 0.8, lantern.opacity, 0],
            x: [0, lantern.drift, -lantern.drift/2, lantern.drift]
          }}
          transition={{
            duration: lantern.duration,
            repeat: Infinity,
            delay: lantern.delay,
            ease: "linear",
            opacity: { times: [0, 0.2, 0.5, 0.8, 1], duration: lantern.duration },
            x: { duration: lantern.duration, ease: "easeInOut", repeat: Infinity, repeatType: 'mirror' }
          }}
        />
      ))}
    </div>
  );
};

export default SkyLanterns;
