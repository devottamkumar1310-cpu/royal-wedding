import { useEffect, useRef, useCallback } from 'react';
import { useWedding } from '../context/WeddingContext';

const DEFAULT_VOLUME = 0.15; // 15% volume as requested
const AUDIO_ENABLED = false; // TEMPORARILY DISABLED FOR V1

export const useSoundEffects = () => {
  const { isMuted } = useWedding();
  
  // Audio references
  const audioRefs = useRef({
    waxCrack: null,
    paperUnfold: null,
    scratchLoop: null,
    chime: null,
  });

  // Preload audio files
  useEffect(() => {
    // Only works in browser environment
    if (typeof window === 'undefined') return;

    audioRefs.current.waxCrack = new Audio('/audio/wax-crack.wav');
    audioRefs.current.paperUnfold = new Audio('/audio/paper-unfold.wav');
    audioRefs.current.scratchLoop = new Audio('/audio/scratch-loop.wav');
    audioRefs.current.chime = new Audio('/audio/chime.wav');
    // Configure loop
    if (audioRefs.current.scratchLoop) {
      audioRefs.current.scratchLoop.loop = true;
    }

    // Set initial volumes
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) audio.volume = DEFAULT_VOLUME;
    });

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Update volume when mute state changes
  useEffect(() => {
    const vol = isMuted ? 0 : DEFAULT_VOLUME;
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) audio.volume = vol;
    });
  }, [isMuted]);

  // Safe play wrapper that ignores missing file errors
  const playSound = useCallback(async (audioObj) => {
    if (!AUDIO_ENABLED || !audioObj || isMuted) return;
    try {
      audioObj.currentTime = 0;
      await audioObj.play();
    } catch (err) {
      // Ignore errors for missing files or auto-play restrictions
      console.warn("Audio play failed, likely missing file in /public/audio/", err);
    }
  }, [isMuted]);

  // Specific Actions
  const playWaxCrack = useCallback(() => {
    if (!AUDIO_ENABLED) return;
    playSound(audioRefs.current.waxCrack);
    if (!isMuted && navigator.vibrate) {
      navigator.vibrate([20]); // Subtle click
    }
  }, [playSound, isMuted]);

  const playPaperUnfold = useCallback(() => {
    playSound(audioRefs.current.paperUnfold);
  }, [playSound]);

  const startScratchLoop = useCallback(() => {
    if (!AUDIO_ENABLED || !audioRefs.current.scratchLoop || isMuted) return;
    try {
      audioRefs.current.scratchLoop.play().catch(() => {});
    } catch (_) {}
  }, [isMuted]);

  const stopScratchLoop = useCallback(() => {
    if (!audioRefs.current.scratchLoop) return;
    audioRefs.current.scratchLoop.pause();
  }, []);

  const playChime = useCallback(() => {
    if (!AUDIO_ENABLED) return;
    playSound(audioRefs.current.chime);
    if (!isMuted && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]); // Elegant heartbeat pulse
    }
  }, [playSound, isMuted]);

  return {
    playWaxCrack,
    playPaperUnfold,
    startScratchLoop,
    stopScratchLoop,
    playChime,
  };
};
