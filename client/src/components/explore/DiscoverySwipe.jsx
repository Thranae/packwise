import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { getTripImage } from '@/utils/imageUtils';

const DESTINATIONS = SLIDESHOW_IMAGES.map((img, index) => ({
  id: index,
  name: `${img.city}, ${img.country}`,
  image: getTripImage(img.city),
  description: `Experience the breathtaking beauty and culture of ${img.city}.`
}));

export function DiscoverySwipe({ onStart }) {
  const [cards, setCards] = useState(DESTINATIONS);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const handleNext = () => {
    setDirection(1);
    setCards((prev) => {
      const newArray = [...prev];
      const topCard = newArray.shift();
      newArray.push(topCard);
      return newArray;
    });
  };

  const handlePrev = () => {
    setDirection(-1);
    setCards((prev) => {
      const newArray = [...prev];
      const bottomCard = newArray.pop();
      newArray.unshift(bottomCard);
      return newArray;
    });
  };

  const visibleCards = cards.slice(0, 3);

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] perspective-1000 flex items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleCards.map((card, idx) => (
          <SwipeableCard
            key={card.id}
            card={card}
            idx={idx}
            direction={direction}
            onNext={handleNext}
            onPrev={handlePrev}
            onStart={onStart}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SwipeableCard({ card, idx, direction, onNext, onPrev, onStart }) {
  const isFront = idx === 0;
  
  // Physics & Gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-12, 12]);
  
  // Dynamic Light reflection simulation
  const lightOverlayX = useTransform(x, [-200, 200], ['100%', '-100%']);

  const handleDragEnd = (event, info) => {
    const threshold = 80;
    const velocityThreshold = 400;
    
    // Swipe Left -> Next Card
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onNext();
    } 
    // Swipe Right -> Previous Card (Undo)
    else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onPrev();
    }
  };

  const handleTap = (event) => {
    if (!isFront) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    
    // Click left 40% -> Previous
    if (clickX < rect.width * 0.4) {
      onPrev();
    } 
    // Click right 60% -> Next
    else {
      onNext();
    }
  };

  // Exit/Enter Animations
  const variants = {
    enter: ({ direction, idx }) => {
      if (direction === 1) {
        // Entering from the back (when user clicks Next, a new card appears at the bottom of the stack)
        return { opacity: 0, scale: 0.8, y: 60, zIndex: 0 };
      } else {
        // Entering from the front (when user clicks Prev, the previous card flies in from the left)
        return { opacity: 0, x: -400, rotate: -20, scale: 1.05, zIndex: 10 };
      }
    },
    exit: ({ direction, idx }) => {
      if (direction === 1) {
        // Exiting from the front (Top card thrown off to the left)
        return { 
          opacity: 0, 
          x: -400, 
          rotate: -20, 
          scale: 0.9, 
          zIndex: 10,
          transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.8 }
        };
      } else {
        // Exiting from the back (Bottom card fades out)
        return { opacity: 0, scale: 0.8, y: 60, zIndex: 0 };
      }
    }
  };

  return (
    <motion.div
      custom={{ direction, idx }}
      variants={variants}
      initial="enter"
      exit="exit"
      animate={{
        opacity: 1 - (idx * 0.15),
        scale: 1 - (idx * 0.05),
        y: idx * 24, // Stack them downwards
        x: 0,
        rotate: 0,
        zIndex: 3 - idx,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 350, 
        damping: 30, 
        mass: 0.8,
        opacity: { duration: 0.2 } 
      }}
      style={isFront ? { x, rotate } : {}}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      whileDrag={{ scale: 0.98, cursor: 'grabbing' }}
      className={`absolute top-0 w-full max-w-sm h-full rounded-[32px] overflow-hidden bg-slate-900 border border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.4)] transform-gpu ${isFront ? 'cursor-pointer touch-pan-y' : 'pointer-events-none'}`}
    >
      <img 
        src={card.image} 
        alt={card.name} 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Gradient fade at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      
      {/* Dynamic Light Catch Overlay (WOW Feature) */}
      {isFront && (
        <motion.div 
          style={{ x: lightOverlayX }}
          className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none mix-blend-overlay -left-[50%]"
        />
      )}

      {/* Text Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold uppercase tracking-widest">{card.name}</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">{card.name.split(',')[0]}</h3>
        <p className="text-white/80 text-sm sm:text-base font-medium drop-shadow-sm mb-4">{card.description}</p>
        
        {isFront && onStart && (
          <button 
            onPointerDown={(e) => e.stopPropagation()} // Prevent card drag/tap when clicking button
            onClick={() => onStart(card)}
            className="w-full py-4 rounded-[20px] bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all backdrop-blur-xl border border-white/20 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto"
          >
            <MapPin className="w-6 h-6" />
            Plan Trip Here
          </button>
        )}
      </div>
    </motion.div>
  );
}
