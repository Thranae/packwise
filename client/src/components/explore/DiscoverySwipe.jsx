import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const DESTINATIONS = [
  {
    id: 1,
    name: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
    description: 'Ancient temples, bamboo forests, and traditional tea houses.'
  },
  {
    id: 2,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
    description: 'White-washed buildings and stunning sunsets over the Aegean.'
  },
  {
    id: 3,
    name: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop',
    description: 'Majestic peaks, crystal clear lakes, and alpine villages.'
  },
  {
    id: 4,
    name: 'Banff, Canada',
    image: 'https://images.unsplash.com/photo-1544415893-6c0c29a8a619?q=80&w=1000&auto=format&fit=crop',
    description: 'Turquoise glacial lakes and towering rocky mountains.'
  }
];

export function DiscoverySwipe({ onSwipeRight }) {
  const [cards, setCards] = useState(DESTINATIONS);

  const removeCard = (id, direction) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    
    // Trigger Heavy Haptic for Swipe Right
    if (direction === 'right') {
      try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch (e) {}
      
      const swipedCard = cards.find(c => c.id === id);
      if (onSwipeRight && swipedCard) {
        onSwipeRight(swipedCard.name);
      }
    } else {
      try { Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    }
  };

  if (cards.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-white/5 rounded-[32px] border border-white/10">
        <Sparkles className="w-8 h-8 text-white/30 mb-4" />
        <p className="text-white/50">You've swiped through all destinations!</p>
        <button 
          onClick={() => setCards(DESTINATIONS)}
          className="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition"
        >
          Reset Deck
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] perspective-1000">
      <AnimatePresence>
        {cards.map((card, index) => {
          const isFront = index === 0;
          return (
            <SwipeableCard 
              key={card.id}
              card={card}
              isFront={isFront}
              index={index}
              onRemove={removeCard}
            />
          );
        }).reverse()}
      </AnimatePresence>
    </div>
  );
}

function SwipeableCard({ card, isFront, index, onRemove }) {
  const x = useMotionValue(0);
  
  // As the card moves left/right, it rotates
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  // Fade out as it gets to the edges
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Background overlay colors for feedback (Green for right, Red for left)
  const overlayBackground = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(239, 68, 68, 0.4)', 'rgba(0, 0, 0, 0)', 'rgba(16, 185, 129, 0.4)']
  );

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onRemove(card.id, 'right');
    } else if (info.offset.x < -threshold) {
      onRemove(card.id, 'left');
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        zIndex: 100 - index,
        // Stack the cards visually
        top: index * 10,
        scale: 1 - index * 0.05,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      className="absolute top-0 w-full h-full rounded-[32px] overflow-hidden bg-slate-900 border border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.5)] touch-pan-y cursor-grab transform-gpu"
    >
      <img 
        src={card.image} 
        alt={card.name} 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Gradient fade at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      
      {/* Dynamic Colored Overlay based on swipe direction */}
      <motion.div 
        style={{ backgroundColor: overlayBackground }}
        className="absolute inset-0 pointer-events-none transition-colors duration-100"
      />

      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 pointer-events-none">
        <div className="flex items-center gap-2 mb-2 text-white/80">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium uppercase tracking-wider">{card.name}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-light text-white mb-2">{card.name.split(',')[0]}</h3>
        <p className="text-white/60 text-sm">{card.description}</p>
      </div>

      {/* Swipe Indicators */}
      <motion.div 
        style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        className="absolute top-8 left-8 w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 transform -rotate-12 pointer-events-none"
      >
        <Heart className="w-6 h-6 fill-emerald-500" />
      </motion.div>
      <motion.div 
        style={{ opacity: useTransform(x, [0, -100], [0, 1]) }}
        className="absolute top-8 right-8 w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 transform rotate-12 pointer-events-none"
      >
        <X className="w-6 h-6" />
      </motion.div>
    </motion.div>
  );
}
