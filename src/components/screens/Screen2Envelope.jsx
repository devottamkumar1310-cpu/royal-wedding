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
      // No ctx.scale() — we store the ratio and compensate manually in erase()
      // so coordinates are always in canvas-pixel space.

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0,   '#D4AF37');
      grad.addColorStop(0.5, '#F3E5AB');
      grad.addColorStop(1,   '#D4AF37');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font      = `${Math.round(16 * ratio)}px 'Cinzel', serif`;
      ctx.fillStyle = '#0B3046';
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
              className="absolute top-[15%] text-champagne-gold font-serif tracking-[0.15em] text-sm md:text-base uppercase"
            >
              Tap Envelope to Open
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Envelope ── */}
      <AnimatePresence>
        {!isCardVisible && (
          <motion.div
            className="relative w-72 h-48 md:w-96 md:h-64 cursor-pointer mt-10"
            onClick={handleOpen}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 bg-royal-blue border border-champagne-gold/30 rounded-sm shadow-2xl" />
            <div className="absolute top-0 left-0 w-0 h-0 border-l-[144px] md:border-l-[192px] border-l-royal-blue border-y-[96px] md:border-y-[128px] border-y-transparent z-10" />
            <div className="absolute top-0 right-0 w-0 h-0 border-r-[144px] md:border-r-[192px] border-r-royal-blue border-y-[96px] md:border-y-[128px] border-y-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[96px] md:border-b-[128px] border-b-royal-blue border-x-[144px] md:border-x-[192px] border-x-transparent z-20 drop-shadow-[0_-2px_10px_rgba(0,0,0,0.4)]" />

            <div className="absolute inset-0 z-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0,0 L 50,50 L 0,100"   fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                <path d="M 100,0 L 50,50 L 100,100" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                <path d="M 0,100 L 50,50 L 100,100" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.8" />
              </svg>
            </div>

            {/* Flap */}
            <motion.div
              className="absolute top-0 left-0 w-full h-[96px] md:h-[128px] z-30 origin-top"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 30 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="absolute top-0 left-0 w-0 h-0 border-t-[96px] md:border-t-[128px] border-t-royal-blue border-x-[144px] md:border-x-[192px] border-x-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                style={{ backfaceVisibility: 'hidden' }}
              />
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ backfaceVisibility: 'hidden' }}>
                <path d="M 0,0 L 50,100 L 100,0" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.8" />
              </svg>
              <div
                className="absolute top-0 left-0 w-0 h-0 border-t-[96px] md:border-t-[128px] border-t-[#082232] border-x-[144px] md:border-x-[192px] border-x-transparent"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
              />

              {/* Wax seal */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] rounded-full shadow-lg flex items-center justify-center border border-[#F3E5AB]/50 z-40"
                    initial={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 border border-royal-blue/30 rounded-full flex items-center justify-center">
                      <span className="text-royal-blue font-serif font-bold text-lg md:text-xl tracking-wider">P&J</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
            className="absolute z-50 w-[90%] max-w-md h-[380px] md:h-[420px] rounded-lg
                       shadow-[0_20px_50px_rgba(212,175,55,0.25)]
                       flex flex-col items-center justify-center
                       bg-ivory text-royal-blue overflow-hidden border-4 border-transparent"
            style={{
              backgroundClip: 'padding-box',
              backgroundImage: 'linear-gradient(#FDFBF7,#FDFBF7),linear-gradient(135deg,#D4AF37,#F3E5AB,#D4AF37)',
              backgroundOrigin: 'border-box',
            }}
          >
            {/* Card content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
              <h3 className="text-xs tracking-[0.18em] text-champagne-gold uppercase mb-3 font-bold">
                A Special Celebration Awaits
              </h3>
              <h2 className="text-2xl md:text-3xl font-serif mb-3">Pooja &amp; Jagdish</h2>
              <p className="font-sans text-sm opacity-75 leading-relaxed">
                You are warmly invited to join the<br />Royal Wedding Celebration.
              </p>

              <AnimatePresence>
                {isRevealed && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={advanceScreen}
                    className="mt-5 px-8 py-3 border border-champagne-gold text-champagne-gold
                               uppercase tracking-widest text-sm rounded
                               hover:bg-champagne-gold hover:text-ivory transition-colors duration-300"
                  >
                    Enter Celebration
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
      withBorders={true}
    />
  );
};

export default Screen2Envelope;
