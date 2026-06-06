import { AnimatePresence, motion } from 'framer-motion';
import { WeddingProvider, useWedding } from './context/WeddingContext';

import Screen1Blessing from './components/screens/Screen1Blessing';
import Screen2Envelope from './components/screens/Screen2Envelope';
import Screen3Hub from './components/screens/Screen3Hub';
import FloatingLanternLayer from './components/motion/FloatingLanternLayer';
import GlobalLightRays from './components/motion/LightRays';

const SceneManager = () => {
  const { currentScreen } = useWedding();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } },
    out: { opacity: 0, y: -20, transition: { duration: 1.5, ease: "easeOut" } }
  };

  return (
    <div className="bg-royal-blue min-h-[100dvh] w-full text-ivory overflow-x-hidden relative flex flex-col items-center font-sans no-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          className="relative w-full min-h-[100dvh] flex flex-col items-center justify-start"
        >
          {currentScreen === 0 && <Screen1Blessing />}
          {currentScreen === 1 && <Screen2Envelope />}
          {currentScreen === 2 && <Screen3Hub />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

import AdminBlessings from './components/admin/AdminBlessings';
import AdminRSVPs from './components/admin/AdminRSVPs';
import AdminGallery from './components/admin/AdminGallery';
import AdminContent from './components/admin/AdminContent';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <WeddingProvider>
            {/* Global atmospheric layers — fixed, behind all screens */}
            <FloatingLanternLayer />
            <GlobalLightRays />
            <SceneManager />
          </WeddingProvider>
          } />
          
          {/* Protected Admin Area */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="blessings" element={<AdminBlessings />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="rsvps" element={<AdminRSVPs />} />
            <Route path="content" element={<AdminContent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}