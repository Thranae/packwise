import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Clock, CloudSun, CloudRain, DollarSign, Wallet, Box, Sparkles, BoxSelect, Map, Calculator, FileDown, Download, Share2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import { useLiveWeather, useLiveCurrency } from '@/hooks/useLiveApis';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const CommandCenterWidget = ({ className = "" }) => {
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 250, damping: 25 });
  const { playSound } = useSoundEffect();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const { currentTrip, addNotification } = useTripContext();
  const dest = currentTrip?.destination?.split('&')[0];
  const { weather } = useLiveWeather(dest);
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
      } else {
        setLocalTime('--:--');
      }
    };
    
    updateTime(); // Initial update
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [currentTrip?.timezone]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExportStory = async (e) => {
    e.stopPropagation();
    playSound('tap');
    setIsExporting(true);
    addToast('info', 'Generating Story Image...');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('story-export-template');
      if (element) {
        // html2canvas needs the element to be somewhat in flow, but we can't show it.
        const canvas = await html2canvas(element, { 
          scale: 1, 
          useCORS: true, 
          logging: false,
          backgroundColor: null,
          windowWidth: 1080,
          windowHeight: 1920
        });
        const imgData = canvas.toDataURL('image/png');
        
        try {
          if (navigator.share) {
            const blob = await (await fetch(imgData)).blob();
            const file = new File([blob], `${dest || 'Trip'}-Story.png`, { type: 'image/png' });
            await navigator.share({
              title: `${dest || 'Trip'} Story`,
              files: [file]
            });
            addToast('success', 'Story shared successfully!');
          } else {
            const link = document.createElement('a');
            link.download = `${dest || 'Trip'}-Story.png`;
            link.href = imgData;
            link.click();
            addToast('success', 'Story downloaded!');
          }
        } catch (shareErr) {
          // Fallback if share is canceled or fails
          console.warn(shareErr);
        }
        
        addNotification('Story Exported', `Your 9:16 story for ${dest || 'your trip'} is ready to share.`, 'pdf');
      }
    } catch (err) {
      console.error("Export failed:", err);
      addToast('error', 'Failed to generate story.');
    } finally {
      setIsExporting(false);
    }
  };

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

      {/* Hidden 9:16 Export Template */}
      <div 
        id="story-export-template" 
        className="fixed top-[-9999px] left-[-9999px] w-[1080px] h-[1920px] bg-gradient-to-br from-slate-900 via-[#030712] to-blue-950 flex flex-col items-center justify-between p-24 font-sans"
        style={{ zIndex: -100 }}
      >
        <div className="flex flex-col items-center gap-8 mt-12 w-full">
          <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
            <MapPin className="w-20 h-20 text-blue-400" />
          </div>
          <h1 className="text-[120px] font-black text-white tracking-tighter text-center leading-tight drop-shadow-2xl capitalize">
            {dest || "My Trip"}
          </h1>
          <p className="text-4xl text-white/50 font-semibold tracking-widest uppercase mt-4">
            Voyage Genie
          </p>
        </div>

        <div className="flex flex-col gap-16 w-full px-12">
          {/* Weather Card */}
          <div className="w-full bg-white/5 border border-white/10 rounded-[64px] p-16 flex items-center justify-between shadow-2xl">
            <div className="flex flex-col">
              <span className="text-3xl text-white/40 font-bold uppercase tracking-widest mb-4">Live Weather</span>
              <span className="text-[100px] text-white font-black tracking-tighter">{weather?.current?.temp ?? '--'}°</span>
              <span className="text-4xl text-blue-300 font-semibold uppercase tracking-wider capitalize">{weather?.current?.condition || 'Clear'}</span>
            </div>
            <CloudRain className="w-48 h-48 text-blue-400 opacity-80" />
          </div>

          {/* Budget Card */}
          <div className="w-full bg-white/5 border border-white/10 rounded-[64px] p-16 flex items-center justify-between shadow-2xl">
            <div className="flex flex-col">
              <span className="text-3xl text-white/40 font-bold uppercase tracking-widest mb-4">Travel Budget</span>
              <div className="flex items-baseline gap-4">
                <span className="text-[100px] text-white font-black tracking-tighter">{currentTrip?.budget || 0}</span>
                <span className="text-5xl text-blue-300 font-bold uppercase">{targetCurrency}</span>
              </div>
            </div>
            <Download className="w-48 h-48 text-emerald-400 opacity-80" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mb-24">
          <div className="flex gap-4">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <div className="w-4 h-4 rounded-full bg-emerald-500" />
          </div>
          <span className="text-3xl font-bold tracking-[0.3em] text-white/30 uppercase">Ready For Takeoff</span>
        </div>
      </div>

      {/* Bottom Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mt-auto ios-3d-element">
        <button onClick={() => { playSound('tap'); navigate(ROUTES.PACKING); }} className="flex items-center justify-center gap-1.5 py-2 rounded-[16px] ios-liquid-button group">
          <BoxSelect className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          <span className="text-[11px] font-bold text-white/80 group-hover:text-white tracking-wide">Pack</span>
        </button>
        <button onClick={() => { playSound('tap'); navigate(ROUTES.BUDGET); }} className="flex items-center justify-center gap-1.5 py-2 rounded-[16px] ios-liquid-button group">
          <Calculator className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          <span className="text-[11px] font-bold text-white/80 group-hover:text-white tracking-wide">Budget</span>
        </button>
        <button onClick={() => { playSound('tap'); navigate(ROUTES.CALENDAR); }} className="flex items-center justify-center gap-1.5 py-2 rounded-[16px] ios-liquid-button group border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/30 transition-colors">
          <Map className="w-3.5 h-3.5 text-purple-400 group-hover:text-white" />
          <span className="text-[11px] font-bold text-purple-300 group-hover:text-white tracking-wide">Itinerary / Calendar</span>
        </button>
        <button onClick={handleExportStory} disabled={isExporting} className="flex items-center justify-center gap-1.5 py-2 rounded-[16px] ios-liquid-button group bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 transition-colors">
          {isExporting ? <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" /> : <Download className="w-3.5 h-3.5 text-blue-400 group-hover:text-white transition-colors" />}
          <span className="text-[11px] font-bold text-blue-300 group-hover:text-white tracking-wide">{isExporting ? 'Exporting...' : 'Export Story'}</span>
        </button>
      </div>
    </motion.div>
  );
};
