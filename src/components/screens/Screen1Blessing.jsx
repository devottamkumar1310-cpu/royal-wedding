import { motion } from 'framer-motion';
import { useWedding } from '../../context/WeddingContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import RoyalScene from '../motion/RoyalScene';
import MagneticButton from '../shared/MagneticButton';
import GaneshaArt from '../svg/GaneshaArt';
import { FloralClusterTopRight, FloralClusterBottomLeft } from '../svg/BotanicalDecor';

const Screen1Blessing = () => {
  const { startExperience } = useWedding();
  const { playChime } = useSoundEffects();

  const handleEnter = () => {
    // Silent entry as requested (removed playChime click sound)
    startExperience();
  };

  const foregroundContent = (
    <div className="flex flex-col items-center justify-center text-center relative z-10 w-full min-h-screen py-10">
      
      {/* ─── SACRED COMPOSITION CONTAINER ─── */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center mb-12 w-[90%] max-w-lg p-10 md:p-14"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 2.5, ease: "easeOut" }}
      >
        {/* Soft glowing ambient backdrop */}
        <div className="absolute inset-0 bg-radial-glow from-[#D4922A]/10 to-transparent rounded-full blur-3xl" />

        {/* Botanical corner framing to anchor the artwork */}
        <FloralClusterTopRight className="absolute -top-4 -right-4 w-32 h-32 md:w-40 md:h-40 opacity-40 text-sacred-gold pointer-events-none" />
        <FloralClusterBottomLeft className="absolute -bottom-4 -left-4 w-32 h-32 md:w-40 md:h-40 opacity-40 text-sacred-gold pointer-events-none" />

        <div className="relative flex items-center justify-center">
          {/* Main Ganesha Artwork - Scaled up for importance */}
          <GaneshaArt 
            className="relative z-10 w-[180px] md:w-[240px] h-auto text-[#D4922A]" 
            style={{ 
              filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.05))" 
            }}
          />
        </div>
      </motion.div>

      {/* ─── TYPOGRAPHY ─── */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
        className="text-sm md:text-base font-cormorant tracking-[0.25em] mb-8 uppercase text-center text-[#B76E2B] font-medium"
      >
        ॥ Shree Ganeshaya Namah ॥
      </motion.h1>
      
      <div 
        className="font-cormorant text-[#5C3F2A]/90 max-w-[90vw] md:max-w-md text-center mb-12 md:mb-16 font-light tracking-wide text-xl md:text-2xl"
        style={{ lineHeight: 1.9 }}
      >
        {['वक्रतुण्ड महाकाय', 'सूर्यकोटि समप्रभ |', 'निर्विघ्नं कुरु मे देव', 'सर्वकार्येषु सर्वदा ||'].map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 + (i * 0.4), duration: 2, ease: "easeOut" }}
            className="drop-shadow-sm"
          >
            {line}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 1.5 }}
        className="z-20 mt-4"
      >
        <MagneticButton 
          onClick={handleEnter}
          className="btn-luxury px-12 py-4 md:px-14 md:py-5 uppercase tracking-[0.25em] shadow-[0_15px_30px_rgba(212,146,42,0.25)] hover:shadow-[0_20px_40px_rgba(212,146,42,0.35)] transition-all duration-500 font-medium relative rounded-sm"
        >
          <span className="relative z-10 tracking-widest text-sm md:text-base">Enter the Celebration</span>
        </MagneticButton>
      </motion.div>
    </div>
  );

  return (
    <RoyalScene
      foregroundComponent={foregroundContent}
      withParticles={true}
      withLightRays={true}
      withBorders={false}
    />
  );
};

export default Screen1Blessing;
