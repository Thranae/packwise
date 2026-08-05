import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { Bot, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AssistantIntro({ onStart }) {
  const [cards, setCards] = useState(SLIDESHOW_IMAGES);
  const [exitDirection, setExitDirection] = useState('right');

  // We only render top 3 to keep DOM light
  const activeCards = cards.slice(0, 3);

  const handleSwipe = (direction, cardData) => {
    setExitDirection(direction);
    // setTimeout allows React to batch the direction state change before unmounting,
    // though React 18 batches this automatically.
    if (direction === 'right') {
      // User swiped right to plan trip
      onStart(cardData);
    } else {
      // User swiped left to skip
      setCards(prev => [...prev.slice(1), prev[0]]); // Move top card to back
    }
  };

  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col bg-[#030712]">
      
      {/* Typography Section (Top) */}
      <div className="absolute top-[calc(6vh+var(--safe-top))] left-0 right-0 z-50 px-8 pointer-events-none flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline gap-2"
        >
          <span className="text-white text-4xl sm:text-5xl font-bold tracking-tighter drop-shadow-lg">
            Pack
          </span>
          <span 
            className="text-white text-5xl sm:text-6xl font-normal drop-shadow-xl -ml-2" 
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Wise.
          </span>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 text-sm font-medium tracking-wide mt-1 drop-shadow-lg"
        >
          Swipe to discover your next adventure
        </motion.p>
      </div>

      {/* Card Stack Container */}
      <div className="absolute inset-x-4 inset-y-[20vh] sm:inset-x-20 sm:inset-y-[15vh] z-10 perspective-[1000px]">
        <AnimatePresence custom={exitDirection}>
          {activeCards.map((card, index) => {
            const isTop = index === 0;
            return (
              <SwipeableCard 
                key={card.url} 
                card={card} 
                index={index}
                isTop={isTop}
                custom={exitDirection}
                onSwipe={(dir) => handleSwipe(dir, card)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Hints */}
      <div className="absolute bottom-[calc(4vh+var(--safe-bottom))] left-0 right-0 z-50 flex justify-between px-10 sm:px-24 pointer-events-none">
        <div className="flex flex-col items-center gap-2 opacity-80">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center text-white backdrop-blur-md shadow-lg">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-white/80 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Skip</span>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-80">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-green-400/50 bg-green-500/20 flex items-center justify-center text-green-300 backdrop-blur-md shadow-[0_0_15px_rgba(74,222,128,0.3)]">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-green-300 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Plan</span>
        </div>
      </div>
    </div>
  );
}

function SwipeableCard({ card, index, isTop, custom, onSwipe }) {
  const x = useMotionValue(0);
  // Map x to rotation (subtle)
  const rotate = useTransform(x, [-300, 300], [-8, 8]);
  // Map x to opacity (for "Like" vs "Nope" badges)
  const opacityRight = useTransform(x, [0, 150], [0, 1]);
  const opacityLeft = useTransform(x, [0, -150], [0, 1]);

  const scale = 1 - index * 0.04;
  const yOffset = index * 15;

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onSwipe('right');
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="absolute inset-0 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 origin-bottom"
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0,
        scale,
        y: yOffset,
        zIndex: 10 - index
      }}
      initial={{ opacity: 0, scale: 0.9, y: yOffset + 20 }}
      animate={{ opacity: 1, scale, y: yOffset }}
      custom={custom}
      exit={(direction) => ({
        opacity: 0,
        scale: 0.8,
        x: direction === 'right' ? 1000 : -1000,
      })}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      whileDrag={{ scale: 1.02 }}
    >
      <div 
        className="w-full h-full bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url("${card.url}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />
      
      {/* City/Country Label */}
      <div className="absolute bottom-8 left-6 right-6 sm:bottom-12 sm:left-10 sm:right-10 pointer-events-none flex flex-col items-start">
        <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-md">
          {card.city}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-white/80 font-bold text-xs sm:text-sm tracking-[0.2em] uppercase drop-shadow-md">
            {card.country}
          </p>
        </div>
      </div>

      {/* Removed Swipe Badges for cleaner look */}
    </motion.div>
  );
}
