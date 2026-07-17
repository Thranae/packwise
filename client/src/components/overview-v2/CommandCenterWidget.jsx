import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Clock, CloudSun, DollarSign, Wallet, Box, Sparkles, BoxSelect, Map, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import { useLiveWeather, useLiveCurrency } from '@/hooks/useLiveApis';

export const CommandCenterWidget = ({ className = "" }) => {
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 250, damping: 25 });
  
  const { currentTrip } = useTripContext();
  const { weather } = useLiveWeather(currentTrip?.destination);
  const targetCurrency = currentTrip?.currency || 'EUR';
  const { exchangeRate } = useLiveCurrency(targetCurrency, 'INR');
  
  const getDuration = (start, end) => {
    if (!start || !end) return 1;
    const diff = new Date(end) - new Date(start);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  
  const duration = currentTrip ? getDuration(currentTrip.startDate, currentTrip.endDate) : 1;
  const dailyBudget = currentTrip ? Math.round(currentTrip.budget / duration) : 0;
  
  const [localTime, setLocalTime] = useState('--:--');
  
  useEffect(() => {
    const updateTime = () => {
      if (currentTrip?.timezone) {
        try {
          const timeString = new Date().toLocaleTimeString('en-US', { 
            timeZone: currentTrip.timezone, 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          setLocalTime(timeString);
        } catch (e) {
          setLocalTime('--:--');
        }
      }
    };
    
    updateTime(); // Initial update
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [currentTrip?.timezone]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`relative p-5 flex flex-col justify-between h-[416px] rounded-[32px] overflow-hidden ios-glass-card group cursor-pointer ${className}`}
    >
      {/* Header: Destination & Countdown */}
      <div className="flex items-start justify-between ios-3d-element">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">Command Center</span>
          </div>
          <span className="text-xl font-semibold tracking-tighter text-white drop-shadow-sm truncate">{currentTrip?.destination || 'Select Trip'}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-0.5">Departs</span>
          <span className="text-xl font-semibold tracking-tighter text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] truncate">
            {currentTrip?.startDate ? (() => {
              const diff = new Date(currentTrip.startDate) - new Date();
              const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
              return days > 0 ? `In ${days} Days` : 'Started';
            })() : '--'}
          </span>
        </div>
      </div>

      {/* 6 Metrics in a dense 2x3 Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4 mb-4 flex-1 ios-3d-element">
        
        {/* Local Time */}
        <div className="flex items-center gap-2.5 p-2 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors group cursor-default">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors shrink-0">
            <Clock className="w-3.5 h-3.5 text-white/70 group-hover:text-blue-400" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Local Time</span>
            <span className="text-xs font-bold text-white">{localTime}</span>
          </div>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-2.5 p-2 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors group cursor-default">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-colors shrink-0">
            <CloudSun className="w-3.5 h-3.5 text-white/70 group-hover:text-yellow-400" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Weather</span>
            <span className="text-xs font-bold text-white">{weather?.current?.temp ?? '--'}° {weather?.current?.condition ?? 'Loading'}</span>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="flex items-center gap-2.5 p-2 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors group cursor-default">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors shrink-0">
            <DollarSign className="w-3.5 h-3.5 text-white/70 group-hover:text-emerald-400" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Exchange</span>
            <span className="text-xs font-bold text-white">1 INR = {exchangeRate ?? '--'}</span>
          </div>
        </div>

        {/* Daily Budget */}
        <div className="flex items-center gap-2.5 p-2 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors group cursor-default">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors shrink-0">
            <Wallet className="w-3.5 h-3.5 text-white/70 group-hover:text-blue-400" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Est Today</span>
            <span className="text-xs font-bold text-white">{dailyBudget} {currentTrip?.currency}</span>
          </div>
        </div>

        {/* Packing */}
        <div className="flex items-center gap-2.5 p-2 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors group cursor-default">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-colors shrink-0">
            <Box className="w-3.5 h-3.5 text-white/70 group-hover:text-orange-400" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Packed</span>
            <span className="text-xs font-bold text-white">0%</span>
          </div>
        </div>

        {/* Readiness */}
        <div className="flex items-center gap-2.5 p-2 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors group cursor-default">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white/70 group-hover:text-purple-400" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Readiness</span>
            <span className="text-xs font-bold text-purple-400">100%</span>
          </div>
        </div>
        
      </div>

      {/* Bottom Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mt-auto ios-3d-element">
        <button className="flex items-center justify-center gap-1.5 py-2 rounded-[16px] ios-liquid-button group">
          <BoxSelect className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          <span className="text-[11px] font-bold text-white/80 group-hover:text-white tracking-wide">Pack</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 rounded-[16px] ios-liquid-button group">
          <Calculator className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          <span className="text-[11px] font-bold text-white/80 group-hover:text-white tracking-wide">Budget</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 rounded-[16px] ios-liquid-button group">
          <Map className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          <span className="text-[11px] font-bold text-white/80 group-hover:text-white tracking-wide">Plan</span>
        </button>
      </div>
    </motion.div>
  );
};
