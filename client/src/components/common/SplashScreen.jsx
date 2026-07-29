import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const SplashScreen = ({ onComplete }) => {
  const { isLoading: isAuthLoading } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const [phase, setPhase] = useState(0); // 0 = logo, 1 = name, 2 = tagline, 3 = ready

  // Always show for at least 6.5 seconds so the full animation plays out
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 6500);
    return () => clearTimeout(timer);
  }, []);

  // Phase progression for staggered reveal
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Check if we've already shown the splash screen in this session
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
        exit={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#060B14] overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/30 via-indigo-500/20 to-purple-600/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
        />

        {/* Secondary glow pulse */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3, 0.6, 0] }}
          transition={{ duration: 6, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-violet-500/20 rounded-full blur-[80px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Logo Container */}
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 24px 48px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                '0 24px 64px rgba(59,130,246,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
                '0 24px 48px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] sm:rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
            
            {/* Liquid Sweep Animation */}
            <motion.div 
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Compass className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* App Name - Phase 1 */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md"
          >
            Pack<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Wise</span>
          </motion.h1>
          
          {/* Tagline - Phase 2 */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-[14px] sm:text-[15px] font-medium text-white/50 tracking-wide"
          >
            Your AI Travel Companion
          </motion.p>

          {/* Progress bar - Phase 2 */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={phase >= 2 ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 w-48 h-[3px] rounded-full bg-white/10 overflow-hidden origin-left"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={phase >= 2 ? { scaleX: 1 } : {}}
              transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full rounded-full origin-left bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500"
            />
          </motion.div>

          {/* Status text - Phase 3 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="mt-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/30"
          >
            Preparing your workspace...
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
