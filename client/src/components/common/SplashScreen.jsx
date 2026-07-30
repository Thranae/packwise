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
        style={{ backgroundColor: '#060B14' }}
      >
        {/* Animated Background Particles - Removed blur filter, relying on radial-gradient instead for performance */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.15, 0.05, 0.15, 0],
              scale: [0.5, 1.2, 0.8, 1.1, 0.5],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              y: [0, (i % 3 === 0 ? -20 : 20), 0],
            }}
            transition={{ duration: 6 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            className="absolute rounded-full pointer-events-none transform-gpu"
            style={{
              width: `${200 + i * 60}px`,
              height: `${200 + i * 60}px`,
              top: `${20 + (i * 15) % 60}%`,
              left: `${10 + (i * 20) % 80}%`,
              background: [
                'radial-gradient(circle, rgba(79,124,255,0.2), transparent 70%)',
                'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
                'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)',
                'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
              ][i],
            }}
          />
        ))}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.3
          }}
          className="relative z-10 flex flex-col items-center transform-gpu"
        >
          {/* Logo Container with static glow for performance */}
          <div 
            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-[36px] sm:rounded-[42px] border backdrop-blur-md flex items-center justify-center overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.15)]"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderColor: 'rgba(255,255,255,0.1)' 
            }}
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(79,124,255,0.1), rgba(139,92,246,0.1))' }} />
            
            {/* Slow rotating ring behind logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-2px] rounded-[38px] sm:rounded-[44px] transform-gpu"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(79,124,255,0.3) 25%, transparent 50%, rgba(139,92,246,0.3) 75%, transparent 100%)',
              }}
            />
            <div className="absolute inset-[1px] rounded-[35px] sm:rounded-[41px]" style={{ backgroundColor: '#060B14' }} />
            <div className="absolute inset-[1px] rounded-[35px] sm:rounded-[41px]" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />

            {/* Liquid Sweep Animation - Optimized with transform */}
            <motion.div 
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute inset-0 w-[200%] skew-x-12 transform-gpu"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
            />
            
            {/* Logo with entrance animation */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="relative z-10 transform-gpu"
            >
              <LogoIcon size="lg" />
            </motion.div>
          </div>

          {/* App Name - Phase 1: letter by letter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex items-baseline gap-1"
          >
            {'Voyage'.split('').map((char, i) => (
              <motion.span
                key={`v-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: '#ffffff' }}
              >
                {char}
              </motion.span>
            ))}
            <span style={{ width: '8px' }} />
            {'Genie'.split('').map((char, i) => (
              <motion.span
                key={`g-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ 
                  background: 'linear-gradient(90deg, #4F7CFF, #818CF8)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: '#4F7CFF' }}
            >.</motion.span>
          </motion.div>
          
          {/* Tagline - Phase 2 */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-[14px] sm:text-[15px] font-medium tracking-wide text-center"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Your AI Travel Companion
          </motion.p>

          {/* Progress bar - Phase 2 */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0, width: 0 }}
            animate={phase >= 2 ? { opacity: 1, scaleX: 1, width: '12rem' } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 h-[3px] rounded-full overflow-hidden origin-left"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={phase >= 2 ? { scaleX: 1 } : {}}
              transition={{ duration: 5, ease: [0.05, 0.9, 0.3, 1] }}
              className="h-full w-full rounded-full origin-left"
              style={{ background: 'linear-gradient(90deg, #4F7CFF, #818CF8, #A78BFA)' }}
            />
          </motion.div>

          {/* Loading steps - Phase 3 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="mt-5 flex flex-col items-center gap-2"
          >
            {[
              { text: 'Initializing AI engine', delay: 0, done: phase >= 4 },
              { text: 'Loading your trips', delay: 0.3, done: phase >= 4 },
              { text: 'Preparing workspace', delay: 0.6, done: phase >= 4 },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: step.delay }}
                className="flex items-center gap-2"
              >
                {step.done ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#22c55e" opacity="0.2" />
                      <path d="M4 7.5L5.8 9.3L10 5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: 'rgba(255,255,255,0.15)', borderTopColor: 'transparent', borderRightColor: '#4F7CFF' }}
                  />
                )}
                <span 
                  className="text-[11px] font-semibold tracking-[0.15em] uppercase"
                  style={{ color: step.done ? 'rgba(34,197,94,0.7)' : 'rgba(255,255,255,0.3)' }}
                >
                  {step.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-10 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-medium tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Powered by AI
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
