import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { getTripImage } from '@/utils/imageUtils';

// Build 100+ destinations from the constant
const DESTINATIONS = SLIDESHOW_IMAGES.map((img, index) => ({
  id: index,
  name: `${img.city}, ${img.country}`,
  image: getTripImage(img.city), // Use the image utility for HD Unsplash images
  description: `Experience the breathtaking beauty and culture of ${img.city}.`
}));

export function DiscoverySwipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % DESTINATIONS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handlePrev(); // Swiping right goes to previous
    } else if (info.offset.x < -threshold) {
      handleNext(); // Swiping left goes to next
    }
  };

  // Handle tap for left/right navigation (Instagram Stories style)
  const handleTap = (event, info) => {
    // Determine click position relative to the element
    const rect = event.target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    
    // If clicked on the left 40% of the card, go prev. Otherwise next.
    if (clickX < rect.width * 0.4) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  // Get the current card to display
  const currentCard = DESTINATIONS[currentIndex];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      rotate: direction > 0 ? 10 : -10
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      rotate: direction < 0 ? 10 : -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    })
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] perspective-1000 overflow-hidden rounded-[48px]">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          onTap={handleTap}
          whileDrag={{ scale: 0.98, cursor: 'grabbing' }}
          className="absolute inset-0 w-full h-full rounded-[48px] overflow-hidden bg-slate-900 border border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.5)] touch-pan-y cursor-pointer transform-gpu"
        >
          <img 
            src={currentCard.image} 
            alt={currentCard.name} 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          
          {/* Gradient fade at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          
          {/* Text Content */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 pointer-events-none flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold uppercase tracking-widest">{currentCard.name}</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white">{currentCard.name.split(',')[0]}</h3>
            <p className="text-white/80 text-sm sm:text-base font-medium">{currentCard.description}</p>
          </div>

          {/* Hint Overlay (Left/Right Chevrons) */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 hidden md:flex">
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
