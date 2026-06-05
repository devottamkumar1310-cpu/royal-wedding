import { motion } from 'framer-motion';
import { useState } from 'react';
import { useContent } from '../../hooks/useContent';

const VenueMap = () => {
  const [copied, setCopied] = useState(false);
  const { content, loading } = useContent('venue');
  const venue = content || { name: "Poker Garden", description: "Behind Ichhapurna Balaji Temple, Sojat" };

  return (
    <motion.div 
      key="venue"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center pb-32 pt-4 px-4"
    >
      <h2 className="font-greatvibes text-center mb-16 text-rose-accent text-4xl font-normal">
        Where We Celebrate
      </h2>

      <div className="relative w-full max-w-2xl bg-stationery-gradient rounded-sm p-6 md:p-10 shadow-luxe-medium">
        
        <div className="text-center mb-8 relative z-10">
          <h3 className="text-xl md:text-2xl font-cormorant text-rose-accent font-semibold mb-2">{venue.name}</h3>
          <p className="text-xs font-lato tracking-wider text-[#5C3F2A]/70 uppercase font-light">{venue.description}</p>
        </div>

        {/* Embedded Map Graphic */}
        <div className="w-full h-64 md:h-80 bg-[#EDF5E9] border border-[#B2C9A7] rounded flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#B2C9A7] opacity-10 group-hover:opacity-0 transition-opacity duration-500"></div>
          
          {/* Abstract Map Graphic */}
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-40">
             <path d="M 0 50 Q 100 20, 200 100 T 400 50 L 400 300 L 0 300 Z" fill="#9DB893" stroke="#D4922A" strokeWidth="1.5" />
             <path d="M 50 150 L 100 120 L 150 180 L 250 140 L 350 200" fill="none" stroke="#D4922A" strokeWidth="1" strokeDasharray="5,5" />
             <circle cx="250" cy="140" r="5" fill="#D4922A" />
             <circle cx="250" cy="140" r="12" fill="none" stroke="#D4922A" className="animate-ping" />
          </svg>

          <div className="relative z-10 flex flex-col items-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4922A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-[#D4922A] font-lato text-xs tracking-widest uppercase font-medium">Click to open map</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 relative z-10">
          <a 
            href="https://maps.google.com/?q=Sojat,Rajasthan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-luxury px-8 py-3 uppercase tracking-[0.2em] shadow-luxe-medium hover:shadow-luxe-strong transition-all duration-300 rounded-sm text-center flex-1 md:flex-none relative"
          >
            <span className="relative z-10">Get Directions</span>
          </a>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(venue.description);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="btn-luxury px-8 py-3 uppercase tracking-[0.2em] shadow-luxe-medium hover:shadow-luxe-strong transition-all duration-300 rounded-sm text-center flex-1 md:flex-none relative"
          >
            <span className="relative z-10">{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VenueMap;
