
import { useState, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import NavigationMenu from '../shared/NavigationMenu';
import HeroSection from '../hub/HeroSection';
import TimelineJourney from '../hub/TimelineJourney';
import FamilyScroll from '../hub/FamilyScroll';
import VenueMap from '../hub/VenueMap';
import MemoriesGallery from '../hub/MemoriesGallery';
import BlessingsWall from '../hub/BlessingsWall';
import RsvpWidget from '../hub/RsvpWidget';
import RoyalScene from '../motion/RoyalScene';
import CelebrationOverlay from '../motion/CelebrationOverlay';

const Screen3Hub = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [showCelebration, setShowCelebration] = useState(true);

  // Parallax tracking using natural window scroll
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], ["0%", "15%"]);

  // W1 fix: memoize so RoyalScene doesn't receive a new foreground reference
  // on every render (e.g. showCelebration toggle). Only recomputes on tab change.
  const foregroundContent = useMemo(() => (
    <div 
      className="relative z-10 w-full flex flex-col items-center pt-8"
      style={{ paddingBottom: "calc(160px + env(safe-area-inset-bottom, 1rem))" }}
    >
      <AnimatePresence mode="wait">
        {activeTab === 'hero'      && <HeroSection     key="hero" />}
        {activeTab === 'family'    && <FamilyScroll    key="family" />}
        {activeTab === 'journey'   && <TimelineJourney key="journey" />}
        {activeTab === 'venue'     && <VenueMap        key="venue" />}
        {activeTab === 'gallery'   && <MemoriesGallery key="gallery" />}
        {activeTab === 'blessings' && <BlessingsWall   key="blessings" />}
        {activeTab === 'rsvp'      && <RsvpWidget      key="rsvp" />}
      </AnimatePresence>

      <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  ), [activeTab, setActiveTab]);

  return (
    <>
      {showCelebration && (
        <CelebrationOverlay onDone={() => setShowCelebration(false)} />
      )}
      <RoyalScene
        foregroundComponent={foregroundContent}
        withParticles={true}
        withLightRays={true}
        withBorders={true}
        bgStyle={{ y: bgY }}
        contentJustify="justify-start"
      />
    </>
  );
};

export default Screen3Hub;