import { motion } from 'framer-motion';
import ParticleSystem from './ParticleSystem';
import { 
  FloralClusterTopLeft, 
  FloralClusterTopRight, 
  FloralClusterBottomLeft, 
  FloralClusterBottomRight
} from '../svg/BotanicalDecor';

const RoyalScene = ({ 
  children, 
  foregroundComponent,
  withParticles = true, 
  withBorders = true,
  bgStyle = {},
  contentJustify = "justify-center",
  withOverlayFlorals = true
}) => {
  return (
    <div className="relative flex items-center justify-center min-h-[100dvh] w-full overflow-x-hidden bg-[#FAF6F0] perspective-1000">
      

      {/* 1. Background Layer (Clean, warm luxury ivory cardstock) */}
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden bg-[#FAF6F0]"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: "easeOut" }}
        style={bgStyle}
      >
        {/* Soft atmospheric warming gradient - clean and subtle */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-transparent to-[#F5EFEB]/20 pointer-events-none" />
      </motion.div>

      {/* 2. Particle Layer (dust/sparkle atmosphere) */}
      {withParticles && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ParticleSystem count={200} />
        </div>
      )}

      {/* 3. Foreground / Content Layer (Text, Interactions) */}
      <div className={`relative z-40 flex flex-col items-center ${contentJustify} w-full min-h-[100dvh]`}>
        {foregroundComponent}
        {children}
      </div>

      {/* 4. Layer 1: Foreground Botanical Viewport Framing Overlay (z-50, corners only, center completely clean) */}
      {withOverlayFlorals && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden select-none">
          {/* Dense luxury botanical clusters in 4 corners with camera lens-blur */}
          <FloralClusterTopLeft className="absolute top-0 left-0 opacity-[0.95] w-48 md:w-64" style={{ filter: 'blur(0.5px)' }} />
          <FloralClusterTopRight className="absolute top-0 right-0 opacity-[0.95] w-48 md:w-64" style={{ filter: 'blur(0.5px)' }} />
          <FloralClusterBottomLeft className="absolute bottom-0 left-0 opacity-[0.95] w-48 md:w-64" style={{ filter: 'blur(0.8px)' }} />
          <FloralClusterBottomRight className="absolute bottom-0 right-0 opacity-[0.95] w-48 md:w-64" style={{ filter: 'blur(0.8px)' }} />
        </div>
      )}

    </div>
  );
};

export default RoyalScene;
