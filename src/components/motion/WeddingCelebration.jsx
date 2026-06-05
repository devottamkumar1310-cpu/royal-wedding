/**
 * WeddingCelebration — Royal Indian Wedding Reveal Sequence
 *
 * Fires when scratch card threshold is crossed.
 *
 * Performance contract:
 *   ─ CSS @keyframes: confetti, balloons, festival lights (compositor thread)
 *   ─ Framer Motion: gold burst (28 nodes, 1.1s) + 2 rings — unmount after 1.4s
 *   ─ All static data at MODULE LEVEL
 *   ─ pointer-events: none throughout
 *   ─ Balloons: INFINITE loop (not one-shot) — continuously rise
 *   ─ Auto-unmounts at 30s
 *
 * Confetti: 65 pieces, royal palette + rose-gold, tight 1.2s spread = strong burst
 * Balloons: 8 total, 3 speed classes (Slow/Mid/Fast), 10–15s lifetime, infinite loop
 * Gold burst: 28 particles, one-shot 1.1s
 */

import { motion } from 'framer-motion';
import { useEffect } from 'react';

// ─── CSS keyframes (injected once) ───────────────────────────────────────────

const STYLE_ID = 'wedding-celebration-css';

const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    /* ── Confetti — burst strongly then fall naturally ────────────────── */
    @keyframes wcConfetti {
      0%   { transform: translateY(-12vh) rotate(0deg)    scaleX(1);  opacity: 0; }
      4%   { opacity: 1; }
      28%  { transform: translateY(25vh)  rotate(240deg)  scaleX(-1); }
      58%  { transform: translateY(58vh)  rotate(490deg)  scaleX(1);  opacity: 0.9; }
      85%  { opacity: 0.6; }
      100% { transform: translateY(108vh) rotate(720deg)  scaleX(-1); opacity: 0; }
    }

    /* ── Festival lights (celebration foreground) ─────────────────────── */
    @keyframes wcLightRise {
      0%   { transform: translateY(4vh)    translateX(0px);   opacity: 0; }
      7%   { opacity: 1; }
      35%  { transform: translateY(-32vh)  translateX(16px);  }
      65%  { transform: translateY(-68vh)  translateX(-9px);  }
      88%  { opacity: 0.7; }
      100% { transform: translateY(-112vh) translateX(11px);  opacity: 0; }
    }

    /* ── Balloon SLOW — large, 13–15s, infinite loop ──────────────────── */
    @keyframes wcBalloonSlow {
      0%   { transform: translateY(110vh)  rotate(0deg);    opacity: 0; }
      5%   { opacity: 1; }
      22%  { transform: translateY(80vh)   rotate(2.5deg);  }
      44%  { transform: translateY(48vh)   rotate(-2deg);   }
      66%  { transform: translateY(18vh)   rotate(3deg);    }
      84%  { transform: translateY(-10vh)  rotate(-1.5deg); opacity: 0.85; }
      95%  { opacity: 0.1; }
      100% { transform: translateY(-20vh)  rotate(0deg);    opacity: 0; }
    }

    /* ── Balloon MID — medium, 10–12s, infinite loop ──────────────────── */
    @keyframes wcBalloonMid {
      0%   { transform: translateY(110vh)  rotate(0deg);   opacity: 0; }
      6%   { opacity: 1; }
      25%  { transform: translateY(78vh)   rotate(-3deg);  }
      50%  { transform: translateY(44vh)   rotate(2.5deg); }
      74%  { transform: translateY(12vh)   rotate(-2deg);  }
      86%  { opacity: 0.85; }
      96%  { opacity: 0.08; }
      100% { transform: translateY(-20vh)  rotate(1deg);   opacity: 0; }
    }

    /* ── Balloon FAST — small, distant, 8–10s, infinite loop ─────────── */
    @keyframes wcBalloonFast {
      0%   { transform: translateY(110vh)  rotate(0deg);   opacity: 0; }
      8%   { opacity: 0.8; }
      30%  { transform: translateY(76vh)   rotate(2deg);   }
      55%  { transform: translateY(40vh)   rotate(-2.5deg);}
      78%  { transform: translateY(8vh)    rotate(1.5deg); opacity: 0.7; }
      92%  { opacity: 0.08; }
      100% { transform: translateY(-20vh)  rotate(0deg);   opacity: 0; }
    }
  `;
  document.head.appendChild(s);
};

// ─── Module-level static data ─────────────────────────────────────────────────

// 28 particles for a stronger, more dramatic burst
const GOLD_BURST = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  const dist  = 60 + (i % 5) * 20;
  return {
    id:   i,
    x:    Math.cos(angle) * dist,
    y:    Math.sin(angle) * dist,
    size: 5 + (i % 4) * 3,
    col:  ['#FFC300', '#F3E5AB', '#B76E79', '#EDD080'][i % 4],
  };
});

// 65 pieces — tight 1.2s spread = strong celebratory burst
// Rose-gold #B76E79 added as requested
const CONFETTI_COLORS = ['#FFC300', '#F3E5AB', '#E8DFC8', '#C7D7B5', '#B76E79', '#EDD080', '#5FA8D3'];
const CONFETTI = Array.from({ length: 65 }, (_, i) => ({
  id:       i,
  color:    CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left:     `${0.8 + i * 1.52}%`,
  width:    i % 5 === 0 ? 6 : i % 3 === 0 ? 4 : 5,
  height:   i % 5 === 0 ? 6 : i % 3 === 0 ? 10 : 8,
  radius:   i % 5 === 0 ? '50%' : i % 4 === 0 ? '1px 5px' : '2px',
  delay:    (i / 65) * 1.2,           // all fire within 1.2s for strong burst
  duration: 2.5 + (i % 5) * 0.35,    // 2.5–4.2s — punchier than before
}));

const LIGHTS = Array.from({ length: 11 }, (_, i) => ({
  id:       i,
  left:     `${4 + i * 9}%`,
  size:     9 + (i % 4) * 4,
  delay:    i * 0.36,
  duration: 5.8 + (i % 3) * 1.6,
  opacity:  0.22 + (i % 3) * 0.08,
}));

// 8 balloons — INFINITE loop (not one-shot)
// All balloons start at 110vh and end at -20vh seamlessly
const BALLOONS = [
  { left: '5%',  size: 46, delay: 0.0,  dur: 14.5, path: 'Slow', col: '#FFC300', glow: 'rgba(212,175,55,0.32)' },
  { left: '16%', size: 34, delay: 2.4,  dur: 10.5, path: 'Mid',  col: '#F3E5AB', glow: 'rgba(243,229,171,0.26)' },
  { left: '29%', size: 28, delay: 0.8,  dur:  8.5, path: 'Fast', col: '#5FA8D3', glow: 'rgba(253,251,247,0.22)' },
  { left: '42%', size: 52, delay: 1.6,  dur: 15.0, path: 'Slow', col: '#E8DFC8', glow: 'rgba(232,223,200,0.24)' },
  { left: '56%', size: 36, delay: 0.4,  dur: 11.0, path: 'Mid',  col: '#C7D7B5', glow: 'rgba(199,215,181,0.26)' },
  { left: '70%', size: 26, delay: 3.2,  dur:  9.0, path: 'Fast', col: '#F3E5AB', glow: 'rgba(243,229,171,0.22)' },
  { left: '81%', size: 44, delay: 1.0,  dur: 13.5, path: 'Slow', col: '#FFC300', glow: 'rgba(212,175,55,0.30)' },
  { left: '93%', size: 30, delay: 5.5,  dur: 10.0, path: 'Mid',  col: '#E8DFC8', glow: 'rgba(232,223,200,0.20)' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const GoldBurst = () => (
  <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)' }}>
    {GOLD_BURST.map((p) => (
      <motion.div
        key={p.id}
        style={{
          position:     'absolute',
          width:        p.size,
          height:       p.size,
          borderRadius: '50%',
          background:   p.col,
          left:         -p.size / 2,
          top:          -p.size / 2,
          boxShadow:    `0 0 ${p.size * 1.8}px ${p.col}`,
        }}
        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
        animate={{ x: p.x, y: p.y, scale: [0, 2, 0], opacity: [1, 0.9, 0] }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    ))}
  </div>
);

const BurstRings = () => (
  <>
    <motion.div
      style={{
        position: 'absolute', left: '50%', top: '40%',
        width: 80, height: 80, marginLeft: -40, marginTop: -40,
        borderRadius: '50%',
        border: '2px solid rgba(212,175,55,0.8)',
      }}
      initial={{ scale: 0, opacity: 0.9 }}
      animate={{ scale: 6, opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    />
    <motion.div
      style={{
        position: 'absolute', left: '50%', top: '40%',
        width: 80, height: 80, marginLeft: -40, marginTop: -40,
        borderRadius: '50%',
        border: '1.5px solid rgba(183,110,121,0.5)',
      }}
      initial={{ scale: 0, opacity: 0.7 }}
      animate={{ scale: 4.5, opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
    />
    <motion.div
      style={{
        position: 'absolute', left: '50%', top: '40%',
        width: 80, height: 80, marginLeft: -40, marginTop: -40,
        borderRadius: '50%',
        border: '1px solid rgba(243,229,171,0.4)',
      }}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 3.2, opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
    />
  </>
);

const Confetti = () => (
  <>
    {CONFETTI.map((c) => (
      <div
        key={c.id}
        style={{
          position:     'absolute',
          top:          0,
          left:         c.left,
          width:        c.width,
          height:       c.height,
          borderRadius: c.radius,
          background:   c.color,
          willChange:   'transform',
          animation:    `wcConfetti ${c.duration}s ${c.delay}s ease-in both`,
        }}
      />
    ))}
  </>
);

const FestivalLights = () => (
  <>
    {LIGHTS.map((l) => (
      <div
        key={l.id}
        style={{
          position:     'absolute',
          bottom:       0,
          left:         l.left,
          width:        l.size,
          height:       l.size * 1.3,
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(255,248,220,0.95) 0%, rgba(243,229,171,0.8) 28%, rgba(212,175,55,0.3) 65%, transparent 100%)',
          opacity:      l.opacity,
          willChange:   'transform',
          animation:    `wcLightRise ${l.duration}s ${l.delay}s linear infinite`,
        }}
      />
    ))}
  </>
);

/*
 * Balloon — three-part visual (body oval + knot + string).
 * Now uses `infinite` fill-mode so balloons loop continuously.
 * Each balloon starts at 110vh and exits at -20vh — the loop gap is invisible.
 */
const Balloon = ({ col, glow, left, size, delay, dur, path }) => (
  <div
    style={{
      position:   'absolute',
      bottom:     '-200px',
      left,
      willChange: 'transform',
      // CHANGED: `both` → `infinite` for continuous looping
      animation:  `wcBalloon${path} ${dur}s ${delay}s cubic-bezier(0.35, 0, 0.65, 1) infinite`,
    }}
  >
    {/* Body */}
    <div
      style={{
        width:        size,
        height:       size * 1.28,
        borderRadius: '50% 50% 46% 46%',
        background:   `radial-gradient(circle at 33% 28%,
                          rgba(255,255,255,0.45) 0%,
                          ${col}EE 42%,
                          ${col}BB 76%,
                          ${col}88 100%)`,
        boxShadow:    `0 0 ${Math.round(size * 0.55)}px ${glow},
                       inset 0 -6px 10px rgba(0,0,0,0.10)`,
      }}
    />
    {/* Knot */}
    <div
      style={{
        width:        7,
        height:       7,
        borderRadius: '50%',
        background:   col,
        margin:       '0 auto',
        marginTop:    '-1px',
        boxShadow:    `0 0 5px ${glow}`,
      }}
    />
    {/* String */}
    <div
      style={{
        width:      1,
        height:     Math.round(size * 1.5),
        margin:     '0 auto',
        background: `linear-gradient(to bottom, ${col}88, transparent)`,
      }}
    />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const WeddingCelebration = ({ onComplete }) => {
  useEffect(() => {
    injectStyles();
    // 30s — long enough for multiple balloon loop cycles to be visible
    const t = setTimeout(() => onComplete?.(), 30000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        60,
        overflow:      'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* L1 — Festival lights */}
      <FestivalLights />

      {/* L2 — Confetti burst */}
      <Confetti />

      {/* L3 — Balloons (infinite loop) */}
      {BALLOONS.map((b, i) => (
        <Balloon key={i} {...b} />
      ))}

      {/* L4 — Gold burst + rings (one-shot, ~1.4s) */}
      <GoldBurst />
      <BurstRings />
    </div>
  );
};

export default WeddingCelebration;
