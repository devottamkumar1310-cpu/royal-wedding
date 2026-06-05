import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const ParticleShape = ({ type, size, color }) => {
  if (type === 0) {
    // Petal (Rose, soft pink, or ivory)
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: 'block' }}>
        <path d="M12,2 C15,8 20,12 18,17 C16,21 8,21 6,17 C4,12 9,8 12,2 Z" opacity="0.9" />
      </svg>
    );
  }
  if (type === 1) {
    // Leaf (Eucalyptus or Vine)
    const isEucalyptus = (size * 10) % 2 === 0;
    if (isEucalyptus) {
      // Rounded Eucalyptus leaf
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: 'block' }}>
          <path d="M12,2 C17,6 18,13 14,17 C10,21 6,19 6,14 C6,9 9,4 12,2 Z" opacity="0.85" />
        </svg>
      );
    }
    // Pointy Vine leaf
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: 'block' }}>
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.58,20C10.66,20 16,18 20,12C21,10.5 20.3,9.04 17,8Z" opacity="0.85" />
      </svg>
    );
  }
  if (type === 2) {
    // Sparkle ✦
    return (
      <span style={{ fontSize: `${size}px`, color: color, lineHeight: 1, display: 'block' }}>✦</span>
    );
  }
  // Butterfly (soft blue, ivory, or blush pink)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: 'block' }}>
      <path d="M12,10C11.5,8 8,3 4,4C3,4.5 3,7 6,11C4,12 2,14.5 2,16C2.5,17 6,15 12,12C18,15 21.5,17 22,16C22,14.5 20,12 18,11C21,7 21,4.5 20,4C16,3 12.5,8 12,10Z" />
    </svg>
  );
};

const ParticleSystem = ({ count = 30 }) => {
  // Halve particle count on mobile to protect the JS animation thread
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const effectiveCount = isMobile ? Math.floor(count / 2) : count;
  const [particles, setParticles] = useState([]);

  // Mouse tracking for fluid parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const translateX = useTransform(springX, [-0.5, 0.5], ["-20px", "20px"]);
  const translateY = useTransform(springY, [-0.5, 0.5], ["-20px", "20px"]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: effectiveCount }).map((_, i) => {
      // Determine type based on index to enforce exact ratios:
      // Flowers/Petals: 40%, Leaves: 35%, Butterflies: 20%, Sparkles: 5%
      const ratio = i / effectiveCount;
      let type = 0;
      let minSize = 6;
      let maxSize = 12;
      let opacityPeak = 0.3;
      let color = '#F4A9C0';

      if (ratio < 0.40) {
        // Flowers / Petals (type 0): 40% (rose, soft pink, or ivory)
        type = 0;
        minSize = 8;
        maxSize = 16;
        opacityPeak = Math.random() * (0.4 - 0.2) + 0.2;
        const rColor = Math.random();
        if (rColor < 0.45) color = '#F4A9C0'; // soft pink
        else if (rColor < 0.75) color = '#C45B7A'; // rose pink
        else color = '#FAF0E6'; // ivory
      } else if (ratio < 0.75) {
        // Leaves (type 1): 35% (dark green or sage green)
        type = 1;
        minSize = 6;
        maxSize = 10;
        opacityPeak = Math.random() * (0.4 - 0.2) + 0.2;
        color = Math.random() > 0.5 ? '#3D7A30' : '#9DB893';
      } else if (ratio < 0.95) {
        // Butterflies (type 3): 20% (soft blue, ivory, or blush pink)
        type = 3;
        minSize = 10;
        maxSize = 14;
        opacityPeak = Math.random() * (0.4 - 0.25) + 0.25;
        const rColor = Math.random();
        if (rColor < 0.45) color = '#6B9FE8'; // soft blue
        else if (rColor < 0.75) color = '#FAF0E6'; // ivory
        else color = '#F4A9C0'; // blush pink
      } else {
        // Gold Sparkles (type 2): 5% (gold)
        type = 2;
        minSize = 3;
        maxSize = 5;
        opacityPeak = Math.random() * (0.3 - 0.15) + 0.15;
        color = '#D4922A';
      }

      const startRotation = Math.random() * 360;
      // Petals/Leaves rotate/spin more during descent; sparkles stay still; butterflies sway gently
      const rotationRange = type === 0 
        ? (Math.random() > 0.5 ? 360 : -360) 
        : type === 1 
        ? (Math.random() - 0.5) * 180 
        : type === 3 
        ? (Math.random() - 0.5) * 60 
        : 0;

      return {
        id: i,
        type,
        color,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * 20 + 20, // Even slower float speed (20s to 40s) for peaceful mood
        delay: Math.random() * 8,
        dx: (Math.random() - 0.5) * 12,
        opacityPeak,
        startRotation,
        rotationRange,
      };
    });
    setParticles(generatedParticles);

    // Only add mouse-parallax on desktop — no-op cost on touch devices
    if (!isMobile) {
      const handleMouseMove = (e) => {
        const xPct = e.clientX / window.innerWidth - 0.5;
        const yPct = e.clientY / window.innerHeight - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [effectiveCount, mouseX, mouseY, isMobile]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ x: translateX, y: translateY }}
    >
      {particles.map(p => {
        const xPath = p.type === 3
          ? ["0vw", `${p.dx * 0.5}vw`, `${p.dx * -0.2}vw`, `${p.dx * 0.8}vw`, `${p.dx}vw`]
          : ["0vw", `${p.dx}vw`];
        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: ["0vh", "-100vh"],
              x: xPath,
              opacity: [0, p.opacityPeak, 0],
              rotate: [p.startRotation, p.startRotation + p.rotationRange],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          >
            <ParticleShape type={p.type} size={p.size} color={p.color} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ParticleSystem;
