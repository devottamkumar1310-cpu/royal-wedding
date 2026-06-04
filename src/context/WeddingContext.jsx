import { createContext, useState, useContext } from 'react';

// This creates our central memory bank
const WeddingContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useWedding = () => useContext(WeddingContext);
export const WeddingProvider = ({ children }) => {
  // We start on Screen 0 (The Ganesha Blessing)
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted, audio plays on interaction

  // Function to move to the next screen
  const advanceScreen = () => {
    setCurrentScreen((prev) => prev + 1);
  };

  // Function to trigger when they click "प्रवेश करें" (Enter)
  const startExperience = () => {
    setIsAudioPlaying(true); 
    advanceScreen();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <WeddingContext.Provider value={{ 
      currentScreen, 
      advanceScreen, 
      startExperience, 
      isAudioPlaying,
      isMuted,
      toggleMute
    }}>
      {children}
    </WeddingContext.Provider>
  );
};

