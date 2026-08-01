import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, PlaneTakeoff, Sparkles } from 'lucide-react';

const TransitionContext = createContext();

export const useTransitionNavigate = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState('Preparing your journey...');
  const [progress, setProgress] = useState(0);

  const triggerTransition = useCallback((to, options = { text: 'Preparing your journey...' }) => {
    setTransitionText(options.text);
    setIsTransitioning(true);
    setProgress(0);
    
    // Start hardware-accelerated progress bar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setProgress(1);
      });
    });
    
    // Give the solid overlay 800ms to completely cover the screen and finish all fade animations.
    // This guarantees the screen is static BEFORE the browser thread freezes to load the map!
    setTimeout(() => {
      navigate(to);
      
      // Total loading time 7 seconds per user request (800ms + 6200ms)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 6200); 
    }, 800); 
  }, [navigate]);

  return (
    <TransitionContext.Provider value={triggerTransition}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            // Solid dark background, no heavy backdrop-filter blur which crashes GPU
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060B14]"
          >
            {/* Simple static background glow, no CSS pulse animations to avoid glitching during freeze */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Fade in the content purely with opacity, NO physics springs! */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Premium Static Icon (Won't glitch if thread freezes) */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-[#4F7CFF] rounded-[24px] flex items-center justify-center border border-white/20 shadow-[0_10px_30px_rgba(59,130,246,0.3)] relative z-10">
                  <PlaneTakeoff className="w-10 h-10 text-white translate-x-0.5 -translate-y-0.5" />
                </div>
              </div>
              
              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">{transitionText}</h2>
              
              <p className="text-sm text-white/50 flex items-center gap-1.5 mb-8">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Initializing engine...
              </p>

              {/* Hardware-Accelerated Progress Bar (Runs entirely on GPU compositor) */}
              <div className="w-64 max-w-[80vw] h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full origin-left" 
                  style={{ 
                    transform: `scaleX(${progress})`, 
                    transition: 'transform 7s cubic-bezier(0.1, 0.7, 0.1, 1)' 
                  }} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};
