import { motion } from 'framer-motion';
import ParticleSystem from './ParticleSystem';
// LightRays is now a global fixed layer mounted in App.jsx — not per-scene
import RoyalBorder from '../svg/RoyalBorder';
import FiligreeCorner from '../svg/FiligreeCorner';
import Diya from '../svg/Diya';
import AudioToggle from '../shared/AudioToggle';

const RoyalScene = ({ 
  children, 
  backgroundComponent, 
  midgroundComponent,
  foregroundComponent,
  withParticles = true, 
  withLightRays = true,
  withBorders = true,
  bgStyle = {},
  contentJustify = "justify-center"
}) => {
  return (
    <div className="relative flex items-center justify-center min-h-[100dvh] w-full overflow-x-hidden bg-royal-blue perspective-1000">
      
      <AudioToggle />

      {/* 1. Background Layer (Furthest back, slow parallax) */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: "easeOut" }}
        style={bgStyle}
      >
        {backgroundComponent}
        {/* withLightRays prop kept for API compat — LightRays is now a global fixed layer */}
      </motion.div>

      {/* 2. Particle Layer (dust/sparkle atmosphere) */}
      {withParticles && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ParticleSystem count={40} />
        </div>
      )}

      {/* 3. Midground Layer (Gates, Architectural elements) */}
      <motion.div 
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        {midgroundComponent}
      </motion.div>

      {/* 4. Borders & Corners (Static UI layer over architecture) */}
      {withBorders && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Hide side borders on mobile — recover horizontal width */}
          <div className="hidden md:block">
            <RoyalBorder />
          </div>
          <FiligreeCorner position="top-left"    className="absolute top-3 left-3 md:top-6 md:left-6   opacity-70 w-10 h-10 md:w-24 md:h-24" />
          <FiligreeCorner position="top-right"   className="absolute top-3 right-3 md:top-6 md:right-6 opacity-70 w-10 h-10 md:w-24 md:h-24" />
          <FiligreeCorner position="bottom-left"  className="absolute bottom-3 left-3 md:bottom-6 md:left-6   opacity-70 w-10 h-10 md:w-24 md:h-24" />
          <FiligreeCorner position="bottom-right" className="absolute bottom-3 right-3 md:bottom-6 md:right-6 opacity-70 w-10 h-10 md:w-24 md:h-24" />

          {/* Decorative Corner Diyas */}
          <Diya className="absolute bottom-6 left-4 md:bottom-10 md:left-10 opacity-80" />
          <Diya className="absolute bottom-6 right-4 md:bottom-10 md:right-10 opacity-80" flipped={true} />
        </div>
      )}

      {/* 5. Foreground / Content Layer (Text, Interactions) */}
      <div className={`relative z-40 flex flex-col items-center ${contentJustify} w-full min-h-[100dvh]`}>
        {foregroundComponent}
        {children}
      </div>

    </div>
  );
};

export default RoyalScene;
