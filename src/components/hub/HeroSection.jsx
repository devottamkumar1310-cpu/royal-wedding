import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useContent } from '../../hooks/useContent';

// ─── Countdown Timer ──────────────────────────────────────────────────────────
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex space-x-2 md:space-x-4 mt-3 md:mt-6">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-champagne-gold/30 bg-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.1)]">
            <span className="text-xs md:text-lg font-serif text-champagne-gold">{value}</span>
          </div>
          <span className="text-[7px] md:text-[9px] uppercase tracking-wide md:tracking-widest text-ivory/60 mt-1 md:mt-2 font-sans">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Local SVG components for Jharokha styling ──────────────────────────────
const ChhatriMotif = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 36"
    width="48"
    height="18"
    className="overflow-visible"
  >
    <defs>
      <linearGradient id="heroChhatriGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF0D0" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#AA7C11" />
      </linearGradient>
    </defs>
    <line x1="15" y1="32" x2="85" y2="32" stroke="url(#heroChhatriGrad)" strokeWidth="0.6" />
    <line x1="25" y1="29" x2="75" y2="29" stroke="url(#heroChhatriGrad)" strokeWidth="0.4" />
    <line x1="30" y1="29" x2="30" y2="22" stroke="url(#heroChhatriGrad)" strokeWidth="0.5" />
    <line x1="70" y1="29" x2="70" y2="22" stroke="url(#heroChhatriGrad)" strokeWidth="0.5" />
    <line x1="40" y1="29" x2="40" y2="20" stroke="url(#heroChhatriGrad)" strokeWidth="0.4" opacity="0.6" />
    <line x1="60" y1="29" x2="60" y2="20" stroke="url(#heroChhatriGrad)" strokeWidth="0.4" opacity="0.6" />
    <path d="M 30,22 Q 50,16 70,22" fill="none" stroke="url(#heroChhatriGrad)" strokeWidth="0.5" />
    <path
      d="M 26,22 C 26,22 28,10 50,6 C 72,10 74,22 74,22 Z"
      fill="#081826"
      stroke="url(#heroChhatriGrad)"
      strokeWidth="0.8"
    />
    <path
      d="M 34,22 C 34,22 36,13 50,10 C 64,13 66,22 66,22"
      fill="none"
      stroke="url(#heroChhatriGrad)"
      strokeWidth="0.4"
      opacity="0.5"
    />
    <line x1="50" y1="6" x2="50" y2="0" stroke="url(#heroChhatriGrad)" strokeWidth="0.6" />
    <circle cx="50" cy="1" r="1.2" fill="url(#heroChhatriGrad)" />
    <polygon points="50,-3 52,0 50,3 48,0" fill="url(#heroChhatriGrad)" />
    <circle cx="26" cy="22" r="0.8" fill="url(#heroChhatriGrad)" />
    <circle cx="74" cy="22" r="0.8" fill="url(#heroChhatriGrad)" />
  </svg>
);

const JharokhaCorner = ({ position = "top-left" }) => {
  let transform = "";
  if (position === "top-right") transform = "scaleX(-1)";
  if (position === "bottom-left") transform = "scaleY(-1)";
  if (position === "bottom-right") transform = "scale(-1, -1)";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width="38"
      height="38"
      className="absolute pointer-events-none z-10"
      style={{
        transform,
        top: position.includes("top") ? 1 : "auto",
        bottom: position.includes("bottom") ? 1 : "auto",
        left: position.includes("left") ? 1 : "auto",
        right: position.includes("right") ? 1 : "auto",
      }}
    >
      <defs>
        <linearGradient id="heroFiligreeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F3E5AB" />
        </linearGradient>
      </defs>
      <path
        d="M 0 0 L 100 0 C 100 0, 80 20, 80 50 C 80 80, 50 80, 50 100 L 0 100 Z"
        fill="none"
        stroke="url(#heroFiligreeGrad)"
        strokeWidth="1"
        opacity="0.65"
      />
      <path
        d="M 10 10 L 80 10 C 80 10, 60 25, 60 50 C 60 75, 25 75, 10 80 Z"
        fill="none"
        stroke="url(#heroFiligreeGrad)"
        strokeWidth="0.5"
        opacity="0.35"
      />
      <circle cx="20" cy="20" r="2" fill="url(#heroFiligreeGrad)" opacity="0.5" />
      <circle cx="40" cy="15" r="1" fill="url(#heroFiligreeGrad)" opacity="0.35" />
      <circle cx="15" cy="40" r="1" fill="url(#heroFiligreeGrad)" opacity="0.35" />
    </svg>
  );
};

const JharokhaHeader = () => (
  <svg
    viewBox="0 0 400 50"
    preserveAspectRatio="none"
    className="w-full h-12 md:h-16 text-champagne-gold overflow-visible"
    style={{ display: 'block' }}
  >
    <defs>
      <linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#F3E5AB" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* Rajasthani multi-cusped scalloped arch silhouette with fill & stroke */}
    <path
      d="M 0,50 L 0,30 C 40,30 60,25 80,20 C 100,15 120,4 200,4 C 280,4 300,15 320,20 C 340,25 360,30 400,30 L 400,50 Z"
      fill="#081826"
      stroke="url(#archGrad)"
      strokeWidth="1.2"
    />
    {/* Inner decorative arch scallop */}
    <path
      d="M 5,50 L 5,33 C 42,33 62,28 82,23 C 102,18 122,7 200,7 C 278,7 298,18 318,23 C 338,28 358,33 395,33 L 395,50"
      fill="none"
      stroke="url(#archGrad)"
      strokeWidth="0.5"
      opacity="0.5"
      strokeDasharray="2,2"
    />
    {/* Kalash center finial finian */}
    <line x1="200" y1="4" x2="200" y2="0" stroke="url(#archGrad)" strokeWidth="0.8" />
    <polygon points="200,-2 202,1 200,4 198,1" fill="url(#archGrad)" />
  </svg>
);

