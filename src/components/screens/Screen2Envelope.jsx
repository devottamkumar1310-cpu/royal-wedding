import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWedding } from '../../context/WeddingContext';
import RoyalScene from '../motion/RoyalScene';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const Screen2Envelope = () => {
  const { advanceScreen } = useWedding();
  const [isOpen, setIsOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  
  // Scratch State
  const canvasRef = useRef(null);
  const hasRevealedRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const { playWaxCrack, playPaperUnfold, startScratchLoop, stopScratchLoop, playChime } = useSoundEffects();

  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    x: Math.cos((Math.PI * 2 * i) / 30) * (100 + Math.random() * 150),
    y: Math.sin((Math.PI * 2 * i) / 30) * (100 + Math.random() * 150),
  })), []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    playWaxCrack();
    setTimeout(playPaperUnfold, 150);

    setTimeout(() => {
      setIsCardVisible(true);
    }, 600); // Wait for envelope flap to open before showing the card
  };

  // Canvas initialization logic (similar to Screen3Reveal)
  useEffect(() => {
    if (!isCardVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#D4AF37'); 
      gradient.addColorStop(0.5, '#F3E5AB'); 
      gradient.addColorStop(1, '#D4AF37');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = "20px 'Cinzel', serif";
      ctx.fillStyle = "#0B3046"; 
      ctx.textAlign = "center";
      ctx.fillText("Scratch to Reveal", canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const preventTouch = (e) => e.preventDefault();
    canvas.addEventListener('touchstart', preventTouch, { passive: false });
    canvas.addEventListener('touchmove', preventTouch, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('touchstart', preventTouch);
        canvas.removeEventListener('touchmove', preventTouch);
      }
    };
  }, [isCardVisible]);

  const erase = (e) => {
    if (!isDrawing || hasRevealedRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }
    
    const posX = clientX - rect.left;
    const posY = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(posX, posY, 40, 0, Math.PI * 2);
    ctx.fill();

    checkRevealPercentage();
  };

  const checkRevealPercentage = () => {
    if (hasRevealedRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const totalSamplePixels = Math.floor(pixels.length / 32);
    const percentage = (transparentPixels / totalSamplePixels) * 100;

    if (percentage > 55 && !hasRevealedRef.current) {
      hasRevealedRef.current = true;
      setIsRevealed(true);
      
      stopScratchLoop();
      playChime();
    }
  };

  const foregroundContent = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
      className="relative z-40 flex flex-col items-center justify-center w-full h-full perspective-1000"
    >
      
      {!isCardVisible && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[15%] text-champagne-gold font-serif tracking-[0.2em] text-sm md:text-base uppercase"
            >
              Tap Envelope to Open
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* The Envelope */}
      <AnimatePresence>
        {!isCardVisible && (
          <motion.div 
            className="relative w-72 h-48 md:w-96 md:h-64 cursor-pointer mt-10 transition-transform duration-300 hover:scale-[1.02]"
            onClick={handleOpen}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-royal-blue border border-champagne-gold/30 rounded-sm shadow-2xl" />

            <div className="absolute top-0 left-0 w-0 h-0 border-l-[144px] md:border-l-[192px] border-l-royal-blue border-y-[96px] md:border-y-[128px] border-y-transparent z-10" />
            <div className="absolute top-0 right-0 w-0 h-0 border-r-[144px] md:border-r-[192px] border-r-royal-blue border-y-[96px] md:border-y-[128px] border-y-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[96px] md:border-b-[128px] border-b-royal-blue border-x-[144px] md:border-x-[192px] border-x-transparent z-20 drop-shadow-[0_-2px_10px_rgba(0,0,0,0.4)]" />

            <div className="absolute inset-0 z-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0,0 L 50,50 L 0,100" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                <path d="M 100,0 L 50,50 L 100,100" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                <path d="M 0,100 L 50,50 L 100,100" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.8" />
              </svg>
            </div>

            <motion.div 
              className="absolute top-0 left-0 w-full h-[96px] md:h-[128px] z-30 origin-top"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
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

      {/* The Invitation Card (Scratch Layer) */}
      <AnimatePresence>
        {isCardVisible && (
          <motion.div 
            initial={{ y: 200, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute z-50 w-[90%] max-w-md h-[400px] rounded-lg shadow-[0_20px_50px_rgba(212,175,55,0.3)] flex flex-col items-center justify-center bg-ivory text-royal-blue overflow-hidden border-4 border-transparent"
            style={{ 
              backgroundClip: "padding-box",
              backgroundImage: "linear-gradient(#FDFBF7, #FDFBF7), linear-gradient(135deg, #D4AF37, #F3E5AB, #D4AF37)",
              backgroundOrigin: "border-box"
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
              <h3 className="text-sm tracking-[0.2em] text-champagne-gold uppercase mb-4 font-bold">
                A Special Celebration Awaits
              </h3>
              <h2 className="text-3xl font-serif mb-4">
                Pooja & Jagdish
              </h2>
              <p className="font-sans text-sm opacity-80 leading-relaxed">
                You are warmly invited to join the <br/> Royal Wedding Celebration.
              </p>
              
              <AnimatePresence>
                {isRevealed && (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={advanceScreen}
                    className="mt-6 px-8 py-3 border border-champagne-gold text-champagne-gold uppercase tracking-widest text-sm rounded hover:bg-champagne-gold hover:text-ivory transition-colors duration-300"
                  >
                    Enter Celebration
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

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
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                  transition={{ duration: 1 }}
                />
              )}
            </AnimatePresence>
            
            {isRevealed && (
              <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                {particles.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-champagne-gold rounded-full shadow-[0_0_15px_#D4AF37]"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ 
                      x: p.x, 
                      y: p.y, 
                      scale: [0, 2, 0], 
                      opacity: [1, 1, 0] 
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <RoyalScene
      foregroundComponent={foregroundContent}
      withParticles={true}
      withLightRays={true}
      withBorders={true}
    />
  );
};

export default Screen2Envelope;
