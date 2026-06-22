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

// ─── Card helpers — unchanged ─────────────────────────────────────────────────

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

// ─── JharokhaCard — internals completely unchanged ────────────────────────────

const JharokhaCard = ({ event, index, variants }) => {
  const p = getCardPersonality(event.title, index);
  const bots = getCardBotanicals(index);
  const TopComponent = bots.Top;
  const BottomComponent = bots.Bottom;

  return (
    <motion.div
      variants={variants}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 22px 44px rgba(50,30,30,0.30), 0 6px 14px rgba(80,40,15,0.14)' 
      }}
      className="relative w-full rounded-sm overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 14px 36px rgba(0,0,0,0.18), 0 4px 12px rgba(80,40,15,0.10)',
      }}
    >
      <div 
        className="relative p-7 md:p-9 rounded-sm overflow-hidden flex flex-col justify-center text-center min-h-[160px]"
        style={{ 
          background: p.bg,
          border: '1px solid rgba(200,155,90,0.85)',
          boxShadow: 'inset 0 0 0 1px rgba(200, 155, 90, 0.55)'
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

// ─── Timeline spine node ──────────────────────────────────────────────────────

const TimelineNode = ({ variants }) => (
  <motion.div
    variants={variants}
    className="relative z-10 flex items-center justify-center flex-shrink-0"
  >
    {/* Ambient halo */}
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 48,
        height: 48,
        background: 'radial-gradient(circle, rgba(200,155,90,0.22) 0%, transparent 70%)',
      }}
      variants={{
        hidden: { scale: 0.6, opacity: 0 },
        visible: { 
          scale: [0.8, 1.2, 1], 
          opacity: 1, 
          transition: { duration: 1.2, ease: 'easeOut' } 
        }
      }}
    />
    {/* Outer ring */}
    <motion.div
      style={{
        width: 22,
        height: 22,
      }}
      variants={{
        hidden: { 
          scale: 0.8,
          borderColor: 'rgba(200,155,90,0.30)',
          boxShadow: '0 0 0px rgba(200,155,90,0), 0 0 0 0px rgba(200,155,90,0)'
        },
        visible: { 
          scale: 1,
          borderColor: 'rgba(200,155,90,0.90)',
          boxShadow: '0 0 14px rgba(200,155,90,0.35), 0 0 0 5px rgba(200,155,90,0.12)',
          transition: { duration: 0.8, ease: 'easeOut' }
        }
      }}
      className="relative flex items-center justify-center rounded-full bg-[#FAF6F0] border-[1.5px]"
    >
      {/* Core dot */}
      <motion.div
        className="rounded-full"
        style={{ width: 9, height: 9, background: '#C89B5A' }}
        variants={{
          hidden: { scale: 0.5, opacity: 0.5 },
          visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
        }}
      />
    </motion.div>
  </motion.div>
);


// ─── TimelineJourney ──────────────────────────────────────────────────────────

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

  const nodeVariants = {
    hidden: { opacity: 0.3, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

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

        <h2 className="font-greatvibes text-center mb-16 text-rose-accent text-4xl font-normal">
          The Royal Journey
        </h2>

        {/*
          ─── Layout strategy ─────────────────────────────────────────────────
          The spine is a SINGLE absolute-positioned element spanning the full
          height of the events container (position: relative).

          Desktop: spine sits at left-1/2 (transform: translateX(-1px)).
                   Cards live in flex-1 side columns — they NEVER overlap center.
                   Horizontal arms bridge each card to its node.

          Mobile:  spine sits at left-1rem = 16px (centre of the 32px node col).
                   Cards are in flex-1 to the right — they never overlap the spine.

          Nodes are z-10 so they render ON TOP of the spine, not breaking it.
          The spine is always continuous and uninterrupted.
        */}
        <div className="relative">

          {/* ── Single continuous spine — Desktop (centred) ── */}
          <div
            className="hidden md:block absolute pointer-events-none"
            style={{
              left: '50%',
              transform: 'translateX(-1px)',
              top: 0,
              bottom: 0,
              width: 2,
              background: 'rgba(200,155,90,0.80)',
              boxShadow: '0 0 8px rgba(200,155,90,0.22)',
              zIndex: 0,
            }}
          />

          {/* ── Single continuous spine — Mobile (left node column) ── */}
          <div
            className="md:hidden absolute pointer-events-none"
            style={{
              left: '1rem',
              transform: 'translateX(-1px)',
              top: 0,
              bottom: 0,
              width: 2,
              background: 'rgba(200,155,90,0.80)',
              boxShadow: '0 0 8px rgba(200,155,90,0.22)',
              zIndex: 0,
            }}
          />

          {/* ── Event rows ── */}
          <div className="flex flex-col gap-3 md:gap-4">
            {events.map((event, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-22% 0px -22% 0px' }}
                >
                  {/* ── Desktop alternating layout ── */}
                  <div className="hidden md:flex items-center w-full">

                    {/* Left card slot */}
                    <div className="flex-1 flex items-center justify-end">
                      {isLeft ? (
                        <motion.div variants={cardVariants} className="w-full max-w-[480px]">
                          <JharokhaCard event={event} index={index} variants={cardVariants} />
                        </motion.div>
                      ) : (
                        <div className="w-full max-w-[480px]" />
                      )}
                    </div>

                    {/* Horizontal arm — left card to node */}
                    <div
                      className="flex-shrink-0"
                      style={{
                        width: 32,
                        height: 1.5,
                        background: isLeft ? '#C89B5A' : 'transparent',
                      }}
                    />

                    {/* Node — z-10 so it renders on top of the spine */}
                    <TimelineNode variants={nodeVariants} />

                    {/* Horizontal arm — node to right card */}
                    <div
                      className="flex-shrink-0"
                      style={{
                        width: 32,
                        height: 1.5,
                        background: !isLeft ? '#C89B5A' : 'transparent',
                      }}
                    />

                    {/* Right card slot */}
                    <div className="flex-1 flex items-center justify-start">
                      {!isLeft ? (
                        <motion.div variants={cardVariants} className="w-full max-w-[480px]">
                          <JharokhaCard event={event} index={index} variants={cardVariants} />
                        </motion.div>
                      ) : (
                        <div className="w-full max-w-[480px]" />
                      )}
                    </div>
                  </div>

                  {/* ── Mobile layout (node left, card right) ── */}
                  <div className="md:hidden flex items-center">
                    {/* Node column — 32px wide, spine passes through its centre */}
                    <div className="w-8 flex-shrink-0 flex justify-center">
                      <TimelineNode variants={nodeVariants} />
                    </div>
                    {/* Horizontal arm: node to card */}
                    <div
                      className="flex-shrink-0"
                      style={{ width: 20, height: 1.5, background: '#C89B5A' }}
                    />
                    <motion.div variants={cardVariants} className="flex-1 min-w-0">
                      <JharokhaCard event={event} index={index} variants={cardVariants} />
                    </motion.div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineJourney;

