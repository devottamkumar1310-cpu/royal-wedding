import { Volume2, VolumeX } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';

const AudioToggle = () => {
  const { isMuted, toggleMute } = useWedding();

  // Audio is temporarily disabled for V1, hide the toggle
  return null;

  return (
    <button
      onClick={toggleMute}
      className="fixed top-6 right-6 z-[100] w-10 h-10 md:w-12 md:h-12 bg-royal-blue/60 backdrop-blur-md border border-champagne-gold/50 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:scale-110 hover:border-champagne-gold transition-all duration-300"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? (
        <VolumeX className="text-champagne-gold opacity-50" size={20} />
      ) : (
        <Volume2 className="text-champagne-gold" size={20} />
      )}
    </button>
  );
};

export default AudioToggle;
