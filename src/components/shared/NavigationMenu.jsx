import { motion } from 'framer-motion';
import { CalendarHeart, MapPin, Image as ImageIcon, Send, Users, Map, Heart } from 'lucide-react';

const NavigationMenu = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'hero', label: 'Home', icon: <CalendarHeart size={20} /> },
    { id: 'family', label: 'Family', icon: <Users size={20} /> },
    { id: 'journey', label: 'Journey', icon: <MapPin size={20} /> },
    { id: 'venue', label: 'Venue', icon: <Map size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { id: 'blessings', label: 'Blessings', icon: <Heart size={20} /> },
    { id: 'rsvp', label: 'RSVP', icon: <Send size={20} /> },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl"
    >
      <div className="flex justify-start md:justify-between items-center bg-royal-blue/70 backdrop-blur-md border border-champagne-gold/50 rounded-full px-4 py-3 shadow-[0_0_20px_rgba(212,175,55,0.15)] overflow-x-auto no-scrollbar space-x-6 md:space-x-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 min-w-[50px] ${
              activeTab === tab.id ? 'text-champagne-gold scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-ivory/50 hover:text-ivory'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] uppercase tracking-widest font-sans">{tab.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default NavigationMenu;