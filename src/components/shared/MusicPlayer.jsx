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
        className={`w-12 h-12 rounded-full border border-[#FFC300] flex items-center justify-center backdrop-blur-md shadow-luxe-medium transition-all duration-500 relative ${isPlaying ? 'bg-[#FFC300]/15' : 'bg-stationery-gradient'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-[2px] border border-[#FFC300]/30 pointer-events-none rounded-full" />
        {isPlaying ? (
          <div className="flex space-x-[3px] items-center justify-center h-4 w-4 relative z-10">
            {[0.9, 1.3, 1.1, 1.4].map((dur, i) => (
              <motion.div
                key={i}
                animate={{ height: ["4px", "12px", "4px"] }}
                transition={{ repeat: Infinity, duration: dur, ease: "easeInOut", delay: i * 0.2 }}
                className="w-[1.5px] rounded-full bg-[#FFC300]"
              />
            ))}
          </div>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M12 3V21L21 16V8L12 3Z" fill="#FFC300" />
            <path d="M12 3V21H3V3H12Z" fill="#FFC300" />
            <line x1="1" y1="23" x2="23" y2="1" stroke="#FFC300" strokeWidth="1.5"/>
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
            className="absolute top-14 right-0 bg-stationery-gradient border border-[#FFC300] backdrop-blur-md rounded-sm p-3 w-40 flex flex-col space-y-2 shadow-luxe-strong"
          >
            <div className="absolute inset-[3px] border border-[#FFC300]/20 pointer-events-none rounded-sm" />
            <p className="text-[10px] text-[#F8F4E8]/60 uppercase tracking-widest text-center border-b border-[#FFC300] pb-2 mb-2 relative z-10 font-semibold">Select Music</p>
            {tracks.map(track => (
              <button 
                key={track.name}
                onClick={() => changeTrack(track)}
                className={`text-sm font-sans tracking-wider text-left px-2 py-1 rounded-sm transition-colors relative z-10 ${currentTrack === track.name ? 'text-luxe-gold bg-[#FFC300]/10' : 'text-[#F8F4E8]/80 hover:text-luxe-gold hover:bg-[#FFC300]/5'}`}
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
