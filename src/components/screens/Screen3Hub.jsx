
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroSection from '../hub/HeroSection';
import TimelineJourney from '../hub/TimelineJourney';
import FamilyScroll from '../hub/FamilyScroll';
import VenueMap from '../hub/VenueMap';
import MemoriesGallery from '../hub/MemoriesGallery';
import BlessingsWall from '../hub/BlessingsWall';
import RsvpWidget from '../hub/RsvpWidget';
import RoyalScene from '../motion/RoyalScene';
import CelebrationOverlay from '../motion/CelebrationOverlay';

// ─── Section order ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',      Component: HeroSection     },
  { id: 'family',    Component: FamilyScroll    },
  { id: 'journey',   Component: TimelineJourney },
  { id: 'venue',     Component: VenueMap        },
  { id: 'gallery',   Component: MemoriesGallery },
  { id: 'blessings', Component: BlessingsWall   },
  { id: 'rsvp',      Component: RsvpWidget      },
];

// ─── Scroll-reveal variants (unchanged) ───────────────────────────────────────
const revealVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const Screen3Hub = () => {
  const [showCelebration, setShowCelebration] = useState(true);

  // Parallax tracking — unchanged
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], ['0%', '15%']);

  return (
    <>
      {showCelebration && (
        <CelebrationOverlay onDone={() => setShowCelebration(false)} />
      )}

      <RoyalScene
        withParticles={true}
        withLightRays={true}
        withBorders={true}
        bgStyle={{ y: bgY }}
        contentJustify="justify-start"
        foregroundComponent={
          <div className="relative z-10 w-full flex flex-col items-center pt-8">
            {SECTIONS.map(({ id, Component }) => (
              <motion.div
                key={id}
                id={`section-${id}`}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                className="w-full"
              >
                <Component />
              </motion.div>
            ))}
          </div>
        }
      />
    </>
  );
};

export default Screen3Hub;
