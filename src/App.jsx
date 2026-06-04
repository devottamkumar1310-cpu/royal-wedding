import { AnimatePresence, motion } from 'framer-motion';
import { WeddingProvider, useWedding } from './context/WeddingContext';

import Screen1Blessing from './components/screens/Screen1Blessing';
import Screen2Envelope from './components/screens/Screen2Envelope';
import Screen3Hub from './components/screens/Screen3Hub';
import MusicPlayer from './components/shared/MusicPlayer';
import SoundToggle from './components/shared/SoundToggle';

const SceneManager = () => {
  const { currentScreen } = useWedding();

  const pageVariants = {
    initial: { opacity: 0, filter: "blur(10px)" },
    in: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.5, ease: "easeInOut" } },
    out: { opacity: 0, filter: "blur(10px)", transition: { duration: 1.5, ease: "easeInOut" } }
  };

  return (
    <div className="bg-royal-blue min-h-[100dvh] w-full text-ivory overflow-hidden relative flex items-center justify-center font-sans no-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
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
              <MusicPlayer />
              <SoundToggle />
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