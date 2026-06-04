import { motion } from 'framer-motion';
import { useWedding } from '../../context/WeddingContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import RoyalScene from '../motion/RoyalScene';
import Lantern from '../svg/Lantern';
import MagneticButton from '../shared/MagneticButton';

// Detect touch/mobile once at module level — stable, never changes during session
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
const Screen1Blessing = () => {
  const { startExperience } = useWedding();
  const { playChime } = useSoundEffects();

  const handleEnter = () => {
    playChime();
    startExperience();
  };

  const foregroundContent = (
    <div className="flex flex-col items-center text-center mt-12">
      <motion.div 
        className="z-20 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 2, ease: "easeOut" }}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,55,0.4)_0%,rgba(212,175,55,0.15)_35%,transparent_65%)] scale-[2.5] z-0 pointer-events-none" />
          <img 
            src="/ganesh.png?v=2" 
            alt="Royal Ganesha" 
            className="relative z-10 w-[160px] md:w-[200px] h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]" 
          />
        </div>
      </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.2, duration: 2, ease: "easeOut" }}
          className="text-2xl md:text-4xl text-champagne-gold font-hindi mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          style={{ fontWeight: 400, letterSpacing: '0.06em' }}
        >
          ॥ श्री गणेशाय नमः ॥
        </motion.h1>
        
        <div 
          className="font-hindi text-ivory/90 max-w-[90vw] md:max-w-md text-center mb-8 md:mb-16"
          style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', fontWeight: 400, lineHeight: 2.2, letterSpacing: '0.04em' }}
        >
          {['वक्रतुंड महाकाय', 'सूर्यकोटि समप्रभ।', 'निर्विघ्नं कुरु मे देव', 'सर्वकार्येषु सर्वदा॥'].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 + (i * 0.6), duration: 2, ease: "easeOut" }}
            >
              {line}
            </motion.div>
          ))}
        </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.5 }}
        className="z-20"
      >
        <MagneticButton 
          onClick={handleEnter}
          className="px-10 py-3 md:px-12 md:py-4 border border-champagne-gold text-champagne-gold uppercase tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-base rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-royal-blue/30 backdrop-blur-sm hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all duration-500 font-sans font-light"
        >
          Enter the Celebration
        </MagneticButton>
      </motion.div>
    </div>
  );

  // F5 fix: JS-level conditional render (not CSS hidden) so Framer Motion
  // animations in Lantern never mount/run on mobile at all.
  const midgroundContent = isMobileDevice ? null : (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute top-10 left-32">
        <Lantern delay={0} />
      </div>
      <div className="absolute top-20 right-32 transform scale-75">
        <Lantern delay={1.5} />
      </div>
    </div>
  );

  return (
    <RoyalScene
      foregroundComponent={foregroundContent}
      midgroundComponent={midgroundContent}
      withParticles={true}
      withLightRays={true}
      withBorders={true}
    />
  );
};

export default Screen1Blessing;