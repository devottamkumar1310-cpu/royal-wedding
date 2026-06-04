

import { useState, useRef } from 'react';
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

const Screen3Hub = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const scrollRef = useRef(null);

  // Parallax tracking
  const { scrollY } = useScroll({ container: scrollRef });
  const bgY = useTransform(scrollY, [0, 1000], ["0%", "15%"]);

  const foregroundContent = (
    <div 
      ref={scrollRef}
      className="relative z-10 w-full h-full flex flex-col items-center pt-8 pb-[calc(120px+env(safe-area-inset-bottom))] overflow-y-auto no-scrollbar scroll-smooth"
    >
      <AnimatePresence mode="wait">
        {activeTab === 'hero' && <HeroSection key="hero" />}
        {activeTab === 'family' && <FamilyScroll key="family" />}
        {activeTab === 'journey' && <TimelineJourney key="journey" />}
        {activeTab === 'venue' && <VenueMap key="venue" />}
        {activeTab === 'gallery' && <MemoriesGallery key="gallery" />}
        {activeTab === 'blessings' && <BlessingsWall key="blessings" />}
        {activeTab === 'rsvp' && <RsvpWidget key="rsvp" />}
      </AnimatePresence>

      <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );

  return (
    <RoyalScene
      foregroundComponent={foregroundContent}
      withParticles={true}
      withLightRays={true}
      withBorders={true}
      bgStyle={{ y: bgY }}
    />
  );
};

export default Screen3Hub;