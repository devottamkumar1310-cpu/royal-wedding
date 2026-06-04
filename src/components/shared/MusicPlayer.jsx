import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Santoor');
  const audioRef = useRef(null);

  const tracks = [
    { name: 'Shehnai', file: '/audio/shehnai.mp3' }, // Placeholders, real project would need these files
    { name: 'Santoor', file: '/audio/santoor.mp3' },
    { name: 'Flute', file: '/audio/flute.mp3' }
  ];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (track) => {
    setCurrentTrack(track.name);
    // In a real app we'd update audioRef.src, but we are just building the UI component
    if (isPlaying) {
      // Simulate switching and re-playing
    }
    setShowMenu(false);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src={tracks.find(t => t.name === currentTrack).file} type="audio/mpeg" />
      </audio>

      {/* Main Music Toggle Button */}
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowMenu(true)}
        className={`w-12 h-12 rounded-full border border-champagne-gold flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500 ${isPlaying ? 'bg-champagne-gold/20' : 'bg-royal-blue/60'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <div className="flex space-x-[3px] items-center justify-center h-4 w-4">
            {[0.9, 1.3, 1.1, 1.4].map((dur, i) => (
              <motion.div
                key={i}
                animate={{ height: ["4px", "12px", "4px"] }}
                transition={{ repeat: Infinity, duration: dur, ease: "easeInOut", delay: i * 0.2 }}
                className="w-[1.5px] rounded-full bg-champagne-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              />
            ))}
          </div>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V21L21 16V8L12 3Z" fill="#D4AF37" className="drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]"/>
            <path d="M12 3V21H3V3H12Z" fill="#D4AF37" className="drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]"/>
            <line x1="1" y1="23" x2="23" y2="1" stroke="#F3E5AB" strokeWidth="1.5"/>
          </svg>
        )}
      </motion.button>

      {/* Track Selection Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            onMouseLeave={() => setShowMenu(false)}
            className="absolute top-14 right-0 bg-royal-blue/90 border border-champagne-gold/40 backdrop-blur-md rounded-lg p-3 w-40 flex flex-col space-y-2 shadow-xl"
          >
            <p className="text-[10px] text-ivory/60 uppercase tracking-widest text-center border-b border-champagne-gold/20 pb-2 mb-2">Select Music</p>
            {tracks.map(track => (
              <button 
                key={track.name}
                onClick={() => changeTrack(track)}
                className={`text-sm font-sans tracking-wider text-left px-2 py-1 rounded transition-colors ${currentTrack === track.name ? 'text-champagne-gold bg-champagne-gold/10' : 'text-ivory/80 hover:text-champagne-gold hover:bg-white/5'}`}
              >
                {track.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPlayer;
