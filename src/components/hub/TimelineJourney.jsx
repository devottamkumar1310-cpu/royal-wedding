import { motion } from 'framer-motion';
import { useContent } from '../../hooks/useContent';

/**
 * BackgroundMandala — Low-opacity geometric architectural watermark
 *
 * Adds subtle royal depth to the background of the ceremony board.
 * Opacity is kept strictly <= 0.05 (0.035) for a stationery-inspired watermark feel.
 */
const BackgroundMandala = ({ className }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    stroke="#D4AF37"
    strokeWidth="0.5"
    opacity="0.035"
  >
    <circle cx="100" cy="100" r="12" />
    <circle cx="100" cy="100" r="18" strokeDasharray="1,2" />
    <circle cx="100" cy="100" r="32" />
    <circle cx="100" cy="100" r="48" strokeDasharray="3,3" />
    <circle cx="100" cy="100" r="64" />
    <circle cx="100" cy="100" r="80" strokeDasharray="2,4" />
    <circle cx="100" cy="100" r="95" />

    {[...Array(16)].map((_, i) => {
      const angle = (i * 22.5 * Math.PI) / 180;
      const x1 = 100 + 12 * Math.cos(angle);
      const y1 = 100 + 12 * Math.sin(angle);
      const x2 = 100 + 95 * Math.cos(angle);
      const y2 = 100 + 95 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.6" />;
    })}

    {[...Array(12)].map((_, i) => {
      const angle = i * 30;
      return (
        <g key={i} transform={`rotate(${angle} 100 100)`}>
          <path d="M 100,68 C 104,78 104,82 100,100 C 96,82 96,78 100,68 Z" fill="#D4AF37" opacity="0.15" />
          <path d="M 100,32 C 108,46 108,54 100,100 C 92,54 92,46 100,32 Z" />
          <path d="M 100,5 C 112,30 112,60 100,100 C 88,60 88,30 100,5 Z" opacity="0.4" />
        </g>
      );
    })}
  </svg>
);

/**
 * ChhatriMotif — Traditional Rajasthani canopy spire motif
 *
 * Placed at the top center of each ceremony card to mask the border.
 * SIZE REDUCED by ~50% and line weights thinned for a subtle, elegant look.
 */
const ChhatriMotif = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 36"
    width="48"
    height="18"
    className="overflow-visible"
  >
    <defs>
      <linearGradient id="chhatriGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF0D0" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#AA7C11" />
      </linearGradient>
    </defs>
    {/* Thin base step plates */}
    <line x1="15" y1="32" x2="85" y2="32" stroke="url(#chhatriGrad)" strokeWidth="0.6" />
    <line x1="25" y1="29" x2="75" y2="29" stroke="url(#chhatriGrad)" strokeWidth="0.4" />
    
    {/* Pillars */}
    <line x1="30" y1="29" x2="30" y2="22" stroke="url(#chhatriGrad)" strokeWidth="0.5" />
    <line x1="70" y1="29" x2="70" y2="22" stroke="url(#chhatriGrad)" strokeWidth="0.5" />
    <line x1="40" y1="29" x2="40" y2="20" stroke="url(#chhatriGrad)" strokeWidth="0.4" opacity="0.6" />
    <line x1="60" y1="29" x2="60" y2="20" stroke="url(#chhatriGrad)" strokeWidth="0.4" opacity="0.6" />
    
    {/* Scalloped arch under dome */}
    <path d="M 30,22 Q 50,16 70,22" fill="none" stroke="url(#chhatriGrad)" strokeWidth="0.5" />
    
    {/* Main Dome with solid navy fill and thin stroke */}
    <path
      d="M 26,22 C 26,22 28,10 50,6 C 72,10 74,22 74,22 Z"
      fill="#081826"
      stroke="url(#chhatriGrad)"
      strokeWidth="0.8"
    />
    
    {/* Inner decorative arch in dome */}
    <path
      d="M 34,22 C 34,22 36,13 50,10 C 64,13 66,22 66,22"
      fill="none"
      stroke="url(#chhatriGrad)"
      strokeWidth="0.4"
      opacity="0.5"
    />

    {/* Central finial Finian Spire */}
    <line x1="50" y1="6" x2="50" y2="0" stroke="url(#chhatriGrad)" strokeWidth="0.6" />
    <circle cx="50" cy="1" r="1.2" fill="url(#chhatriGrad)" />
    <polygon points="50,-3 52,0 50,3 48,0" fill="url(#chhatriGrad)" />
    
    {/* Side finials */}
    <circle cx="26" cy="22" r="0.8" fill="url(#chhatriGrad)" />
    <circle cx="74" cy="22" r="0.8" fill="url(#chhatriGrad)" />
  </svg>
);

