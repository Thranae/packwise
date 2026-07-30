import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { LogoIcon } from '@/components/ui/Logo';

export const SplashScreen = ({ onComplete }) => {
  const { isLoading: isAuthLoading } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const [phase, setPhase] = useState(0);

  // Show for at least 8 seconds for the full premium animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Phase progression for staggered reveal
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);   // Show name
    const t2 = setTimeout(() => setPhase(2), 2800);   // Show tagline + progress
    const t3 = setTimeout(() => setPhase(3), 5000);   // Show status text
    const t4 = setTimeout(() => setPhase(4), 7000);   // Ready shimmer
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  // Skip if already seen this session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShouldHide(true);
      onComplete();
    } else {
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, [onComplete]);

  // When both auth is ready and min time has passed, trigger complete
  useEffect(() => {
    if (!isAuthLoading && minTimePassed && !shouldHide) {
      setShouldHide(true);
      onComplete();
    }
  }, [isAuthLoading, minTimePassed, onComplete, shouldHide]);

  if (shouldHide) return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="splash"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#030712' }}
      >
        <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
          {/* Stunning Minimalist Animation */}
          <div className="relative flex items-center justify-center w-32 h-32 mb-10">
              {/* Expanding pulse rings */}
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-[1.5px] border-blue-400/50"
              />
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.25 }}
                className="absolute inset-0 rounded-full border-[1.5px] border-indigo-400/50"
              />
              {/* Center glowing app logo */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="relative z-10 w-24 h-24 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-2xl flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3),inset_0_2px_15px_rgba(255,255,255,0.2)] group"
              >
                <LogoIcon size="lg" isHoverSimulated={true} className="w-12 h-12 text-white z-10 pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
              </motion.div>
          </div>
          
          {/* App Name minimal text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-1"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white/90 uppercase drop-shadow-md">
              Voyage Genie
            </h1>
            <p className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] text-white/40 uppercase mt-2">
              Your AI Travel Companion
            </p>
          </motion.div>
        </div>

        {/* Bottom branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-12 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">
            POWERED BY THRANAESWANTH
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
