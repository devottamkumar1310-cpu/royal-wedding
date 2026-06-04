/**
 * FloatingLanternLayer  (Global Atmosphere)
 *
 * Two atmospheric systems mounted globally — visible on every screen:
 *
 * LANTERNS — oval warm glows drifting bottom→top
 *   • Two drift paths (A = right-left-right, B = left-right-left)
 *   • 8 mobile / 13 desktop
 *   • 19–32s cycle, very low opacity (0.08–0.22)
 *   • Size 10–24px oval
 *
 * FESTIVAL LIGHTS — small warm dots drifting slowly upward
 *   • Think: temple candles, fireflies, festival dots
 *   • 12 mobile / 20 desktop
 *   • 8–18s cycle, opacity 0.14–0.40
 *   • Size 2–6px circles
 *   • Subtle horizontal drift — different to lanterns
 *
 * Performance contract:
 *   ─ 100% CSS @keyframes on `transform` + `opacity` only
 *   ─ Zero Framer Motion — zero JS per frame
 *   ─ No blur filters
 *   ─ `will-change: transform` isolates each element to its own GPU layer
 *   ─ Infinite loop — continuously replenishes from bottom
 *   ─ `pointer-events: none` — never intercepts clicks
 *   ─ z-index 1 — above solid background, below all content layers
 */

import { useEffect } from 'react';

// ─── Injected CSS (once per page load) ───────────────────────────────────────

const STYLE_ID = 'global-atmosphere-styles';