/**
 * JharokhaCorner — Scaled corner filigree
 *
 * Uses the EXACT SAME geometry language and curve coordinate structure as the screen's main outer FiligreeCorner.
 * Line weights are thinned and opacity reduced to avoid visual dominance.
 */
const JharokhaCorner = ({ position = "top-left" }) => {
  let transform = "";
  if (position === "top-right") transform = "scaleX(-1)";
  if (position === "bottom-left") transform = "scaleY(-1)";
  if (position === "bottom-right") transform = "scale(-1, -1)";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width="38"
      height="38"
      className="absolute pointer-events-none z-10"
      style={{
        transform,
        top: position.includes("top") ? 1 : "auto",
        bottom: position.includes("bottom") ? 1 : "auto",
        left: position.includes("left") ? 1 : "auto",
        right: position.includes("right") ? 1 : "auto",
      }}
    >
      <defs>
        <linearGradient id="cardFiligreeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F3E5AB" />
        </linearGradient>
      </defs>
      <path
        d="M 0 0 L 100 0 C 100 0, 80 20, 80 50 C 80 80, 50 80, 50 100 L 0 100 Z"
        fill="none"
        stroke="url(#cardFiligreeGrad)"
        strokeWidth="1"
        opacity="0.65"
      />
      <path
        d="M 10 10 L 80 10 C 80 10, 60 25, 60 50 C 60 75, 25 75, 10 80 Z"
        fill="none"
        stroke="url(#cardFiligreeGrad)"
        strokeWidth="0.5"
        opacity="0.35"
      />
      <circle cx="20" cy="20" r="2" fill="url(#cardFiligreeGrad)" opacity="0.5" />
      <circle cx="40" cy="15" r="1" fill="url(#cardFiligreeGrad)" opacity="0.35" />
      <circle cx="15" cy="40" r="1" fill="url(#cardFiligreeGrad)" opacity="0.35" />
    </svg>
  );
};

/**
 * TimelineNode — Stylized star finial node
 *
 * Custom geometric star node. Used as a central divider ornament in event cards.
 */
const TimelineNode = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    className="text-champagne-gold overflow-visible"
  >
    <polygon
      points="12,2 22,12 12,22 2,12"
      fill="#081826"
      stroke="#D4AF37"
      strokeWidth="0.8"
    />
    <circle cx="12" cy="12" r="2.8" fill="#D4AF37" />
    <line x1="12" y1="5" x2="12" y2="2" stroke="#D4AF37" strokeWidth="0.5" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="#D4AF37" strokeWidth="0.5" />
    <line x1="5" y1="12" x2="2" y2="12" stroke="#D4AF37" strokeWidth="0.5" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="#D4AF37" strokeWidth="0.5" />
  </svg>
);

