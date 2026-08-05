import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { Bot, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AssistantIntro({ onStart }) {
  const [cards, setCards] = useState(SLIDESHOW_IMAGES);

  // We only render top 3 to keep DOM light
  const activeCards = cards.slice(0, 3);

  const handleSwipe = (direction, cardData) => {
    if (direction === 'right') {
      onStart(cardData);
    } else {
      setCards(prev => [...prev.slice(1), prev[0]]); 
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
          <span className="text-white text-4xl sm:text-5xl font-bold tracking-tighter">
            Pack
          </span>
          <span 
            className="text-white text-5xl sm:text-6xl font-normal -ml-2" 
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Wise.
          </span>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 text-sm font-medium tracking-wide mt-1"
        >
          Swipe to discover your next adventure
        </motion.p>
      </div>

      {/* Card Stack Container */}
      <div className="absolute inset-x-4 inset-y-[20vh] sm:inset-x-20 sm:inset-y-[15vh] z-10 perspective-[1000px]">
        {activeCards.map((card, index) => {
          const isTop = index === 0;
          return (
            <SwipeableCard 
              key={card.url} 
              card={card} 
              index={index}
              isTop={isTop}
              onSwipe={(dir) => handleSwipe(dir, card)}
            />
          );
        })}
      </div>

      {/* Footer Hints */}
      <div className="absolute bottom-[calc(4vh+var(--safe-bottom))] left-0 right-0 z-50 flex justify-between px-10 sm:px-24 pointer-events-none">
        <div className="flex flex-col items-center gap-2 opacity-80">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-[#1e293b]/90 flex items-center justify-center text-white shadow-lg">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-white/80 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Skip</span>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-80">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-green-400/50 bg-[#064e3b]/90 flex items-center justify-center text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.3)]">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-green-300 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Plan</span>
        </div>
      </div>
    </div>
  );
}

function SwipeableCard({ card, index, isTop, onSwipe }) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Map x to rotation (subtle)
  const rotate = useTransform(x, [-300, 300], [-8, 8]);
  const opacityRight = useTransform(x, [0, 150], [0, 1]);
  const opacityLeft = useTransform(x, [0, -150], [0, 1]);

  React.useEffect(() => {
    // Instantly reset X if it's not the top card, so it doesn't visibly fly back from off-screen!
    if (index > 0) {
      x.set(0);
    }
    
    // When index changes, animate smoothly to new position in stack
    controls.start({
      opacity: 1,
      scale: 1 - index * 0.04,
      y: index * 15,
      transition: { type: 'spring', stiffness: 300, damping: 25, mass: 1 }
    });
  }, [index, controls, x]);

  const handleDragEnd = async (event, info) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      await controls.start({ x: window.innerWidth, transition: { duration: 0.2, ease: 'easeOut' } });
      onSwipe('right');
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      await controls.start({ x: -window.innerWidth, transition: { duration: 0.2, ease: 'easeOut' } });
      onSwipe('left');
    } else {
      // Didn't swipe far enough, snap back to center
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl origin-bottom bg-[#030712]"
      style={{ 
        x, 
        rotate: isTop ? rotate : 0,
        zIndex: 10 - index,
        willChange: 'transform'
      }}
      initial={{ opacity: 0, scale: 0.9, y: index * 15 + 20 }}
      animate={controls}
      drag="x"
      dragListener={isTop}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      whileDrag={{ scale: 1.02 }}
    >
      <img 
        src={card.url}
        alt={card.city}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />
      
      {/* City/Country Label */}
      <div className="absolute bottom-8 left-6 right-6 sm:bottom-12 sm:left-10 sm:right-10 pointer-events-none flex flex-col items-start z-10">
        <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-tight">
          {card.city}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-white/80 font-bold text-xs sm:text-sm tracking-[0.2em] uppercase">
            {card.country}
          </p>
        </div>
      </div>

      {/* Right Swipe (Green Light) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none rounded-[32px] sm:rounded-[40px]"
        style={{ 
          opacity: opacityRight,
          background: 'radial-gradient(circle at right center, rgba(74,222,128,0.4) 0%, transparent 60%)'
        }}
      />

      {/* Left Swipe (Red Beam) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none rounded-[32px] sm:rounded-[40px]"
        style={{ 
          opacity: opacityLeft,
          background: 'radial-gradient(circle at left center, rgba(239,68,68,0.4) 0%, transparent 60%)'
        }}
      />
    </motion.div>
  );
}
