import { motion } from 'framer-motion';
import { useWedding } from '../../context/WeddingContext';

const SoundToggle = () => {
  const { isMuted, toggleMute } = useWedding();

  return (
    <div className="fixed top-6 left-6 z-50">
      <motion.button
        onClick={toggleMute}
        className={`w-12 h-12 rounded-full border border-[#FFC300] flex items-center justify-center backdrop-blur-md shadow-luxe-medium transition-all duration-500 relative ${!isMuted ? 'bg-[#FFC300]/15' : 'bg-stationery-gradient'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
      >
        <div className="absolute inset-[2px] border border-[#FFC300]/30 pointer-events-none rounded-full" />
        {!isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#FFC300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="#FFC300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.07 4.92999C20.9447 6.80527 21.998 9.34835 21.998 12C21.998 14.6516 20.9447 17.1947 19.07 19.07" stroke="#FFC300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#FFC300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="22.2929" y1="1.70711" x2="1.70711" y2="22.2929" stroke="#FFC300" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </motion.button>
    </div>
  );
};

export default SoundToggle;
