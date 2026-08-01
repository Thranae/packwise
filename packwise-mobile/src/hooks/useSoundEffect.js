import { useCallback, useRef, useEffect } from 'react';

// Web Audio API context (shared globally)
let audioCtx;

export function useSoundEffect() {
  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    // Resume context if suspended (browser autoplay policy)
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playSound = useCallback((type = 'tap') => {
    try {
      initAudio();
      if (!audioCtx) return;

      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'tap') {
        // Soft, muted click/tap sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        
        osc.start(t);
        osc.stop(t + 0.05);
      } 
      else if (type === 'success') {
        // Pleasant, rising two-tone chime
        osc.type = 'sine';
        
        // First note
        osc.frequency.setValueAtTime(523.25, t); // C5
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        
        // Second note (slightly delayed)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, t + 0.1); // G5
        gain2.gain.setValueAtTime(0, t + 0.1);
        gain2.gain.linearRampToValueAtTime(0.1, t + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        
        osc.start(t);
        osc.stop(t + 0.15);
        
        osc2.start(t + 0.1);
        osc2.stop(t + 0.4);
      }
      else if (type === 'error') {
        // Dull, low thud
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        
        osc.start(t);
        osc.stop(t + 0.15);
      }
    } catch (err) {
      console.warn('Audio playback failed', err);
    }
  }, []);

  return { playSound };
}
