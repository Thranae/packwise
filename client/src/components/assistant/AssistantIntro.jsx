import React from 'react';
import { SLIDESHOW_IMAGES } from '@/constants/slideshowImages';
import { Plane, MapPin, X } from 'lucide-react';

const dests = SLIDESHOW_IMAGES;

export default function AssistantIntro({ onStart, onClose }) {
  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#03060C]">
      
      {/* Static Ambient Background to prevent GPU glitching */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-slate-900/50 via-[#03060C]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Top Navigation / Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-[calc(2vh+var(--safe-top))] right-4 sm:right-8 z-[70] p-3 rounded-full bg-red-500/80 hover:bg-red-500 active:scale-95 transition-all backdrop-blur-xl border border-red-400/30 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(239,68,68,0.4)]"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Top Typography */}
      <div className="absolute top-[calc(6vh+var(--safe-top))] left-0 right-0 z-50 px-8 pointer-events-none flex flex-col items-center drop-shadow-2xl">
        <div className="flex items-baseline gap-2 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="text-white text-4xl sm:text-5xl font-extrabold tracking-tighter drop-shadow-2xl font-['Outfit']">Pack</span>
          <span className="text-blue-400 text-5xl sm:text-6xl font-normal -ml-2 drop-shadow-2xl" style={{ fontFamily: "'Pacifico', cursive" }}>Wise.</span>
        </div>
        <p className="text-white/60 text-xs sm:text-sm font-bold tracking-wide mt-2 animate-in fade-in duration-1000 delay-300">
          Swipe to discover destinations
        </p>
      </div>

      {/* Clean Liquid Glass Slider Container - Native Scroll Snap */}
      <div className="relative w-full h-[75vh] mt-[15vh] z-10 flex items-center pb-[2vh]">
        <div 
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory gap-4 px-[4vw] sm:px-[calc(50vw-200px)] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dests.map((card, index) => (
            <div
              key={index}
              className="relative shrink-0 w-[92vw] max-w-[400px] h-full snap-center rounded-[32px] bg-white/[0.05] backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden flex flex-col"
            >
              {/* Image Section - Bright without dimming overlay */}
              <div className="relative w-full flex-1 shrink-0">
                <img src={card.url} alt={card.city} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              </div>

              {/* Liquid Glass Content Section */}
              <div className="relative shrink-0 flex flex-col p-6 items-center justify-center bg-[#0A101C]/80 backdrop-blur-2xl border-t border-white/5">
                <h2 className="text-white text-3xl font-extrabold tracking-tight drop-shadow-md text-center">{card.city}</h2>
                <div className="flex items-center gap-1.5 mt-2 mb-6">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <p className="text-white/70 font-bold text-[10px] tracking-[0.2em] uppercase">{card.country}</p>
                </div>
                
                <button 
                  onClick={() => onStart(card)}
                  className="w-full py-4 rounded-[16px] bg-white hover:bg-white/90 active:scale-95 transition-all text-[#050B14] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(255,255,255,0.15)]"
                >
                  <Plane className="w-5 h-5" />
                  Plan Trip Here
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
