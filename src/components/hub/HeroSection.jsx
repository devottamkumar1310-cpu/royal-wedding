import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useContent } from '../../hooks/useContent';

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
    <div className="flex space-x-4 md:space-x-8 mt-10">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-champagne-gold/50 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="text-2xl md:text-3xl font-serif text-champagne-gold">{value}</span>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-ivory/70 mt-3 font-sans">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  const { content } = useContent('hero');
  const hero = content || { couple_names: "पूजा & जगदीश", date: "06 जुलाई 2026" };
  const names = hero.couple_names.split('&').map(s => s.trim());
  const name1 = names[0] || "Pooja";
  const name2 = names[1] || "Jagdish";
  
  const weddingDate = new Date("2026-07-06T09:00:00+05:30").getTime();

  return (
    <motion.div 
      key="hero"
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center text-center w-full h-full px-4"
    >
      <div className="bg-royal-blue/40 backdrop-blur-md border border-champagne-gold/30 p-10 md:p-16 rounded-t-full relative w-full max-w-xl flex flex-col items-center shadow-2xl">
        {/* Decorative Arch Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-t-2 border-champagne-gold/60 rounded-full -mt-10 flex items-start justify-center">
          <div className="w-4 h-4 bg-champagne-gold rounded-full mt-[-8px] shadow-[0_0_10px_#D4AF37]"></div>
        </div>
        
        <h2 className="text-3xl md:text-5xl text-champagne-gold font-hindi mb-8 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] mt-8">
          शुभ विवाह
        </h2>
        
        <h1 className="text-5xl md:text-7xl font-serif text-ivory font-light mb-6 drop-shadow-md flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 30, filter: "blur(15px)" }} 
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
            transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
          >
            {name1}
          </motion.span>
          {names.length > 1 && (
            <motion.span 
              initial={{ opacity: 0, scale: 0, filter: "blur(10px)", rotate: -180 }} 
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0 }} 
              transition={{ delay: 1.8, duration: 1, ease: "backOut" }} 
              className="text-champagne-gold text-3xl my-6 block italic"
            >
              &
            </motion.span> 
          )}
          {names.length > 1 && (
            <motion.span 
              initial={{ opacity: 0, y: -30, filter: "blur(15px)" }} 
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
              transition={{ delay: 2.2, duration: 1.5, ease: "easeOut" }}
            >
              {name2}
            </motion.span>
          )}
        </h1>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-champagne-gold to-transparent my-6"></div>

        <p className="text-sm md:text-base font-sans tracking-[0.2em] uppercase text-ivory/90 leading-loose">
          {hero.date} <br/>
          Sojat, Rajasthan
        </p>

        <CountdownTimer targetDate={weddingDate} />
      </div>
    </motion.div>
  );
};

export default HeroSection;