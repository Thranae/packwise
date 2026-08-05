import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { Plane, MapPin } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { DiscoverySwipe } from '@/components/explore/DiscoverySwipe';

export default function AssistantIntro({ onStart }) {
  // We no longer need the complex scroll logic since DiscoverySwipe handles gestures
  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col bg-[#030712]">
      
      {/* Typography Section (Top) */}
      <div className="absolute top-[calc(6vh+var(--safe-top))] left-0 right-0 z-50 px-8 pointer-events-none flex flex-col items-center drop-shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline gap-2"
        >
          <span className="text-white text-5xl sm:text-6xl font-bold tracking-tighter drop-shadow-2xl">
            Pack
          </span>
          <span 
            className="text-white text-6xl sm:text-7xl font-normal -ml-2 drop-shadow-2xl" 
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Wise.
          </span>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/80 text-sm font-bold tracking-wide mt-2 drop-shadow-xl"
        >
          Swipe horizontally to explore destinations
        </motion.p>
      </div>

      {/* Interactive 3D Stacked Deck */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pt-[10vh]">
        <DiscoverySwipe onStart={onStart} />
      </div>

    </div>
  );
}

