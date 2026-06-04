import { motion } from 'framer-motion';
import ParticleSystem from './ParticleSystem';
import LightRays from './LightRays';
import RoyalBorder from '../svg/RoyalBorder';
import FiligreeCorner from '../svg/FiligreeCorner';
import SkyLanterns from './SkyLanterns';
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
  bgStyle = {}
}) => {
  return (
    <div className="relative flex items-center justify-center min-h-[100dvh] w-full overflow-hidden bg-royal-blue perspective-1000">
      
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
        {withLightRays && <LightRays />}
      </motion.div>

      {/* 2. Particle Layer & Lanterns */}
      {withParticles && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ParticleSystem count={40} />
          <SkyLanterns count={6} />
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
          <RoyalBorder />
          <FiligreeCorner position="top-left" className="absolute top-6 left-6 opacity-70 w-16 h-16 md:w-24 md:h-24" />
          <FiligreeCorner position="top-right" className="absolute top-6 right-6 opacity-70 w-16 h-16 md:w-24 md:h-24" />
          <FiligreeCorner position="bottom-left" className="absolute bottom-6 left-6 opacity-70 w-16 h-16 md:w-24 md:h-24" />
          <FiligreeCorner position="bottom-right" className="absolute bottom-6 right-6 opacity-70 w-16 h-16 md:w-24 md:h-24" />
          
          {/* Decorative Corner Diyas */}
          <Diya className="absolute bottom-8 left-8 md:bottom-10 md:left-10 opacity-90" />
          <Diya className="absolute bottom-8 right-8 md:bottom-10 md:right-10 opacity-90" flipped={true} />
        </div>
      )}

      {/* 5. Foreground / Content Layer (Text, Interactions) */}
      <div className="relative z-40 flex flex-col items-center justify-center w-full h-full">
        {foregroundComponent}
        {children}
      </div>

    </div>
  );
};

export default RoyalScene;
