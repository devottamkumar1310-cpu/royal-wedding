import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWedding } from '../../context/WeddingContext';
import RoyalScene from '../motion/RoyalScene';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import WeddingCelebration from '../motion/WeddingCelebration';

const Screen2Envelope = () => {
  const { advanceScreen } = useWedding();
  const [isOpen, setIsOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Scratch state
  const canvasRef      = useRef(null);
  const hasRevealedRef = useRef(false);
  const rafRef         = useRef(null);
  const lastCheckRef   = useRef(0);
  const scaleRef       = useRef(1); // tracks current canvas pixel-ratio scale
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing]   = useState(false);

  const { playWaxCrack, playPaperUnfold, startScratchLoop, stopScratchLoop, playReveal } = useSoundEffects();


  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    playWaxCrack();
    setTimeout(playPaperUnfold, 150);
    setTimeout(() => setIsCardVisible(true), 600);
  }, [isOpen, playWaxCrack, playPaperUnfold]);

  // ─── Canvas init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCardVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const paint = () => {
      const rect  = canvas.getBoundingClientRect();
      // Cap internal resolution at 800×800 on mobile — well below GPU limit
      const maxDim = Math.max(rect.width, rect.height);
      const ratio  = Math.min(800 / maxDim, 1);
      scaleRef.current = ratio;

      canvas.width  = Math.round(rect.width  * ratio);
      canvas.height = Math.round(rect.height * ratio);

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0,   '#D4922A');
      grad.addColorStop(0.5, '#FDF9F6');
      grad.addColorStop(1,   '#D4922A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font      = `${Math.round(16 * ratio)}px 'Cormorant Garamond', serif`;
      ctx.fillStyle = '#5C3F2A';
      ctx.textAlign = 'center';
      ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2);
    };

    paint();
    window.addEventListener('resize', paint);

    // Prevent scroll/pull-to-refresh while scratching
    const stopProp = (e) => e.preventDefault();
    canvas.addEventListener('touchstart', stopProp, { passive: false });
    canvas.addEventListener('touchmove',  stopProp, { passive: false });

    return () => {
      window.removeEventListener('resize', paint);
      canvas.removeEventListener('touchstart', stopProp);
      canvas.removeEventListener('touchmove',  stopProp);
    };
  }, [isCardVisible]);

  // ─── Erase ───────────────────────────────────────────────────────────────────
  const erase = useCallback((e) => {
    if (!isDrawing || hasRevealedRef.current) return;

    // Capture pointer position synchronously before handing to rAF
    let clientX, clientY;
    if (e.touches?.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches?.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx   = canvas.getContext('2d');
      const rect  = canvas.getBoundingClientRect();
      const ratio = scaleRef.current;

      // Convert CSS pixels → canvas pixels explicitly (no ctx.scale used)
      const posX = (clientX - rect.left)  * ratio;
      const posY = (clientY - rect.top)   * ratio;
      const r    = 36 * ratio; // eraser radius in canvas pixels

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(posX, posY, r, 0, Math.PI * 2);
      ctx.fill();

      // Throttle the expensive getImageData to at most every 120 ms
      const now = Date.now();
      if (now - lastCheckRef.current > 120) {
        lastCheckRef.current = now;
        checkReveal(ctx, canvas);
      }
    });
  }, [isDrawing]);

  const checkReveal = (ctx, canvas) => {
    if (hasRevealedRef.current) return;
    const { data }   = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent  = 0;
    // Sample every 8th pixel (step = 32 bytes = 8 RGBA pixels)
    for (let i = 3; i < data.length; i += 32) {
      if (data[i] < 10) transparent++;
    }
    const pct = (transparent / (data.length / 32)) * 100;
    if (pct > 55) {
      hasRevealedRef.current = true;
      setIsRevealed(true);
      setShowCelebration(true);
      stopScratchLoop();
      playReveal();     // celebratory reveal chime + haptic
    }
  };

  // ─── JSX ─────────────────────────────────────────────────────────────────────
  const foreground = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
      className="relative z-40 flex flex-col items-center justify-center w-full h-full"
    >
      {/* Hint label */}
      {!isCardVisible && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[15%] text-[#B76E2B] font-cormorant tracking-[0.15em] text-sm md:text-base uppercase font-medium"
            >
              Tap Envelope to Open
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Envelope & Backing Invitation Card ── */}
      <AnimatePresence>
        {!isCardVisible && (
          <motion.div
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.7 }}
            className="relative w-[340px] h-[240px] md:w-[480px] md:h-[330px] rounded-sm flex items-center justify-center p-6 mt-12 z-10"
            style={{ 
              background: 'transparent'
            }}
          >
            
            {/* Inner Envelope with physically placed depth shadow */}
            <div
              className="relative w-72 h-48 md:w-96 md:h-64 cursor-pointer rounded-sm"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18)'
              }}
              onClick={handleOpen}
            >
              {/* Peeking Invitation Card (Before Opening) */}
              <div 
                className="absolute left-2 right-2 top-[-12px] bottom-10 bg-[#FDF8F4] rounded-t-sm border-t border-l border-r border-[#C47A2C]/20 flex justify-center z-0"
                style={{
                  boxShadow: '0 -4px 10px rgba(0,0,0,0.04)'
                }}
              >
                <div className="w-[95%] h-full border-t border-l border-r border-[#C47A2C]/10 rounded-t-sm mt-1" />
              </div>

              {/* Envelope Base Color - Warm Ivory */}
              <div className="absolute inset-0 bg-[#F8F2E8] rounded-sm z-10" />
              
              {/* Fine paper grain overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] z-35 mix-blend-multiply"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />
              
              {/* Envelope Flaps */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 300 200" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Botanical Pattern - Realistic Pressed/Embossed Leaves & Vines */}
                  <pattern id="botanicalPatternEmbossed" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    {/* Shadow layer (deboss) */}
                    <g transform="translate(1, 1)" opacity="0.03">
                      <path d="M 15,85 C 30,70 20,40 45,25" stroke="#2E3A28" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M 45,25 C 55,20 65,30 50,40 Z" fill="#2E3A28" />
                      <path d="M 30,55 C 40,45 45,60 30,65 Z" fill="#2E3A28" />
                      <path d="M 50,90 C 70,80 80,50 65,20" stroke="#2E3A28" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                      <path d="M 65,20 C 60,10 45,15 55,30 Z" fill="#2E3A28" />
                      <path d="M 75,50 C 90,45 85,60 70,65 Z" fill="#2E3A28" />
                      <circle cx="85" cy="25" r="2.5" fill="#2E3A28" />
                      <circle cx="20" cy="40" r="2" fill="#2E3A28" />
                    </g>
                    {/* Highlight layer (emboss edge) */}
                    <g transform="translate(-0.5, -0.5)" opacity="0.07">
                      <path d="M 15,85 C 30,70 20,40 45,25" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <path d="M 45,25 C 55,20 65,30 50,40 Z" fill="#FFFFFF" />
                      <path d="M 30,55 C 40,45 45,60 30,65 Z" fill="#FFFFFF" />
                      <path d="M 50,90 C 70,80 80,50 65,20" stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                      <path d="M 65,20 C 60,10 45,15 55,30 Z" fill="#FFFFFF" />
                      <path d="M 75,50 C 90,45 85,60 70,65 Z" fill="#FFFFFF" />
                      <circle cx="85" cy="25" r="2.5" fill="#FFFFFF" />
                      <circle cx="20" cy="40" r="2" fill="#FFFFFF" />
                    </g>
                  </pattern>
                  
                  {/* Clean soft inner shadow where flaps meet */}
                  <filter id="flapShadowSoft" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
                  </filter>

                  {/* Envelope geometric flap gradients */}
                  <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FAF5EE" />
                    <stop offset="100%" stopColor="#F2EBE0" />
                  </linearGradient>
                  <linearGradient id="flapGradBottom" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#F5EBE0" />
                    <stop offset="100%" stopColor="#EBE1D3" />
                  </linearGradient>
                </defs>

                {/* Left Flap */}
                <g filter="url(#flapShadowSoft)">
                  <polygon points="0,0 145,100 0,200" fill="url(#flapGrad)" />
                  <polygon points="0,0 145,100 0,200" fill="url(#botanicalPatternEmbossed)" />
                  <path d="M 0,0 L 145,100 L 0,200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
                </g>

                {/* Right Flap */}
                <g filter="url(#flapShadowSoft)">
                  <polygon points="300,0 155,100 300,200" fill="url(#flapGrad)" />
                  <polygon points="300,0 155,100 300,200" fill="url(#botanicalPatternEmbossed)" />
                  <path d="M 300,0 L 155,100 L 300,200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
                </g>

                {/* Bottom Flap */}
                <g filter="url(#flapShadowSoft)">
                  <polygon points="0,200 150,105 300,200" fill="url(#flapGradBottom)" />
                  <polygon points="0,200 150,105 300,200" fill="url(#botanicalPatternEmbossed)" />
                  <path d="M 0,200 L 150,105 L 300,200" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" strokeLinecap="round" />
                </g>
              </svg>

              {/* Top Flap (Animated) */}
              <motion.div
                className="absolute top-0 left-0 w-full h-[110px] md:h-[145px] z-30 origin-top"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 30 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Top Flap Front */}
                <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                  <svg className="w-full h-full pointer-events-none" viewBox="0 0 300 110" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 4px 6px rgba(40,50,35,0.3))' }}>
                    <defs>
                      <linearGradient id="topFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#DDE8D8" />
                        <stop offset="100%" stopColor="#C4D0BE" />
                      </linearGradient>
                    </defs>
                    <polygon points="0,0 150,110 300,0" fill="url(#topFlapGrad)" />
                    <polygon points="0,0 150,110 300,0" fill="url(#botanicalPatternEmbossed)" />
                    {/* Edge Highlight */}
                    <path d="M 0,0 L 150,110 L 300,0" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Top Flap Back */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                  <svg className="w-full h-full pointer-events-none" viewBox="0 0 300 110" preserveAspectRatio="none">
                    <polygon points="0,0 150,110 300,0" fill="#F8F2E8" />
                    <polygon points="0,0 150,110 300,0" fill="url(#botanicalPatternEmbossed)" />
                    <path d="M 0,0 L 150,110 L 300,0" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Realistic Wax Seal (Matte Pressed) */}
                <AnimatePresence>
                  {!isOpen && (
                    <motion.div
                      className="absolute left-1/2 bottom-[-8px] translate-y-1/2 -translate-x-1/2 z-40 cursor-pointer"
                      initial={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <svg viewBox="0 0 100 100" className="w-[56px] h-[56px] md:w-[60px] md:h-[60px] select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))' }}>
                        <defs>
                          <radialGradient id="waxMatte" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#C8961D" />
                            <stop offset="60%" stopColor="#B8860B" />
                            <stop offset="100%" stopColor="#8A6508" />
                          </radialGradient>
                          <radialGradient id="waxIndentMatte" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#8A6508" />
                            <stop offset="85%" stopColor="#A5780A" />
                            <stop offset="100%" stopColor="#C8961D" />
                          </radialGradient>
                        </defs>
                        
                        {/* Outer Wax Round Frame */}
                        <circle cx="50" cy="50" r="46" fill="url(#waxMatte)" />
                        
                        {/* Organic uneven edges for realism (No drips, just irregular perimeter) */}
                        <path d="M 50,4 C 70,2 85,15 94,30 C 98,50 93,70 80,86 C 60,98 35,97 18,80 C 4,60 2,35 15,18 C 30,5 40,6 50,4 Z" fill="url(#waxMatte)" opacity="0.9" />
                        
                        {/* Pressed Inner Seal */}
                        <circle cx="50" cy="50" r="38" fill="url(#waxIndentMatte)" stroke="#735407" strokeWidth="1" />
                        
                        {/* Monogram PJ */}
                        <text 
                          x="50" 
                          y="62" 
                          fontFamily="'Great Vibes', cursive" 
                          fontSize="32" 
                          fill="#E6CC8A" 
                          textAnchor="middle"
                          style={{
                            textShadow: '0px 1px 1px rgba(60,40,0,0.8), 0px -1px 1px rgba(255,255,255,0.2)'
                          }}
                        >
                          PJ
                        </text>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Invitation / Scratch card ── */}
      <AnimatePresence>
        {isCardVisible && (
          <motion.div
            initial={{ y: 180, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute z-50 w-[90%] max-w-md h-[380px] md:h-[420px] rounded-sm
                       shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                       flex flex-col items-center justify-center
                       bg-[#FDF8F4] overflow-hidden"
          >
            {/* Fine paper texture on card */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.06] z-0 mix-blend-multiply"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />

            {/* Card content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
              <h3 className="text-xs tracking-[0.15em] text-[#B76E2B] font-cormorant italic uppercase mb-3">
                A Special Celebration Awaits
              </h3>
              <h2 className="font-greatvibes text-[#B76E2B] mb-3 text-4xl md:text-5xl">Pooja &amp; Jagdish</h2>
              <p className="font-lato font-light text-sm text-[#5C3F2A]/80 leading-relaxed max-w-[80%]">
                You are warmly invited to join the<br />Royal Wedding Celebration.
              </p>

              <AnimatePresence>
                {isRevealed && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={advanceScreen}
                    className="btn-luxury mt-5 px-8 py-3 uppercase tracking-widest shadow-luxe-medium hover:shadow-luxe-strong transition-all duration-300 font-medium relative"
                  >
                    <span className="relative z-10">Enter Celebration</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Scratch layer */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.canvas
                  ref={canvasRef}
                  className="absolute inset-0 z-10 w-full h-full cursor-pointer"
                  style={{ touchAction: 'none' }}
                  onPointerDown={(e) => { setIsDrawing(true); startScratchLoop(); erase(e); }}
                  onPointerMove={erase}
                  onPointerUp={() => { setIsDrawing(false); stopScratchLoop(); }}
                  onPointerLeave={() => { setIsDrawing(false); stopScratchLoop(); }}
                  onPointerCancel={() => { setIsDrawing(false); stopScratchLoop(); }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </AnimatePresence>

            {/* Reveal celebration */}
            {showCelebration && (
              <WeddingCelebration
                onComplete={() => setShowCelebration(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

return (
  <RoyalScene
    foregroundComponent={foreground}
    withParticles={true}
    withLightRays={true}
    withBorders={false}
  />
);
};

export default Screen2Envelope;