import { motion } from 'framer-motion';
import { useMemo } from 'react';

const GaneshaIllustration = ({ className = "", width = "100%", height = "100%" }) => {
  // Generate highly intricate ornamental details programmatically for a perfect mathematical line-art style
  
  const innerHalo = useMemo(() => {
    const elements = [];
    for (let i = -110; i <= 110; i += 5) {
      const rad = (i * Math.PI) / 180;
      const x1 = 250 + 130 * Math.sin(rad);
      const y1 = 200 - 130 * Math.cos(rad);
      const x2 = 250 + 140 * Math.sin(rad);
      const y2 = 200 - 140 * Math.cos(rad);
      elements.push(<path key={`ih-${i}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} strokeWidth="1.5" />);
    }
    return elements;
  }, []);

  const outerHalo = useMemo(() => {
    const elements = [];
    for (let i = -120; i <= 110; i += 12) {
      const rad = (i * Math.PI) / 180;
      const radNext = ((i + 12) * Math.PI) / 180;
      const rIn = 150;
      const rOut = 175;
      const x1 = 250 + rIn * Math.sin(rad);
      const y1 = 200 - rIn * Math.cos(rad);
      const x2 = 250 + rOut * Math.sin((rad + radNext)/2);
      const y2 = 200 - rOut * Math.cos((rad + radNext)/2);
      const x3 = 250 + rIn * Math.sin(radNext);
      const y3 = 200 - rIn * Math.cos(radNext);
      elements.push(<path key={`oh-${i}`} d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`} strokeWidth="2" />);
      
      const xDot = 250 + (rOut + 10) * Math.sin((rad + radNext)/2);
      const yDot = 200 - (rOut + 10) * Math.cos((rad + radNext)/2);
      elements.push(<circle key={`dot-${i}`} cx={xDot} cy={yDot} r="2.5" fill="#D4AF37" stroke="none" />);
    }
    return elements;
  }, []);

  const dhotiLines = useMemo(() => {
    const elements = [];
    for(let i=0; i<6; i++) {
      const offset = i * 12;
      elements.push(<path key={`dl-${i}`} d={`M 250 ${370 + offset} C 210 ${400 + offset}, 130 ${410 + offset}, 110 ${440 + offset}`} strokeWidth="1.5" opacity="0.6" />);
      elements.push(<path key={`dr-${i}`} d={`M 250 ${370 + offset} C 290 ${400 + offset}, 370 ${410 + offset}, 390 ${440 + offset}`} strokeWidth="1.5" opacity="0.6" />);
    }
    return elements;
  }, []);

  const lotusPetals = useMemo(() => {
    const elements = [];
    for (let i = -4; i <= 4; i++) {
      const xCenter = 250 + i * 45;
      const yTop = 460 + Math.abs(i) * 12;
      const yBottom = 540 - Math.abs(i) * 6;
      elements.push(
        <path key={`lotus-${i}`} d={`M ${xCenter - 35} ${470 + Math.abs(i)*12} Q ${xCenter} ${yTop} ${xCenter + 35} ${470 + Math.abs(i)*12} Q ${xCenter} ${yBottom} ${xCenter - 35} ${470 + Math.abs(i)*12} Z`} strokeWidth="2.5" fill="#0B3046" />
      );
      elements.push(
        <path key={`lotus-in-${i}`} d={`M ${xCenter} ${yTop + 15} L ${xCenter} ${yBottom - 15}`} strokeWidth="1.5" opacity="0.7" />
      );
    }
    return elements;
  }, []);

  const necklaceBeads = useMemo(() => {
    const elements = [];
    for(let i = -45; i <= 45; i += 9) {
      const rad = i * Math.PI / 180;
      const x = 250 + 70 * Math.sin(rad);
      const y = 230 + 70 * Math.cos(rad);
      elements.push(<circle key={`bead-${i}`} cx={x} cy={y} r="2.5" fill="#D4AF37" stroke="none" />);
    }
    for(let i = -35; i <= 35; i += 10) {
      const rad = i * Math.PI / 180;
      const x = 250 + 90 * Math.sin(rad);
      const y = 240 + 90 * Math.cos(rad);
      elements.push(<circle key={`bead2-${i}`} cx={x} cy={y} r="3" fill="#D4AF37" stroke="none" />);
    }
    return elements;
  }, []);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 600"
      width={width}
      height={height}
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <defs>
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur1" />
          <feGaussianBlur stdDeviation="3" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bgAura" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="rgba(212,175,55,0.4)" />
          <stop offset="30%" stopColor="rgba(212,175,55,0.2)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </radialGradient>
      </defs>

      {/* Divine Aura Background */}
      <circle cx="250" cy="270" r="230" fill="url(#bgAura)" />
      
      <g fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#softGlow)">
        
        {/* Halo / Aura Details */}
        <circle cx="250" cy="200" r="130" strokeWidth="3" />
        <circle cx="250" cy="200" r="145" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="250" cy="200" r="150" strokeWidth="3" />
        {innerHalo}
        {outerHalo}

        {/* Outer Swirls / Floral Clouds at Base */}
        <path d="M 120 460 C 60 460, 40 380, 100 350 C 130 330, 150 380, 120 410" strokeWidth="2" opacity="0.8" />
        <path d="M 380 460 C 440 460, 460 380, 400 350 C 370 330, 350 380, 380 410" strokeWidth="2" opacity="0.8" />

        {/* Lotus Base */}
        {lotusPetals}

        {/* Silhouette & Body */}
        {/* Torso */}
        <path d="M 190 280 C 140 330, 130 380, 250 390 C 370 380, 360 330, 310 280" strokeWidth="3" />
        {/* Belly lines */}
        <path d="M 210 320 C 230 370, 270 370, 290 320" strokeWidth="1.5" />
        <path d="M 190 340 C 220 390, 280 390, 310 340" strokeWidth="1.5" />
        {/* Sacred Thread */}
        <path d="M 190 250 C 200 300, 240 360, 290 350" strokeWidth="2" strokeDasharray="4 4" />

        {/* Dhoti / Pants Folds */}
        <path d="M 190 370 C 100 370, 70 430, 130 460 C 180 480, 220 460, 250 440" strokeWidth="3" />
        <path d="M 310 370 C 400 370, 430 430, 370 460 C 320 480, 280 460, 250 440" strokeWidth="3" />
        {dhotiLines}
        <path d="M 250 440 L 250 490" strokeWidth="3" />
        <path d="M 230 490 L 270 490 L 250 530 Z" fill="#D4AF37" stroke="none" />

        {/* Heavy Jewelry / Necklaces */}
        {necklaceBeads}
        <path d="M 210 260 C 230 320, 270 320, 290 260" strokeWidth="3" />
        <path d="M 240 315 L 260 315 L 250 345 Z" fill="#D4AF37" stroke="none" />
        <circle cx="250" cy="355" r="3" fill="#D4AF37" stroke="none" />

        {/* Head & Face */}
        <path d="M 210 180 C 210 140, 290 140, 290 180 C 290 210, 270 230, 270 250" strokeWidth="3" />
        {/* Tusks */}
        <path d="M 235 220 L 220 250" strokeWidth="3" />
        <path d="M 265 220 L 280 250" strokeWidth="3" />
        {/* Broken Tusk Detailing (Right Tusk is typically broken) */}
        <path d="M 285 240 L 275 255" strokeWidth="3" stroke="none" />

        {/* Eyes & Forehead Tilak */}
        <path d="M 220 190 Q 235 180 245 195 Q 230 200 220 190 Z" strokeWidth="1.5" />
        <circle cx="235" cy="190" r="2.5" fill="#D4AF37" stroke="none" />
        <path d="M 280 190 Q 265 180 255 195 Q 270 200 280 190 Z" strokeWidth="1.5" />
        <circle cx="265" cy="190" r="2.5" fill="#D4AF37" stroke="none" />
        
        {/* Tilak */}
        <path d="M 240 160 Q 250 165 260 160" strokeWidth="2.5" />
        <path d="M 240 150 Q 250 155 260 150" strokeWidth="2.5" />
        <path d="M 245 170 L 255 170 L 250 185 Z" fill="#D4AF37" stroke="none" />

        {/* Trunk */}
        <path d="M 240 230 C 240 300, 220 370, 260 390 C 290 405, 330 380, 310 350 C 290 320, 260 330, 260 360 C 260 380, 280 370, 280 350" fill="none" strokeWidth="3.5" />
        {/* Trunk decorative lines */}
        <path d="M 242 260 Q 250 265 258 260 M 240 280 Q 250 285 255 280 M 239 300 Q 250 305 252 300 M 240 320 Q 250 325 250 320 M 243 340 Q 250 345 253 340" strokeWidth="2" />

        {/* Large Ornate Ears */}
        <path d="M 215 170 C 130 130, 100 230, 160 270 C 180 285, 200 275, 215 250" strokeWidth="3" />
        <path d="M 210 185 C 150 160, 130 220, 170 250" strokeWidth="1.5" />
        <path d="M 205 200 C 170 180, 150 210, 180 230" strokeWidth="1.5" />
        
        <path d="M 285 170 C 370 130, 400 230, 340 270 C 320 285, 300 275, 285 250" strokeWidth="3" />
        <path d="M 290 185 C 350 160, 370 220, 330 250" strokeWidth="1.5" />
        <path d="M 295 200 C 330 180, 350 210, 320 230" strokeWidth="1.5" />

        {/* Detailed Crown (Mukut) */}
        <path d="M 215 150 L 230 60 L 250 30 L 270 60 L 285 150 Z" strokeWidth="3" />
        <path d="M 225 130 Q 250 145 275 130 M 230 110 Q 250 125 270 110 M 235 90 Q 250 105 265 90" strokeWidth="2" />
        <path d="M 250 30 L 250 140" strokeWidth="2" />
        <circle cx="250" cy="80" r="5" fill="#D4AF37" stroke="none" />
        <circle cx="250" cy="110" r="6" fill="#D4AF37" stroke="none" />
        <path d="M 195 150 L 210 90 L 230 120 M 305 150 L 290 90 L 270 120" strokeWidth="2.5" />
        <circle cx="210" cy="90" r="4" fill="#D4AF37" stroke="none" />
        <circle cx="290" cy="90" r="4" fill="#D4AF37" stroke="none" />

        {/* Four Arms & Accessories */}
        
        {/* Back Right Arm (Viewer's Left - Holding Axe) */}
        <path d="M 190 260 C 130 250, 100 200, 110 150" strokeWidth="3" />
        <path d="M 160 210 L 140 220 M 165 220 L 145 230" strokeWidth="2" /> {/* Armbands */}
        <path d="M 90 130 L 90 190 M 90 150 C 60 140, 50 160, 90 170 M 90 140 L 115 145 L 90 150 Z" strokeWidth="2" fill="#D4AF37" />

        {/* Back Left Arm (Viewer's Right - Holding Lotus) */}
        <path d="M 310 260 C 370 250, 400 200, 390 150" strokeWidth="3" />
        <path d="M 340 210 L 360 220 M 335 220 L 355 230" strokeWidth="2" /> {/* Armbands */}
        <path d="M 390 140 C 360 110, 360 90, 390 90 C 420 90, 420 110, 390 140 Z M 390 140 C 350 130, 350 100, 390 100 M 390 140 C 430 130, 430 100, 390 100" strokeWidth="2" />
        <circle cx="390" cy="115" r="4" fill="#D4AF37" stroke="none" />

        {/* Front Left Arm (Viewer's Right - Holding Modak Bowl) */}
        <path d="M 300 300 C 360 310, 380 350, 350 390" strokeWidth="3" />
        <path d="M 330 350 L 350 365 M 340 340 L 360 355" strokeWidth="2" />
        {/* Bowl of Modaks */}
        <path d="M 320 390 Q 350 430 380 390 Z" strokeWidth="2.5" />
        <circle cx="340" cy="385" r="8" fill="#D4AF37" stroke="none" />
        <circle cx="360" cy="385" r="8" fill="#D4AF37" stroke="none" />
        <circle cx="350" cy="372" r="8" fill="#D4AF37" stroke="none" />
        <circle cx="330" cy="375" r="6" fill="#D4AF37" stroke="none" />
        <circle cx="370" cy="375" r="6" fill="#D4AF37" stroke="none" />

        {/* Front Right Arm (Viewer's Left - Abhaya Mudra / Blessing) */}
        <path d="M 200 300 C 140 310, 120 350, 150 390" strokeWidth="3" />
        <path d="M 170 350 L 150 365 M 160 340 L 140 355" strokeWidth="2" />
        {/* Blessing Hand */}
        <path d="M 140 390 C 110 350, 140 320, 170 320 C 195 320, 200 360, 170 390 Z" strokeWidth="2.5" fill="#0B3046" />
        <path d="M 145 345 L 145 315 M 155 335 L 155 305 M 165 340 L 170 315" strokeWidth="2.5" />
        {/* Om Symbol in palm */}
        <text x="145" y="375" fill="#D4AF37" fontSize="26" fontFamily="sans-serif" stroke="none">ॐ</text>

        {/* Small Mouse (Mushak) */}
        <g transform="translate(140, 480)">
          <path d="M 0 20 C 15 0, 45 0, 60 15 C 75 30, 60 45, 30 45 C 0 45, -15 30, 0 20 Z" strokeWidth="2" />
          <path d="M 45 15 Q 75 5 65 30" strokeWidth="2" />
          <circle cx="55" cy="20" r="2.5" fill="#D4AF37" stroke="none" />
          <path d="M 0 35 Q -30 30 -20 15" strokeWidth="2" />
        </g>
      </g>
    </motion.svg>
  );
};

export default GaneshaIllustration;
