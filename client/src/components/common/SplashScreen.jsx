import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { LogoIcon } from '@/components/ui/Logo';

export const SplashScreen = ({ onComplete }) => {
  const { isLoading: isAuthLoading } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const [phase, setPhase] = useState(0);
  const [isLogoPopping, setIsLogoPopping] = useState(false);

  // Show for at least 8 seconds for the full premium animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Phase progression for staggered reveal and logo pop
  useEffect(() => {
    const p1 = setTimeout(() => setIsLogoPopping(true), 600);    // Logo pops up
    const t1 = setTimeout(() => setPhase(1), 1200);   // Show name
    const p2 = setTimeout(() => setIsLogoPopping(false), 2500);  // Logo settles straight
    const t2 = setTimeout(() => setPhase(2), 2800);   // Show tagline + progress
    const t3 = setTimeout(() => setPhase(3), 5000);   // Show status text
    const t4 = setTimeout(() => setPhase(4), 7000);   // Ready shimmer
    return () => { clearTimeout(p1); clearTimeout(p2); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
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
          {/* Ultra-Premium Minimalist Logo Reveal */}
          <motion.div 
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 mb-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)]"
          >
            {/* Very subtle static glow behind the icon */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            
            {/* The icon pops up dynamically, then settles perfectly straight */}
            <div className="relative z-10 scale-[1.2]">
              <LogoIcon size="xl" className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]" isHoverSimulated={isLogoPopping} />
            </div>
          </motion.div>
          
          {/* App Name — same font as landing page with staggered letter animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-white/90 flex overflow-hidden">
              {'Voyage Genie'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                  className={char === ' ' ? 'w-2' : ''}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-blue-400"
              >.</motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] sm:text-[12px] font-light tracking-[0.25em] text-white/35 uppercase"
            >
              Your AI Travel Companion
            </motion.p>
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
