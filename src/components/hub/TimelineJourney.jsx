import { motion } from 'framer-motion';
import { useContent } from '../../hooks/useContent';
import { 
  FloralClusterTopLeft, 
  FloralClusterTopRight, 
  FloralClusterBottomLeft, 
  FloralClusterBottomRight, 
  FloralBranchEdgeLeft, 
  FloralBranchEdgeRight 
} from '../svg/BotanicalDecor';

const getCardPersonality = (title, index) => {
  const t = (title || '').toLowerCase();
  
  // 1. Ganpati Pujan / Ghritpan (Index 0) -> Deep Wine
  if (t.includes('ganpati') || t.includes('pujan') || t.includes('ghrit') || t.includes('घृतपान') || index === 0) {
    return { bg: 'linear-gradient(135deg, #5A0A19, #3D040E)' };
  }
  // 2. Vinayak (Index 1) -> Rich Ruby
  if (t.includes('vinayak') || t.includes('विनायक') || index === 1) {
    return { bg: 'linear-gradient(135deg, #7A1227, #530514)' };
  }
  // 3. Badi Bandoli (Index 2) -> Elegant Deep Rose-Crimson
  if (t.includes('bandoli') || t.includes('बन्दोली') || index === 2) {
    return { bg: 'linear-gradient(135deg, #6E0E20, #4A0512)' };
  }
  // 4. Barat Swagat (Index 3) -> Deep Crimson
  if (t.includes('swagat') || t.includes('स्वागत') || index === 3) {
    return { bg: 'linear-gradient(135deg, #630818, #3E020B)' };
  }
  // 5. Panigrahan Sanskar (Index 4) -> Royal Wine-Burgundy
  if (t.includes('panigrahan') || t.includes('sanskar') || t.includes('संस्कार') || index === 4) {
    return { bg: 'linear-gradient(135deg, #530412, #340008)' };
  }
  // 6. Preetibhoj Samaroh (Index 5) -> Rich Ruby-Rose
  if (t.includes('preetibhoj') || t.includes('samaroh') || t.includes('समारोह') || index === 5) {
    return { bg: 'linear-gradient(135deg, #82182D, #5E0C1C)' };
  }
  
  return { bg: 'linear-gradient(135deg, #5A0A19, #3D040E)' };
};

const getCardBotanicals = (index) => {
  switch (index) {
    case 0:
      return {
        Top: FloralClusterTopLeft,
        Bottom: FloralClusterBottomRight,
        topClass: "-top-7 -left-7 w-20 h-20",
        bottomClass: "-bottom-7 -right-7 w-20 h-20"
      };
    case 1:
      return {
        Top: FloralClusterTopRight,
        Bottom: FloralClusterBottomLeft,
        topClass: "-top-7 -right-7 w-20 h-20",
        bottomClass: "-bottom-7 -left-7 w-20 h-20"
      };
    case 2:
      return {
        Top: FloralClusterTopLeft,
        Bottom: FloralBranchEdgeRight,
        topClass: "-top-7 -left-7 w-20 h-20",
        bottomClass: "-right-6 top-[20%] w-12 h-20 rotate-90"
      };
    case 3:
      return {
        Top: FloralClusterTopRight,
        Bottom: FloralBranchEdgeLeft,
        topClass: "-top-7 -right-7 w-20 h-20",
        bottomClass: "-left-6 top-[20%] w-12 h-20 -rotate-90"
      };
    case 4:
      return {
        Top: FloralClusterBottomLeft,
        Bottom: FloralClusterBottomRight,
        topClass: "-bottom-7 -left-7 w-20 h-20 rotate-90",
        bottomClass: "-bottom-7 -right-7 w-20 h-20"
      };
    case 5:
    default:
      return {
        Top: FloralClusterTopLeft,
        Bottom: FloralClusterBottomRight,
        topClass: "-top-7 -left-7 w-20 h-20",
        bottomClass: "-bottom-7 -right-7 w-20 h-20"
      };
  }
};

const JharokhaCard = ({ event, index }) => {
  const p = getCardPersonality(event.title, index);
  const bots = getCardBotanicals(index);
  const TopComponent = bots.Top;
  const BottomComponent = bots.Bottom;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 40px rgba(50,30,30,0.25)' 
      }}
      className="relative w-full rounded-sm shadow-luxe-medium overflow-hidden cursor-pointer"
    >
      <div 
        className="relative p-7 md:p-9 rounded-sm overflow-hidden flex flex-col justify-center text-center min-h-[160px]"
        style={{ 
          background: p.bg,
          border: '1px solid #C89B5A',
          boxShadow: 'inset 0 0 0 1px rgba(200, 155, 90, 0.4)'
        }}
      >
        {/* Dual Gold Foil Border Frame */}
        <div className="absolute inset-[5px] border border-[#C89B5A]/25 pointer-events-none rounded-sm z-10" />

        {/* Watercolor botanical corners (opacity 18% to support without competing) */}
        <TopComponent className={`absolute ${bots.topClass} opacity-[0.18] pointer-events-none select-none`} />
        <BottomComponent className={`absolute ${bots.bottomClass} opacity-[0.18] pointer-events-none select-none`} />

        {/* Title: Ceremony title: Great Vibes */}
        <h3
          className="font-greatvibes text-[#E8C37C] text-3.5xl md:text-4.5xl font-normal mb-2 relative z-10"
        >
          {event.title}
        </h3>

        {/* Divider and Tagline / Time */}
        <div className="flex items-center justify-center space-x-3 mb-3 mt-1 relative z-10">
          <div className="h-px flex-1 bg-[#C89B5A]/35" />
          <p className="font-cormorant text-[#FDF9F6]/85 italic tracking-[0.15em] text-xs md:text-sm">
            {event.time}
          </p>
          <div className="h-px flex-1 bg-[#C89B5A]/35" />
        </div>

        {/* Tagline / Desc: Lato font */}
        <p className="font-lato font-light text-xs md:text-sm text-[#FDF9F6]/80 leading-relaxed relative z-10 max-w-[85%] mx-auto">
          {event.desc}
        </p>
      </div>
    </motion.div>
  );
};

const TimelineJourney = () => {
  const { content } = useContent('timeline');

  const defaultEvents = [
    { id: 1, title: 'घृतपान',             time: 'July 1, 2026',         desc: 'Auspicious Hour' },
    { id: 2, title: 'विनायक',             time: 'July 2, 2026',         desc: 'Auspicious Hour' },
    { id: 3, title: 'बड़ी बन्दोली',       time: 'July 3, 2026',         desc: 'Auspicious Hour' },
    { id: 4, title: 'बारात स्वागत',       time: 'July 6, 2026',         desc: 'Auspicious Hour' },
    { id: 5, title: 'पाणिग्रहण संस्कार', time: 'July 6, 2026',         desc: 'Midnight' },
    { id: 6, title: 'प्रीतिभोज समारोह', time: 'July 6, 2026, 6:15 PM', desc: 'Poker Garden, Sojat' },
  ];

  const events = content || defaultEvents;

  return (
    <motion.div
      key="journey"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center pb-32 pt-8 px-6 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative w-full z-10 px-4">
        {/* Section Heading: Great Vibes, Rose Accent */}
        <h2
          className="font-greatvibes text-center mb-16 text-rose-accent text-4xl font-normal"
        >
          The Royal Journey
        </h2>

        {/* Responsive grid event board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full">
          {events.map((event, index) => (
            <JharokhaCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineJourney;
