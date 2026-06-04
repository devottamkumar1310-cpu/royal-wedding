/**
 * CelebrationOverlay
 *
 * A lightweight, GPU-safe celebration sequence shown once when the user
 * enters the Wedding Hub for the first time.
 *
 * Zero external libraries. Pure CSS + Framer Motion only.
 * Technique:
 *   - Gold petals: CSS @keyframes (transform only, runs on compositor thread)
 *   - Central burst ring: Framer Motion scale + opacity (single node)
 *   - Hindi blessing text: Framer Motion opacity + y (single node)
 *   - Auto-dismisses after 3s
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Inject petal keyframes once
const PETAL_STYLE_ID = 'celebration-petal-styles';
const ensurePetalStyles = () => {
  if (document.getElementById(PETAL_STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = PETAL_STYLE_ID;
  el.textContent = `
    @keyframes petalFall {
      0%   { transform: translateY(-20px) rotate(0deg)   scale(0);   opacity: 0; }
      10%  { opacity: 1; scale: 1; }
      80%  { opacity: 0.8; }
      100% { transform: translateY(110vh) rotate(720deg) scale(0.6); opacity: 0; }
    }
  `;
  document.head.appendChild(el);
};

// Pre-computed petal data — generated once at module level so it doesn't
// re-run on re-render and doesn't block the main thread during animation.
const PETALS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left:     `${3 + (i / 28) * 94}%`,
  size:     6 + Math.random() * 8,
  delay:    Math.random() * 1.2,
  duration: 2.2 + Math.random() * 1.4,
  color:    i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#F3E5AB' : '#FFF8E7',
}));

const CelebrationOverlay = ({ onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    ensurePetalStyles();
    const t = setTimeout(() => {
      setVisible(false);
      // Give exit animation time to finish before unmounting
      setTimeout(onDone, 600);
    }, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ── Petals (CSS-driven, zero JS per frame) ── */}
          {PETALS.map((p) => (
            <div
              key={p.id}
              style={{
                position:  'absolute',
                top:       '-10px',
                left:      p.left,
                width:     p.size,
                height:    p.size,
                borderRadius: '50% 0 50% 0',
                background: p.color,
                willChange: 'transform',
                animation: `petalFall ${p.duration}s ${p.delay}s ease-in forwards`,
              }}
            />
          ))}

          {/* ── Central burst ring ── */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       rounded-full border-2 border-champagne-gold/60"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ width: 80, height: 80 }}
          />

          {/* ── Second ring, delayed ── */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       rounded-full border border-champagne-gold/40"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.25 }}
            style={{ width: 80, height: 80 }}
          />

          {/* ── Hindi blessing text ── */}
          <motion.div
            className="absolute top-[38%] left-1/2 -translate-x-1/2 text-center pointer-events-none"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            <p
              className="text-2xl md:text-4xl font-hindi text-champagne-gold"
              style={{ textShadow: '0 0 20px rgba(212,175,55,0.5)' }}
            >
              शुभकामनाएं
            </p>
            <p className="text-xs md:text-sm font-sans tracking-[0.2em] text-ivory/80 mt-2 uppercase">
              Welcome to the celebration
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay;
