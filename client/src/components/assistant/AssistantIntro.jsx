import React from 'react';
import { motion } from 'framer-motion';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { Bot, MapPin } from 'lucide-react';

export default function AssistantIntro({ onStart }) {
  // We can render more cards now because native CSS scroll is extremely performant
  const cards = SLIDESHOW_IMAGES.slice(0, 15);

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
          Swipe horizontally to explore
        </motion.p>
      </div>

      {/* Native Scroll-Snap Carousel Container */}
      <div className="absolute inset-x-0 inset-y-[20vh] sm:inset-y-[15vh] z-10 flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Spacer for first card to center slightly */}
        <div className="w-6 sm:w-20 shrink-0" />
        
        {cards.map((card, index) => (
          <div 
            key={card.url + index} 
            className="w-[82vw] sm:w-[60vw] max-w-[400px] shrink-0 snap-center mr-4 sm:mr-8 relative rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl bg-[#030712] flex flex-col justify-end border border-white/10"
            style={{ transform: 'translateZ(0)' }} // Force GPU hardware layer for each card
          >
            <img 
              src={card.url}
              alt={card.city}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              loading={index < 3 ? "eager" : "lazy"}
              draggable={false}
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/90 pointer-events-none" />
            
            {/* Card Content */}
            <div className="relative z-10 p-6 sm:p-10 flex flex-col items-start w-full">
              <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-md">
                {card.city}
              </h2>
              <div className="flex items-center gap-2 mt-2 mb-6">
                <MapPin className="w-3.5 h-3.5 text-green-400" />
                <p className="text-white/90 font-bold text-xs sm:text-sm tracking-[0.2em] uppercase drop-shadow-md">
                  {card.country}
                </p>
              </div>
              
              <button 
                onClick={() => onStart(card)}
                className="w-full py-4 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-[0.98] transition-all backdrop-blur-md border border-white/30 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Bot className="w-5 h-5" />
                Plan Trip Here
              </button>
            </div>
          </div>
        ))}
        
        {/* Spacer for last card */}
        <div className="w-2 sm:w-16 shrink-0" />
      </div>

    </div>
  );
}

