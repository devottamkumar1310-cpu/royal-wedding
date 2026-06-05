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
  
  // 1. Ganpati Pujan / Ghritpan (Index 0) -> linear-gradient(135deg, #8B0A2A, #B10F3A)
  if (t.includes('ganpati') || t.includes('pujan') || t.includes('ghrit') || t.includes('घृतपान') || index === 0) {
    return { bg: 'linear-gradient(135deg, #8B0A2A, #B10F3A)' };
  }
  // 2. Vinayak (Index 1) -> linear-gradient(135deg, #A10F3F, #C0134B)
  if (t.includes('vinayak') || t.includes('विनायक') || index === 1) {
    return { bg: 'linear-gradient(135deg, #A10F3F, #C0134B)' };
  }
  // 3. Badi Bandoli (Index 2) -> linear-gradient(135deg, #B01245, #D11E58)
  if (t.includes('bandoli') || t.includes('बन्दोली') || index === 2) {
    return { bg: 'linear-gradient(135deg, #B01245, #D11E58)' };
  }
  // 4. Barat Swagat (Index 3) -> linear-gradient(135deg, #8B0A2A, #C0134B, #8B0A2A)
  if (t.includes('swagat') || t.includes('स्वागत') || index === 3) {
    return { bg: 'linear-gradient(135deg, #8B0A2A, #C0134B, #8B0A2A)' };
  }
  // 5. Panigrahan Sanskar (Index 4) -> linear-gradient(135deg, #7D0B2E, #A11144)
  if (t.includes('panigrahan') || t.includes('sanskar') || t.includes('संस्कार') || index === 4) {
    return { bg: 'linear-gradient(135deg, #7D0B2E, #A11144)' };
  }
  // 6. Preetibhoj Samaroh (Index 5) -> linear-gradient(135deg, #9B1140, #C2185B)
  if (t.includes('preetibhoj') || t.includes('samaroh') || t.includes('समारोह') || index === 5) {
    return { bg: 'linear-gradient(135deg, #9B1140, #C2185B)' };
  }
  
  return { bg: 'linear-gradient(135deg, #8B0A2A, #B10F3A)' };
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
        y: -4, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)' 
      }}
      className="relative w-full rounded-lg shadow-luxe-medium overflow-hidden cursor-pointer"
    >
      <div 
        className="relative p-6 md:p-8 rounded-lg overflow-hidden flex flex-col justify-center text-center min-h-[145px]"
        style={{ 
          background: p.bg,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 0 0 1px rgba(212,146,42,0.25) inset'
        }}
      >
        {/* Watercolor botanical corners (opacity 20-35% to support without competing) */}
        <TopComponent className={`absolute ${bots.topClass} opacity-[0.28] pointer-events-none select-none`} />
        <BottomComponent className={`absolute ${bots.bottomClass} opacity-[0.28] pointer-events-none select-none`} />

        {/* Title: Ceremony title: Great Vibes */}
        <h3
          className="font-greatvibes text-white text-3xl md:text-4xl font-normal mb-2"
        >
          {event.title}
        </h3>

        {/* Divider and Tagline / Time */}
        <div className="flex items-center justify-center space-x-3 mb-3 mt-1">
          <div className="h-px flex-1 bg-white/20" />
          <p className="font-cormorant text-white/85 italic tracking-[0.12em] text-[11px] md:text-xs">
            {event.time}
          </p>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        {/* Tagline / Desc: Lato font */}
        <p className="font-lato font-light text-xs md:text-sm text-white/80 leading-relaxed">
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
