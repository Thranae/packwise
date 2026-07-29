import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

export const PullToRefresh = ({ children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 1
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { lightTap, successTap } = useHaptics();

  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef(null);

  const MAX_PULL = 120; // max pixels to drag
  const THRESHOLD = 80; // pixels to trigger refresh

  useEffect(() => {
    // Prevent default overscroll behavior on body
    document.body.style.overscrollBehaviorY = 'none';
    return () => {
      document.body.style.overscrollBehaviorY = 'auto';
    };
  }, []);

  const handleTouchStart = (e) => {
    if (window.scrollY > 0) return; // Only allow pull when at top
    if (isRefreshing) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e) => {
    if (!isPulling || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0) {
      // If we are pulling down at the top of the page, prevent native scroll
      if (window.scrollY === 0) {
        // e.preventDefault() cannot be called here if listener is passive, 
        // but we handle visual logic safely
        const progress = Math.min(deltaY / THRESHOLD, 1.2);
        
        // Haptic feedback when crossing threshold
        if (pullProgress < 1 && progress >= 1) {
          lightTap();
        }
        
        setPullProgress(progress);
      }
    } else {
      setPullProgress(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling || isRefreshing) return;
    setIsPulling(false);
    
    if (pullProgress >= 1) {
      setIsRefreshing(true);
      successTap();
      
      // Perform the refresh action
      setTimeout(() => {
        window.location.reload();
      }, 500); // give the animation half a second to show loading
    } else {
      setPullProgress(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full"
    >
      {/* The Pull Indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && pullProgress > 0 && (
          <motion.div 
            initial={{ y: -60, opacity: 0 }}
            animate={{ 
              y: isRefreshing ? 40 : pullProgress * 40,
              opacity: Math.min(pullProgress, 1),
              scale: isRefreshing ? 1 : 0.8 + (pullProgress * 0.2)
            }}
            exit={{ y: -60, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_16px_32px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] ios-3d-element">
              <Loader2 className={`w-5 h-5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: isRefreshing ? 'none' : `rotate(${pullProgress * 180}deg)` }} />
              <span className="text-[13px] font-bold text-white tracking-wide">
                {isRefreshing ? 'Refreshing...' : pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content pushed down slightly when pulled */}
      <motion.div
        animate={{ y: (isPulling && !isRefreshing) ? (pullProgress * (MAX_PULL/2)) : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
