import React from 'react';
import { motion } from 'framer-motion';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { Plane, MapPin } from 'lucide-react';

export default function AssistantIntro({ onStart }) {
  // We can render more cards now because native CSS scroll is extremely performant
  const cards = SLIDESHOW_IMAGES.slice(0, 15);

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
          Swipe horizontally to explore
        </motion.p>
      </div>

      {/* Native Scroll-Snap Carousel Container (FULL SCREEN) */}
      <div className="absolute inset-0 z-10 flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {cards.map((card, index) => (
          <div 
            key={card.url + index} 
            className="w-screen h-screen shrink-0 snap-center relative bg-[#030712] flex flex-col justify-end"
            style={{ transform: 'translateZ(0)' }} // Force GPU hardware layer for each card
          >
            <img 
              src={card.url}
              alt={card.city}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              loading={index < 3 ? "eager" : "lazy"}
              draggable={false}
            />
            {/* Gradient Overlay for Text Readability - Darker at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/90 pointer-events-none" />
            
            {/* Card Content (Bottom) */}
            <div className="relative z-10 p-8 sm:p-12 mb-[calc(2vh+var(--safe-bottom))] flex flex-col items-start w-full">
              <h2 className="text-white text-5xl sm:text-7xl font-extrabold tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                {card.city}
              </h2>
              <div className="flex items-center gap-2 mt-3 mb-8">
                <MapPin className="w-4 h-4 text-green-400 drop-shadow-lg" />
                <p className="text-white/90 font-bold text-sm sm:text-base tracking-[0.2em] uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {card.country}
                </p>
              </div>
              
              <button 
                onClick={() => onStart(card)}
                className="w-full py-5 rounded-[20px] bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all backdrop-blur-xl border border-white/20 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                <Plane className="w-6 h-6" />
                Plan Trip Here
              </button>
            </div>
          </div>
        ))}
        
      </div>

    </div>
  );
}