const HeroSection = () => {
  const { content } = useContent('hero');
  const hero = content || { couple_names: "POOJA & JAGDISH", date: "06 जुलाई 2026" };
  
  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  
  const names = hero.couple_names.split('&').map(s => s.trim());
  const name1 = formatName(names[0] || "Pooja");
  const name2 = formatName(names[1] || "Jagdish");
  
  const weddingDate = new Date("2026-07-06T09:00:00+05:30").getTime();

  return (
    <motion.div 
      key="hero"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-12 px-6 pt-6 pb-24"
    >
      {/* ── LEFT COLUMN: Jharokha Palace Container (62% desktop) ─────────────── */}
      <div className="w-full lg:w-[62%] flex flex-col justify-start relative select-none">
        {/* Top Scalloped Arch Header */}
        <JharokhaHeader />

        {/* Body container with double borders, styling matching our JharokhaCard */}
        <div className="w-full bg-royal-blue/35 border-x border-b border-champagne-gold/35 relative p-1 pb-1.5 flex flex-col">
          <div className="border border-champagne-gold/15 p-6 md:p-12 relative flex flex-col items-center text-center">
            
            {/* Corner filigrees inside */}
            <JharokhaCorner position="top-left" />
            <JharokhaCorner position="top-right" />
            <JharokhaCorner position="bottom-left" />
            <JharokhaCorner position="bottom-right" />

            {/* Shubh Vivah Title */}
            <h2 
              className="font-hindi text-center mb-2 md:mb-6 mt-2 text-transparent bg-gradient-to-b from-[#FFF0D0] via-[#D4AF37] to-[#B38728] bg-clip-text drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]"
              style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.65rem)', fontWeight: 400, letterSpacing: '0.08em' }}
            >
              शुभ विवाह
            </h2>
            
            {/* Pooja & Jagdish in Cormorant Garamond */}
            <h1 
              className="font-display text-transparent bg-gradient-to-b from-[#FFFDF9] via-[#E8DFC8] to-[#C5B595] bg-clip-text italic font-light mb-2 md:mb-6 flex flex-col items-center tracking-[0.03em] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]"
              style={{ fontSize: 'clamp(2.4rem, 7.5vw, 4.2rem)', lineHeight: 1.15 }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 1.0, ease: "easeOut" }}
              >
                {name1}
              </motion.span>
              {names.length > 1 && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 1.2, duration: 0.6, ease: "backOut" }} 
                  className="text-2xl md:text-3xl my-1 md:my-4 block italic tracking-normal normal-case text-transparent bg-gradient-to-b from-[#FFF0D0] via-[#D4AF37] to-[#B38728] bg-clip-text drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]"
                >
                  &amp;
                </motion.span> 
              )}
              {names.length > 1 && (
                <motion.span 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 1.5, duration: 1.0, ease: "easeOut" }}
                >
                  {name2}
                </motion.span>
              )}
            </h1>

            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-champagne-gold/45 to-transparent my-2 md:my-5"></div>

            {/* Date / Metadata */}
            <p className="text-xs md:text-base font-sans tracking-[0.12em] md:tracking-[0.18em] uppercase text-ivory/95 leading-snug md:leading-loose mb-2">
              {hero.date} <br/>
              <span className="text-champagne-gold/75 text-[11px] md:text-sm tracking-[0.08em]">Sojat, Rajasthan</span>
            </p>

            {/* Countdown timer */}
            <CountdownTimer targetDate={weddingDate} />
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Spotify Music Card (38% desktop) ─────────────────── */}
      <div className="w-full lg:w-[38%] flex flex-col justify-center items-center">
        {/* Double-nested border music card */}
        <div
          className="relative bg-royal-blue/35 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.65)] hover:bg-royal-blue/50 transition-all duration-500 group p-1.5 rounded-none border border-champagne-gold/35 hover:border-champagne-gold/60 w-full max-w-sm"
        >
          {/* Inner card wrapper */}
          <div className="border border-champagne-gold/15 p-4 relative min-h-[380px] flex flex-col justify-center items-center">
            {/* Top canopy spire finial */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 -top-[10px] pointer-events-none z-20"
            >
              <ChhatriMotif />
            </div>

            {/* Jharokha corners */}
            <JharokhaCorner position="top-left" />
            <JharokhaCorner position="top-right" />
            <JharokhaCorner position="bottom-left" />
            <JharokhaCorner position="bottom-right" />

            {/* Spotify Player Iframe */}
            <div className="w-full relative z-10">
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '8px' }} 
                src="https://open.spotify.com/embed/track/3uWQkslzoaKzbtOAjQxWNr?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;