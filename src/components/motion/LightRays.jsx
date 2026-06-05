/**
 * LightRays (Global — position: fixed)
 *
 * Atmospheric ambient light that stays stationary relative to the viewport.
 * Mounted once globally in App.jsx — visible on every screen.
 *
 * FIX: previously `position: absolute` inside RoyalScene, which made the
 * rays scroll/parallax with content. Now `position: fixed` so rays never move.
 *
 * Performance:
 *   – Animates only `opacity` and `skewX` — compositor thread
 *   – No blur filters
 *   – z-index 2 — above FloatingLanternLayer (z:1), below all content (z:10+)
 */

import { motion } from 'framer-motion';

const GlobalLightRays = () => (
  <div
    aria-hidden="true"
    style={{
      position:      'fixed',
      inset:         0,
      zIndex:        2,
      pointerEvents: 'none',
      overflow:      'hidden',
      mixBlendMode:  'normal',
      opacity:       0.5,
      transform:     'translateZ(0)',
      willChange:    'transform',
    }}
  >
    {/* Ambient radial bloom — blue-white ellipse from the top */}
    <motion.div
      style={{
        position: 'absolute',
        inset:    0,
        background:
          'radial-gradient(ellipse at 50% -10%, rgba(164, 195, 210, 0.15) 0%, rgba(253, 251, 247, 0.08) 45%, transparent 80%)',
      }}
      animate={{ opacity: [0.6, 0.95, 0.6], scale: [1, 1.04, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Ray 1 — left-centre, soft dusty blue drift */}
    <motion.div
      style={{
        position:   'absolute',
        top:        '-20%',
        left:       '15%',
        width:      '15%',
        height:     '150%',
        background: 'linear-gradient(to bottom, rgba(164, 195, 210, 0.05) 0%, transparent 100%)',
        transformOrigin: 'top center',
      }}
      animate={{
        opacity: [0.04, 0.12, 0.04],
        skewX:   ['-28deg', '-32deg', '-28deg'],
        x:       ['0%', '1.5%', '0%'],
      }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />

    {/* Ray 2 — right-centre, slow ivory drift */}
    <motion.div
      style={{
        position:   'absolute',
        top:        '-20%',
        left:       '65%',
        width:      '18%',
        height:     '150%',
        background: 'linear-gradient(to bottom, rgba(253, 251, 247, 0.06) 0%, transparent 100%)',
        transformOrigin: 'top center',
      }}
      animate={{
        opacity: [0.02, 0.08, 0.02],
        skewX:   ['-18deg', '-22deg', '-18deg'],
        x:       ['0%', '-1.5%', '0%'],
      }}
      transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
    />
  </div>
);

export default GlobalLightRays;
