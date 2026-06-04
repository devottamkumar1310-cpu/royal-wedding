import { useMemo, useEffect } from 'react';

// Inject CSS keyframes once into the document head
const STYLE_ID = 'sky-lantern-styles';
const ensureStyles = () => {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes lanternRise {
      0%   { transform: translateY(115vh) translateX(0px);   opacity: 0; }
      10%  { opacity: 1; }
      45%  { transform: translateY(50vh)  translateX(30px);  }
      70%  { transform: translateY(20vh)  translateX(-15px); }
      90%  { opacity: 0.6; }
      100% { transform: translateY(-15vh) translateX(20px);  opacity: 0; }
    }
  `;
  document.head.appendChild(el);
};

const SkyLanterns = ({ count = 5 }) => {
  useEffect(() => { ensureStyles(); }, []);

  const lanterns = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left:     `${8 + Math.random() * 84}%`,
      size:     14 + Math.random() * 28,
      delay:    Math.random() * 18,
      duration: 28 + Math.random() * 24,
      opacity:  0.12 + Math.random() * 0.28,
    })), [count]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {lanterns.map((l) => (
        <div
          key={l.id}
          style={{
            position: 'absolute',
            bottom: 0,
            left: l.left,
            width:  l.size,
            height: l.size * 1.35,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(243,229,171,0.7) 30%, rgba(212,175,55,0.3) 70%, transparent 100%)',
            opacity: l.opacity,
            willChange: 'transform',
            animation: `lanternRise ${l.duration}s ${l.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default SkyLanterns;