const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    /* ── Lantern paths ──────────────────────────────────────────────────── */

    @keyframes lanternA {
      0%   { transform: translateY(108vh) translateX(0px);   opacity: 0; }
      8%   { opacity: 1; }
      25%  { transform: translateY(78vh)  translateX(14px);  }
      50%  { transform: translateY(48vh)  translateX(-8px);  }
      75%  { transform: translateY(18vh)  translateX(16px);  }
      88%  { opacity: 1; }
      100% { transform: translateY(-10vh) translateX(6px);   opacity: 0; }
    }

    @keyframes lanternB {
      0%   { transform: translateY(108vh) translateX(0px);   opacity: 0; }
      8%   { opacity: 1; }
      25%  { transform: translateY(78vh)  translateX(-12px); }
      50%  { transform: translateY(48vh)  translateX(9px);   }
      75%  { transform: translateY(18vh)  translateX(-14px); }
      88%  { opacity: 1; }
      100% { transform: translateY(-10vh) translateX(-4px);  opacity: 0; }
    }

    /* ── Festival light paths ───────────────────────────────────────────── */
    /* Smaller drift range — these are close-in temple candle dots          */

    @keyframes festivalLightA {
      0%   { transform: translateY(104vh) translateX(0px);  opacity: 0; }
      10%  { opacity: 1; }
      30%  { transform: translateY(75vh)  translateX(5px);  }
      55%  { transform: translateY(44vh)  translateX(-4px); }
      80%  { transform: translateY(16vh)  translateX(6px);  opacity: 0.9; }
      92%  { opacity: 0.3; }
      100% { transform: translateY(-6vh)  translateX(2px);  opacity: 0; }
    }

    @keyframes festivalLightB {
      0%   { transform: translateY(104vh) translateX(0px);  opacity: 0; }
      10%  { opacity: 1; }
      30%  { transform: translateY(75vh)  translateX(-6px); }
      55%  { transform: translateY(44vh)  translateX(4px);  }
      80%  { transform: translateY(16vh)  translateX(-5px); opacity: 0.9; }
      92%  { opacity: 0.3; }
      100% { transform: translateY(-6vh)  translateX(-3px); opacity: 0; }
    }
  `;
  document.head.appendChild(el);
};

// ─── Static data (module-level — computed once) ───────────────────────────────

/*
 * Lanterns — oval warm glows. Positions spread deliberately so they never cluster.
 * [left%, size px, delay s, duration s, maxOpacity, path A|B]
 */
const LANTERN_POOL = [
  [  4, 18, 0.0,  22, 0.16, 'A' ],
  [ 11, 12, 5.2,  28, 0.10, 'B' ],
  [ 20, 22, 1.8,  20, 0.20, 'A' ],
  [ 28, 10, 9.0,  32, 0.08, 'B' ],
  [ 36, 20, 3.4,  24, 0.18, 'A' ],
  [ 45, 14, 7.1,  26, 0.12, 'B' ],
  [ 53, 24, 0.6,  19, 0.22, 'A' ],
  [ 62, 11, 11.5, 30, 0.09, 'B' ],
  [ 70, 19, 2.9,  23, 0.17, 'A' ],
  [ 79, 13, 6.3,  27, 0.11, 'B' ],
  [ 87, 21, 4.7,  21, 0.19, 'A' ],
  [ 93, 16, 8.8,  25, 0.14, 'B' ],
  [ 16, 15, 13.2, 29, 0.12, 'A' ],
];

/*
 * Festival lights — small warm golden/amber dots.
 * Faster, more numerous, smaller than lanterns.
 * Think: diyas floating at a river festival, fireflies in a temple garden.
 * [left%, size px, delay s, duration s, maxOpacity, path A|B]
 */
const FESTIVAL_LIGHT_POOL = [
  [  2, 3,  1.2,  10, 0.35, 'A' ],
  [  8, 2,  0.0,  14, 0.28, 'B' ],
  [ 13, 4,  6.4,   9, 0.40, 'A' ],
  [ 19, 2,  3.8,  16, 0.22, 'B' ],
  [ 25, 3,  0.9,  11, 0.35, 'A' ],
  [ 31, 5,  8.0,  13, 0.30, 'B' ],
  [ 37, 2,  2.2,  15, 0.25, 'A' ],
  [ 43, 4,  5.5,  10, 0.38, 'B' ],
  [ 49, 3,  0.4,  12, 0.32, 'A' ],
  [ 55, 2, 10.1,  18, 0.20, 'B' ],
  [ 61, 5,  3.0,   9, 0.40, 'A' ],
  [ 67, 3,  7.2,  14, 0.28, 'B' ],
  [ 73, 2,  1.6,  11, 0.33, 'A' ],
  [ 79, 4,  4.8,  16, 0.26, 'B' ],
  [ 85, 3,  9.3,  10, 0.36, 'A' ],
  [ 91, 2,  2.7,  13, 0.24, 'B' ],
  [ 96, 4,  6.1,  15, 0.30, 'A' ],
  [ 40, 3, 11.8,  12, 0.28, 'B' ],
  [ 58, 2,  0.2,   8, 0.40, 'A' ],
  [ 76, 5, 14.0,  17, 0.22, 'B' ],
];

// ─── Component ────────────────────────────────────────────────────────────────

const FloatingLanternLayer = () => {
  useEffect(() => {
    injectStyles();
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Mobile: 8 lanterns + 12 festival lights
  // Desktop: 13 lanterns + 20 festival lights
  const lanterns      = isMobile ? LANTERN_POOL.slice(0, 8)        : LANTERN_POOL;
  const festivalLights = isMobile ? FESTIVAL_LIGHT_POOL.slice(0, 12) : FESTIVAL_LIGHT_POOL;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        1,
        pointerEvents: 'none',
        overflow:      'hidden',
      }}
    >
      {/* ── Lanterns — large oval warm glows ─────────────────────────── */}
      {lanterns.map(([left, size, delay, duration, maxOpacity, path], i) => (
        <div
          key={`l${i}`}
          style={{
            position:     'absolute',
            bottom:       0,
            left:         `${left}%`,
            width:        size,
            height:       size * 1.4,
            borderRadius: '50%',
            background:   'radial-gradient(circle at 50% 40%, rgba(255,248,220,0.95) 0%, rgba(243,229,171,0.75) 28%, rgba(212,175,55,0.3) 60%, transparent 100%)',
            opacity:      maxOpacity,
            willChange:   'transform',
            animation:    `lantern${path} ${duration}s ${delay}s linear infinite`,
          }}
        />
      ))}

      {/* ── Festival lights — small golden dots (temple / firefly feel) ─ */}
      {festivalLights.map(([left, size, delay, duration, maxOpacity, path], i) => (
        <div
          key={`f${i}`}
          style={{
            position:     'absolute',
            bottom:       0,
            left:         `${left}%`,
            width:        size,
            height:       size,
            borderRadius: '50%',
            // Brighter warm core — golden amber for festival atmosphere
            background:   'radial-gradient(circle, rgba(255,240,180,1) 0%, rgba(255,210,100,0.85) 35%, rgba(212,175,55,0.4) 70%, transparent 100%)',
            opacity:      maxOpacity,
            willChange:   'transform',
            animation:    `festivalLight${path} ${duration}s ${delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingLanternLayer;