const JharokhaCard = ({ event, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.6, delay: index * 0.06, ease: 'easeOut' }}
    className="relative w-full"
  >
    {/* Double-nested border invitation card wrapper */}
    <div
      className="relative bg-royal-blue/35 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.55)] hover:bg-royal-blue/50 transition-all duration-500 group p-1.5 rounded-none border border-champagne-gold/35 hover:border-champagne-gold/60"
    >
      {/* Inner card container — increased padding for stationery breathing room */}
      <div className="border border-champagne-gold/15 p-6 md:p-8 relative min-h-[145px] flex flex-col justify-center text-center">
        {/* Top canopy spire — integrated and sized subtly */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 -top-[10px] pointer-events-none z-20"
        >
          <ChhatriMotif />
        </div>

        {/* Scaled thin geometry Jharokha corners */}
        <JharokhaCorner position="top-left" />
        <JharokhaCorner position="top-right" />
        <JharokhaCorner position="bottom-left" />
        <JharokhaCorner position="bottom-right" />

        {/* Title: Metallic Gold Gradient, Tiro Devanagari Hindi font, elegant weight and size */}
        <h3
          className="font-hindi text-transparent bg-gradient-to-b from-[#FFF0D0] via-[#D4AF37] to-[#B38728] bg-clip-text drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] transition-all duration-500 font-normal mt-2"
          style={{
            fontSize:      'clamp(1.15rem, 3.5vw, 1.45rem)',
            lineHeight:    1.4,
            letterSpacing: '0.05em',
            marginBottom:  '0.65rem',
          }}
        >
          {event.title}
        </h3>

        {/* Divider and Muted Gold metadata (with glowing star node in the center) */}
        <div className="flex items-center justify-center space-x-3 mb-4 mt-2">
          <div className="h-px flex-1 bg-champagne-gold/15" />
          
          <div className="flex items-center space-x-2">
            {/* Emphasized Node divider ornament with glow filter */}
            <div className="filter drop-shadow-[0_0_6px_rgba(212,175,55,0.8)] hover:drop-shadow-[0_0_10px_rgba(212,175,55,1)] transition-all duration-300">
              <TimelineNode />
            </div>
            <p
              className="font-sans text-champagne-gold/60 uppercase tracking-[0.2em] font-medium"
              style={{
                fontSize:      '0.65rem',
              }}
            >
              {event.time}
            </p>
          </div>

          <div className="h-px flex-1 bg-champagne-gold/15" />
        </div>

        {/* Event description: Tiro Devanagari Hindi, light, spacious line-height */}
        <p
          className="font-hindi text-ivory/80 leading-[1.8] tracking-[0.02em] font-light"
          style={{
            fontSize:      'clamp(0.85rem, 2.5vw, 0.95rem)',
          }}
        >
          {event.desc}
        </p>
      </div>
    </div>
  </motion.div>
);

const TimelineJourney = () => {
  const { content } = useContent('timeline');

  const defaultEvents = [
    { id: 1, title: 'घृतपान',             time: '01 जुलाई 2026',         desc: 'शुभ वेला में' },
    { id: 2, title: 'विनायक',             time: '02 जुलाई 2026',         desc: 'शुभ वेला में' },
    { id: 3, title: 'बड़ी बन्दोली',       time: '03 जुलाई 2026',         desc: 'शुभ वेला में' },
    { id: 4, title: 'बारात स्वागत',       time: '06 जुलाई 2026',         desc: 'शुभ वेला में' },
    { id: 5, title: 'पाणिग्रहण संस्कार', time: '06 जुलाई 2026',         desc: 'मध्यरात्रि' },
    { id: 6, title: 'प्रीतिभोज समारोह', time: '06 जुलाई 2026, 6:15 PM', desc: 'पोकर गार्डन, सोजत' },
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
      {/* Background Architectural Mandalas — Subtle watermarks */}
      <BackgroundMandala className="absolute top-[10%] left-[-80px] md:left-[5%] w-72 h-72 pointer-events-none select-none z-0" />
      <BackgroundMandala className="absolute top-[48%] right-[-80px] md:right-[5%] w-80 h-80 pointer-events-none select-none z-0" />
      <BackgroundMandala className="absolute bottom-[10%] left-[-80px] md:left-[8%] w-72 h-72 pointer-events-none select-none z-0" />

      <div className="max-w-5xl mx-auto relative w-full z-10 px-4">
        {/* Section Heading: Cinzel, tracking, luxury metallic gradient */}
        <h2
          className="font-serif text-center mb-16 uppercase tracking-[0.32em] font-light text-transparent bg-gradient-to-b from-[#FFF0D0] via-[#D4AF37] to-[#B38728] bg-clip-text drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] text-2xl md:text-3xl"
        >
          The Royal Journey
        </h2>

        {/* Responsive grid event board (2-columns desktop, 1-column mobile) */}
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