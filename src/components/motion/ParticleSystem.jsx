import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const ParticleSystem = ({ count = 30, color = "#D4AF37" }) => {
  const [particles, setParticles] = useState([]);

  // Mouse tracking for fluid parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const translateX = useTransform(springX, [-0.5, 0.5], ["-20px", "20px"]);
  const translateY = useTransform(springY, [-0.5, 0.5], ["-20px", "20px"]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 4 + 1, // 1px to 5px
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);

    const handleMouseMove = (e) => {
      const xPct = e.clientX / window.innerWidth - 0.5;
      const yPct = e.clientY / window.innerHeight - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [count, mouseX, mouseY]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ x: translateX, y: translateY }}
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
          animate={{
            y: ["0vh", "-100vh"],
            x: ["0vw", `${(Math.random() - 0.5) * 20}vw`],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  );
};

export default ParticleSystem;
