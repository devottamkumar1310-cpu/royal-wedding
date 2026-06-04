import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CalendarHeart, MapPin, Image as ImageIcon, Send, Users, Map, Heart, Menu } from 'lucide-react';

const tabs = [
  { id: 'hero',      label: 'Home',     icon: <CalendarHeart size={18} /> },
  { id: 'family',    label: 'Family',   icon: <Users size={18} /> },
  { id: 'journey',   label: 'Journey',  icon: <MapPin size={18} /> },
  { id: 'venue',     label: 'Venue',    icon: <Map size={18} /> },
  { id: 'gallery',   label: 'Gallery',  icon: <ImageIcon size={18} /> },
  { id: 'blessings', label: 'Blessings',icon: <Heart size={18} /> },
  { id: 'rsvp',      label: 'RSVP',     icon: <Send size={18} /> },
];

const NavigationMenu = ({ activeTab, setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];

  const handleTabSelect = (id) => {
    setActiveTab(id);
    setIsExpanded(false);
  };

  return (
    <>
      {/* ─── Desktop: full-width bottom bar (md and above) ─────────── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="hidden md:block fixed left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex justify-between items-center bg-royal-blue/70 backdrop-blur-md border border-champagne-gold/50 rounded-full px-4 py-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 transition-all duration-300 min-w-[50px] ${
                activeTab === tab.id
                  ? 'text-champagne-gold scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]'
                  : 'text-ivory/50 hover:text-ivory'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] uppercase tracking-widest font-sans">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Mobile: compact expandable pill (below md) ─────────────── */}
      <div
        className="md:hidden fixed z-[100] left-1/2 -translate-x-1/2"
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Expanded tab grid — appears above the pill */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="mb-2.5 bg-[#081826]/96 border border-champagne-gold/30 rounded-2xl p-3
                         shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.08)]
                         grid grid-cols-4 gap-2"
              style={{ width: 'min(308px, 88vw)' }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`flex flex-col items-center py-2.5 px-1 rounded-xl
                    transition-colors duration-150 active:scale-95
                    ${activeTab === tab.id
                      ? 'text-champagne-gold bg-champagne-gold/10 border border-champagne-gold/25'
                      : 'text-ivory/55'
                    }`}
                >
                  {tab.icon}
                  <span className="text-[9px] uppercase tracking-wide font-sans mt-1 leading-tight">
                    {tab.label}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The pill itself */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center gap-2.5 bg-[#081826]/90 border border-champagne-gold/50
                     rounded-full px-4 py-2.5 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          {/* Active tab icon + label */}
          <span className="text-champagne-gold">{activeTabData.icon}</span>
          <span className="text-champagne-gold text-sm font-sans tracking-wide whitespace-nowrap">
            {activeTabData.label}
          </span>

          {/* Divider */}
          <div className="w-px h-4 bg-champagne-gold/30" />

          {/* Expand / collapse toggle */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="text-ivory/60 hover:text-champagne-gold transition-colors"
            aria-label={isExpanded ? 'Close navigation' : 'Open navigation'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <Menu size={16} />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default NavigationMenu;