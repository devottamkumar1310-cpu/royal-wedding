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
        <div className="relative flex justify-between items-center bg-stationery-gradient backdrop-blur-md border border-[#D4922A]/20 rounded-full px-5 py-3.5 shadow-luxe-strong">
          <div className="absolute inset-[3px] border border-[#D4922A]/10 pointer-events-none rounded-full" />
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex flex-col items-center space-y-1 transition-all duration-300 min-w-[50px] ${
                activeTab === tab.id
                  ? 'text-luxe-gold scale-110'
                  : 'text-[#5C3F2A]/50 hover:text-luxe-gold'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] uppercase tracking-widest font-sans font-medium">{tab.label}</span>
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
              className="relative mb-2.5 bg-stationery-gradient backdrop-blur-md border border-[#D4922A]/20 rounded-2xl p-3
                         shadow-luxe-strong
                         grid grid-cols-4 gap-2"
              style={{ width: 'min(308px, 88vw)' }}
            >
              <div className="absolute inset-[3px] border border-[#D4922A]/10 pointer-events-none rounded-[13px]" />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`relative z-10 flex flex-col items-center py-2.5 px-1 rounded-xl
                    transition-colors duration-150 active:scale-95
                    ${activeTab === tab.id
                      ? 'text-luxe-gold bg-[#D4922A]/10 border border-[#D4922A]/20'
                      : 'text-[#5C3F2A]/50'
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
          className="relative flex items-center gap-2.5 bg-stationery-gradient backdrop-blur-md border border-[#D4922A]/20
                     rounded-full px-4 py-2.5 shadow-luxe-strong"
        >
          <div className="absolute inset-[3px] border border-[#D4922A]/10 pointer-events-none rounded-full" />
          {/* Active tab icon + label */}
          <span className="relative z-10 text-luxe-gold">{activeTabData.icon}</span>
          <span className="relative z-10 text-[#5C3F2A] text-sm font-sans tracking-wide whitespace-nowrap font-medium">
            {activeTabData.label}
          </span>

          {/* Divider */}
          <div className="relative z-10 w-px h-4 bg-[#D4922A]/30" />

          {/* Expand / collapse toggle */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="relative z-10 text-[#5C3F2A]/60 hover:text-luxe-gold transition-colors"
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

