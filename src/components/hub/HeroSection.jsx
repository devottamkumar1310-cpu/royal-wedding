import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useContent } from '../../hooks/useContent';
import { 
  FloralClusterTopLeft, 
  FloralClusterBottomRight,
  FloralBranchEdgeLeft,
  FloralBranchEdgeRight
} from '../svg/BotanicalDecor';

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
    <div className="relative z-10 flex space-x-2 md:space-x-4 mt-4 md:mt-8">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-md bg-white border border-[#E0E0E0] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
            <span className="text-sm md:text-xl font-lato font-normal text-[#5C3F2A]">{value}</span>
          </div>
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.12em] text-[#5C3F2A]/60 mt-1.5 md:mt-2 font-lato font-light">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

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
      {/* ── LEFT COLUMN: Invitation Card ─────────────── */}
      <div className="w-full lg:w-[62%] flex flex-col justify-start relative select-none">
        {/* Clean, editorial invitation card container */}
        <div className="w-full bg-stationery-gradient relative p-8 md:p-16 flex flex-col items-center text-center shadow-luxe-medium rounded-sm overflow-hidden">
          {/* Hero Floral Composition */}
          <FloralClusterTopLeft className="absolute top-0 left-0 opacity-[0.85] w-24 md:w-36 pointer-events-none select-none" />
          <FloralClusterBottomRight className="absolute bottom-0 right-0 opacity-[0.85] w-24 md:w-36 pointer-events-none select-none" />
          <FloralBranchEdgeLeft className="absolute left-0 top-[20%] opacity-[0.70] w-14 md:w-20 pointer-events-none select-none" />
          <FloralBranchEdgeRight className="absolute right-0 top-[20%] opacity-[0.70] w-14 md:w-20 pointer-events-none select-none" />
          
          {/* Shubh Vivah Title */}
          <h2 
            className="font-cormorant text-center mb-2 md:mb-6 mt-2 text-sacred-gold uppercase tracking-[0.15em] text-xs md:text-sm font-semibold"
          >
            शुभ विवाह
          </h2>
          
          {/* Pooja & Jagdish couple names */}
          <h1 
            className="font-greatvibes text-rose-accent mb-2 md:mb-6 flex flex-col items-center"
            style={{ fontSize: 'clamp(3rem, 8.5vw, 4.5rem)', lineHeight: 1.1 }}
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
                className="font-cormorant italic text-lg md:text-xl my-1 md:my-3 block text-rose-accent"
              >
                with
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

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B2C9A7]/30 to-transparent my-3 md:my-6"></div>

          {/* Date / Metadata */}
          <p className="text-xs md:text-sm font-lato font-light tracking-[0.12em] md:tracking-[0.15em] uppercase text-[#5C3F2A]/70 mb-2 leading-relaxed">
            {hero.date} <br/>
            <span className="text-rose-accent text-xs md:text-sm tracking-[0.08em] font-medium mt-1.5 block">Sojat, Rajasthan</span>
          </p>

          {/* Countdown timer */}
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </div>

      {/* ── RIGHT COLUMN: Spotify Music Card ─────────────────── */}
      <div className="w-full lg:w-[38%] flex flex-col justify-center items-center">
        <div
          className="relative bg-stationery-gradient shadow-luxe-medium p-4 rounded-sm w-full max-w-sm flex flex-col justify-center items-center"
        >
          {/* Spotify Player Iframe */}
          <div className="w-full relative z-10">
            <iframe 
              data-testid="embed-iframe" 
              style={{ borderRadius: '4px' }} 
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
    </motion.div>
  );
};

export default HeroSection;
