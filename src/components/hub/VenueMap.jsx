import { motion } from 'framer-motion';
import { useState } from 'react';
import { useContent } from '../../hooks/useContent';

const VenueMap = () => {
  const [copied, setCopied] = useState(false);
  const { content, loading } = useContent('venue');
  const venue = content || { name: "पोकर गार्डन", description: "ईच्छापूर्ण बालाजी मंदिर के पीछे, सोजत" };

  return (
    <motion.div 
      key="venue"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center pb-32 pt-4 px-4"
    >
      <h2 className="font-serif text-center mb-16 uppercase tracking-[0.32em] font-light text-transparent bg-gradient-to-b from-[#FFF0D0] via-[#D4AF37] to-[#B38728] bg-clip-text drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.9)] text-2xl md:text-3xl">
        The Grand Venue
      </h2>

      <div className="w-full max-w-2xl bg-royal-blue/40 backdrop-blur-md border border-champagne-gold/30 rounded-lg p-6 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-serif text-ivory mb-2">{venue.name}</h3>
          <p className="text-sm font-sans tracking-wider text-ivory/70 uppercase">{venue.description}</p>
        </div>

        {/* Embedded Map Placeholder - Real map requires an iframe/API key */}
        <div className="w-full h-64 md:h-80 bg-[#071e2c] border-2 border-champagne-gold/50 rounded flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-champagne-gold opacity-10 group-hover:opacity-0 transition-opacity duration-500"></div>
          
          {/* Abstract Map Graphic */}
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-30">
             <path d="M 0 50 Q 100 20, 200 100 T 400 50 L 400 300 L 0 300 Z" fill="#0B3046" stroke="#D4AF37" strokeWidth="2" />
             <path d="M 50 150 L 100 120 L 150 180 L 250 140 L 350 200" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5,5" />
             <circle cx="250" cy="140" r="5" fill="#D4AF37" />
             <circle cx="250" cy="140" r="15" fill="none" stroke="#D4AF37" className="animate-ping" />
          </svg>

          <div className="relative z-10 flex flex-col items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-champagne-gold font-sans text-sm tracking-widest uppercase">Click to open map</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <a 
            href="https://maps.google.com/?q=Sojat,Rajasthan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 bg-champagne-gold text-royal-blue uppercase tracking-[0.2em] text-sm font-semibold hover:bg-ivory hover:text-royal-blue transition-all duration-300 rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.4)] text-center flex-1 md:flex-none"
          >
            Get Directions
          </a>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(venue.description);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-8 py-3 bg-transparent border border-champagne-gold text-champagne-gold uppercase tracking-[0.2em] text-sm font-semibold hover:bg-champagne-gold hover:text-royal-blue transition-all duration-300 rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.1)] text-center flex-1 md:flex-none"
          >
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VenueMap;
