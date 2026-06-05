import { motion } from 'framer-motion';
import ParticleSystem from './ParticleSystem';
import AudioToggle from '../shared/AudioToggle';
import { 
  FloralClusterTopLeft, 
  FloralClusterTopRight, 
  FloralClusterBottomLeft, 
  FloralClusterBottomRight, 
  FloralBranchEdgeLeft, 
  FloralBranchEdgeRight,
  LargePeonyBackground,
  LargeEucalyptusBackground
} from '../svg/BotanicalDecor';

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
    <div className="relative flex items-center justify-center min-h-[100dvh] w-full overflow-x-hidden bg-[#EDF5E9] perspective-1000">
      
      <AudioToggle />

      {/* 1. Background Layer (Furthest back, slow parallax) */}
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: "easeOut" }}
        style={bgStyle}
      >
        <div className="absolute inset-0 bg-breathing bg-[#EDF5E9]" />
        
        {/* Large Background Florals (Background Layer, opacity 40-60%, soft-focus background, partially offset behind sections) */}
        <LargePeonyBackground className="absolute -left-24 top-[15%] w-[450px] h-[450px] opacity-[0.50] pointer-events-none select-none" />
        <LargeEucalyptusBackground className="absolute -right-32 top-[40%] w-[500px] h-[600px] opacity-[0.50] pointer-events-none select-none" transform="rotate(-15)" />
        <LargePeonyBackground className="absolute -left-32 bottom-[10%] w-[400px] h-[400px] opacity-[0.45] pointer-events-none select-none" />
        
        {backgroundComponent}
      </motion.div>

      {/* 2. Particle Layer (dust/sparkle atmosphere) */}
      {withParticles && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ParticleSystem count={80} />
        </div>
      )}

      {/* Botanical Viewport Framing Overlay (Foreground Layer 80-100%, Mid Layer 60-80%) */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none">
        <FloralClusterTopLeft className="absolute top-0 left-0 opacity-[0.90]" />
        <FloralClusterTopRight className="absolute top-0 right-0 opacity-[0.90]" />
        <FloralClusterBottomLeft className="absolute bottom-0 left-0 opacity-[0.90]" />
        <FloralClusterBottomRight className="absolute bottom-0 right-0 opacity-[0.90]" />
        <FloralBranchEdgeLeft className="absolute left-0 top-[30%] opacity-[0.70]" />
        <FloralBranchEdgeRight className="absolute right-0 top-[30%] opacity-[0.70]" />
      </div>

      {/* 3. Midground Layer (Gates, Architectural elements) */}
      <motion.div 
        className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
      >
        {midgroundComponent}
      </motion.div>

      {/* 4. Borders & Corners removed for Visual Simplification */}

      {/* 5. Foreground / Content Layer (Text, Interactions) */}
      <div className={`relative z-40 flex flex-col items-center ${contentJustify} w-full min-h-[100dvh]`}>
        {foregroundComponent}
        {children}
      </div>

    </div>
  );
};

export default RoyalScene;
