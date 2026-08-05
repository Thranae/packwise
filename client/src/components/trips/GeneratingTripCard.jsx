import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Bot } from 'lucide-react';
import Spline from '@splinetool/react-spline';

export const GeneratingTripCard = ({ destination }) => (
  <motion.div 
    key="generating"
    initial={{ opacity: 0, scale: 0.98, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -20 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="relative w-full h-[460px] rounded-[32px] overflow-hidden transform-gpu will-change-transform group flex flex-col justify-between p-8"
  >
    {/* Ultra-Premium Liquid Glass Background */}
    <div className="absolute inset-0 bg-[#050B14]/40 backdrop-blur-[60px] backdrop-saturate-[250%]" />
    <div className="absolute inset-0 rounded-[32px] border-[1.5px] border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] pointer-events-none" />
    
    {/* Extremely Subtle Ambient Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
    <div className="absolute -inset-1/2 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 animate-[pulse_6s_ease-in-out_infinite] opacity-60 pointer-events-none" />

    {/* Top Header */}
    <div className="relative z-10 flex items-center justify-between w-full">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
        <Bot className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase">AI Architect</span>
      </div>
    </div>

    {/* Center Content: Minimalist Loading Indicator */}
    <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full gap-6 mt-4">
      
      {/* 3D Rocket */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-2">
        {/* Soft pulsing aura */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-[pulse_3s_ease-in-out_infinite]" />
        
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] z-10">
          <Compass className="w-10 h-10 text-white animate-[spin_4s_ease-in-out_infinite]" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-semibold text-white tracking-tight drop-shadow-md">
          {destination}
        </h3>
        
        <div className="flex items-center gap-2 mt-2">
          {/* Gentle blinking dots */}
          <span className="flex gap-[3px]">
            {[0, 1, 2].map((i) => (
              <span 
                key={i} 
                className="w-1 h-1 rounded-full bg-blue-400/80 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" 
                style={{ animationDelay: `${i * 0.2}s` }} 
              />
            ))}
          </span>
          <p className="text-[13px] text-white/50 font-medium tracking-wide">
            Crafting your perfect itinerary
          </p>
        </div>
      </div>
    </div>

    {/* Bottom Minimal Progress Bar */}
    <div className="relative z-10 w-full mt-auto mb-2">
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
        <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full w-full origin-left animate-[scale-x_7s_cubic-bezier(0.16,1,0.3,1)_forwards]" />
      </div>
    </div>

    <style>{`
      @keyframes scale-x {
        0% { transform: scaleX(0); }
        100% { transform: scaleX(1); }
      }
    `}</style>
  </motion.div>
);
