import { useEffect, useRef, useCallback } from 'react';
import { useWedding } from '../context/WeddingContext';

// Audio is now ENABLED. Files expected in /public/audio/
// If a file is missing the playSound wrapper silently swallows the error.
const DEFAULT_VOLUME  = 0.15;
const AUDIO_ENABLED   = true;

// Volume per sound type — tuned for luxury feel (nothing jarring)
const VOLUMES = {
  waxCrack:    0.20,   // envelope wax seal crack — subtle
  paperUnfold: 0.22,   // paper unfold — soft
  scratchLoop: 0.13,   // looping scratch — quiet background texture
  chime:       0.18,   // enter screen chime
  reveal:      0.32,   // scratch reveal success — slightly louder, celebratory
  confettiBurst: 0.28, // confetti pop (pre-wired — drops silently if file missing)
  whoosh:      0.22,   // cinematic transition whoosh (pre-wired — drops silently)
};

export const useSoundEffects = () => {
  const { isMuted } = useWedding();
  
  const audioRefs = useRef({
    waxCrack:     null,
    paperUnfold:  null,
    scratchLoop:  null,
    chime:        null,
    reveal:       null,    // NEW — reuses chime.wav at higher volume
    confettiBurst: null,   // pre-wired for /audio/confetti-burst.wav (drop in later)
    whoosh:       null,    // pre-wired for /audio/reveal-whoosh.wav (drop in later)
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!AUDIO_ENABLED) return;

    const refs = audioRefs.current;

    // Core sounds — all 4 files exist in /public/audio/
    refs.waxCrack    = new Audio('/audio/wax-crack.wav');
    refs.paperUnfold = new Audio('/audio/paper-unfold.wav');
    refs.scratchLoop = new Audio('/audio/scratch-loop.wav');
    refs.chime       = new Audio('/audio/chime.wav');
    // Reveal: reuse chime.wav — a dedicated file can replace this later
    refs.reveal      = new Audio('/audio/chime.wav');

    // Optional sounds — silently skip if files are missing
    refs.confettiBurst = new Audio('/audio/confetti-burst.wav');
    refs.whoosh        = new Audio('/audio/reveal-whoosh.wav');

    // Configure
    refs.scratchLoop.loop = true;

    // Set per-sound volumes
    Object.entries(VOLUMES).forEach(([key, vol]) => {
      if (refs[key]) refs[key].volume = isMuted ? 0 : vol;
    });

    return () => {
      Object.values(refs).forEach(audio => {
        if (audio) { audio.pause(); audio.src = ''; }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume changes when mute toggled
  useEffect(() => {
    Object.entries(VOLUMES).forEach(([key, vol]) => {
      const audio = audioRefs.current[key];
      if (audio) audio.volume = isMuted ? 0 : vol;
    });
  }, [isMuted]);

  // ─── Safe play wrapper ────────────────────────────────────────────────────
  const playSound = useCallback(async (audioObj) => {
    if (!AUDIO_ENABLED || !audioObj || isMuted) return;
    try {
      audioObj.currentTime = 0;
      await audioObj.play();
    } catch {
      // Browser autoplay policy or missing file — fail silently
    }
  }, [isMuted]);

  // ─── Public API ───────────────────────────────────────────────────────────

  /** Wax seal crack — fires when envelope is tapped */
  const playWaxCrack = useCallback(() => {
    playSound(audioRefs.current.waxCrack);
    if (!isMuted && navigator.vibrate) navigator.vibrate([20]);
  }, [playSound, isMuted]);

  /** Paper unfold — fires 150ms after envelope tap */
  const playPaperUnfold = useCallback(() => {
    playSound(audioRefs.current.paperUnfold);
  }, [playSound]);

  /** Start looping scratch texture — while finger/mouse is down on canvas */
  const startScratchLoop = useCallback(() => {
    if (!AUDIO_ENABLED || !audioRefs.current.scratchLoop || isMuted) return;
    try { audioRefs.current.scratchLoop.play().catch(() => {}); } catch { /* */ }
  }, [isMuted]);

  /** Stop scratch loop — immediately on pointer up */
  const stopScratchLoop = useCallback(() => {
    const a = audioRefs.current.scratchLoop;
    if (a) a.pause();
  }, []);

  /** Reveal success chime — fires when scratch threshold is crossed */
  const playReveal = useCallback(() => {
    playSound(audioRefs.current.reveal);
    // Also fire confetti burst sound if file is available
    setTimeout(() => playSound(audioRefs.current.confettiBurst), 80);
    if (!isMuted && navigator.vibrate) navigator.vibrate([30, 40, 30, 40, 60]);
  }, [playSound, isMuted]);

  /** Enter screen chime — fires on Ganesh screen CTA */
  const playChime = useCallback(() => {
    playSound(audioRefs.current.chime);
    if (!isMuted && navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }, [playSound, isMuted]);

  /** Transition whoosh — available for screen transitions */
  const playWhoosh = useCallback(() => {
    playSound(audioRefs.current.whoosh);
  }, [playSound]);

  return {
    playWaxCrack,
    playPaperUnfold,
    startScratchLoop,
    stopScratchLoop,
    playReveal,
    playChime,
    playWhoosh,
  };
};
