import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';

export default function AssistantIntro({ onStart }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Background Image Full Bleed with Crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={currentSlideIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${SLIDESHOW_IMAGES[currentSlideIndex].url}")`
          }}
        />
      </AnimatePresence>

      {/* Very subtle gradient overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Typography Section (Top) */}
      <div className="relative z-10 px-8 pt-[calc(10vh+var(--safe-top))]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline gap-2"
        >
          <span className="text-white text-5xl sm:text-6xl font-bold tracking-tighter drop-shadow-lg">
            Pack
          </span>
          <span 
            className="text-white text-6xl sm:text-7xl font-normal drop-shadow-xl -ml-2" 
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Wise.
          </span>
        </motion.div>
        
        {/* Destination Location Label (Extra Touch) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`label-${currentSlideIndex}`}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 flex flex-col"
        >
          <span className="text-white/90 font-medium text-lg tracking-wide drop-shadow-md">
            {SLIDESHOW_IMAGES[currentSlideIndex].city}
          </span>
          <span className="text-white/60 font-bold text-xs tracking-[0.2em] uppercase drop-shadow-md">
            {SLIDESHOW_IMAGES[currentSlideIndex].country}
          </span>
        </motion.div>
      </div>

      {/* Button Section (Bottom) */}
      <div className="relative z-10 w-full px-8 pb-[calc(10vh+var(--safe-bottom))] flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={onStart}
          className="w-[200px] h-[64px] rounded-[32px] ios-liquid-button text-white text-[20px] font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Start
        </motion.button>
      </div>
    </div>
  );
}
