import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { Plane, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    };
  }
};

export default function AssistantIntro({ onStart }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const dests = SLIDESHOW_IMAGES.slice(0, 15);

  // Wrap around for infinite loop
  const imageIndex = ((page % dests.length) + dests.length) % dests.length;
  const card = dests[imageIndex];

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col bg-[#050B14] items-center justify-center">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-purple-900/20 to-transparent" />
        <motion.div 
          key={`bg-${imageIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 blur-[100px] scale-150"
          style={{ backgroundImage: `url(${card.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </div>

      {/* Top Typography */}
      <div className="absolute top-[calc(6vh+var(--safe-top))] left-0 right-0 z-50 px-8 pointer-events-none flex flex-col items-center drop-shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline gap-2"
        >
          <span className="text-white text-4xl sm:text-5xl font-bold tracking-tighter drop-shadow-2xl">Pack</span>
          <span className="text-white text-5xl sm:text-6xl font-normal -ml-2 drop-shadow-2xl" style={{ fontFamily: "'Pacifico', cursive" }}>Wise.</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-xs sm:text-sm font-bold tracking-wide mt-2"
        >
          Swipe to discover destinations
        </motion.p>
      </div>

      {/* Clean Liquid Glass Slider Container */}
      <div className="relative w-full max-w-[340px] aspect-[4/5] z-10 flex items-center justify-center perspective-1000">
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 }, scale: { duration: 0.3 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 rounded-[32px] bg-white/[0.05] backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
          >
            {/* Image Section */}
            <div className="relative w-full h-[60%] shrink-0">
              <img src={card.url} alt={card.city} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] to-transparent pointer-events-none" />
            </div>

            {/* Liquid Glass Content Section */}
            <div className="relative flex-1 flex flex-col p-6 items-center justify-center bg-[#050B14]/80">
              <h2 className="text-white text-3xl font-extrabold tracking-tight drop-shadow-md text-center">{card.city}</h2>
              <div className="flex items-center gap-1.5 mt-2 mb-6">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <p className="text-white/70 font-bold text-[10px] tracking-[0.2em] uppercase">{card.country}</p>
              </div>
              
              <button 
                onPointerDown={(e) => e.stopPropagation()} // Let the user click without dragging
                onClick={() => onStart(card)}
                className="w-full py-3.5 rounded-[16px] bg-white/10 hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.2)] pointer-events-auto"
              >
                <Plane className="w-5 h-5" />
                Plan Trip Here
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Optional for desktop, but good for clarity) */}
        <button className="absolute left-[-20px] sm:left-[-40px] z-20 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-white transition-colors" onClick={() => paginate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="absolute right-[-20px] sm:right-[-40px] z-20 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-white transition-colors" onClick={() => paginate(1)}>
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
