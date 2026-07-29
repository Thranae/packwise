import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Star, Bot, Navigation, Clock, Heart, ArrowRight, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDestinationImage } from '@/hooks/useDestinationImage';
import { useTripContext } from '@/context/TripContext';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useAI } from '@/hooks/useAI';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useToast } from '@/hooks/useToast';

// Reusable styling constants for exact match to current glass
const GLASS_BASE = "bg-white/[0.02] border-0 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/10 before:absolute before:inset-0 before:rounded-[24px] before:border before:border-white/20 before:shadow-[inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1),inset_1px_0_2px_rgba(255,255,255,0.1),inset_-1px_0_2px_rgba(255,255,255,0.1)] before:pointer-events-none before:z-20";
const HOVER_EFFECTS = "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:ring-white/30";

const PlaceCard = ({ place, onSelect }) => {
  const { currentTrip } = useTripContext();
  
  // Extract just the city name to avoid the backend's comma truncation logic
  const rawDest = currentTrip?.destination || '';
  const cityOnly = rawDest.split(',')[0].trim();
  
  // Use AI-generated imageQuery for accuracy; fall back to "place name + city"
  const imageQuery = place.imageQuery || `${place.name} ${cityOnly}`;
  const { image, loading } = useDestinationImage(imageQuery, 'explore');
  const displayImage = image || place.image;

  return (
    <motion.div
      onClick={() => onSelect(place)}
      className={`group relative min-w-[85%] sm:min-w-[calc(50%-8px)] md:min-w-[300px] h-[260px] sm:h-[320px] rounded-[24px] overflow-hidden cursor-pointer transform-gpu isolate [backface-visibility:hidden] antialiased snap-start shrink-0 ${GLASS_BASE} ${HOVER_EFFECTS}`}
    >
      {loading ? (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          style={{ backgroundImage: `url("${displayImage || ''}")` }}
        />
      )}
      
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-[52px] group-hover:translate-y-0">
        
        <div className="flex flex-col gap-2 min-h-[52px] justify-start shrink-0">
          <div className="flex items-center justify-between z-10 [transform-style:preserve-3d]">
            <div className="ios-liquid-button px-3 py-1 rounded-full flex items-center justify-center shadow-md group">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateZ(12px)]">
                {place.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 drop-shadow-[0_2px_4px_rgba(255,180,0,0.6)]">
              <Star className="w-3.5 h-3.5 fill-current [filter:drop-shadow(0px_1px_1px_rgba(255,255,255,0.5))]" />
              <span className="text-xs font-bold text-white tracking-wide">{place.rating}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2 leading-tight">{place.name}</h3>
        </div>

        <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
          <p className="text-xs font-medium text-white/80 line-clamp-2 leading-relaxed">
            {place.desc}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400/30 to-blue-600/10 border border-blue-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md">
                  <Navigation className="w-3 h-3 text-blue-300 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.5))]" />
                </div>
                <span className="text-[11px] font-bold drop-shadow-md">{place.distance}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-emerald-600/10 border border-emerald-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md">
                  <Clock className="w-3 h-3 text-emerald-300 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.5))]" />
                </div>
                <span className="text-[11px] font-bold drop-shadow-md">{place.time}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[14px] ios-liquid-button text-white group/btn">
              <span className="text-xs font-bold drop-shadow-md z-10">Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover/btn:text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))] transition-colors z-10" />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); /* Optional: handle quick save here */ }} 
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-[14px] ios-liquid-button text-white group/heart"
            >
              <Heart className="w-4 h-4 text-white/80 group-hover/heart:text-rose-400 group-hover/heart:fill-rose-400/50 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))] transition-colors z-10" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PlaceCardSkeleton = () => (
  <div className={`relative min-w-[85%] sm:min-w-[calc(50%-8px)] md:min-w-[300px] h-[260px] sm:h-[320px] rounded-[24px] overflow-hidden shrink-0 snap-start ${GLASS_BASE}`}>
    <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />
    <motion.div 
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
    />
    <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end gap-3">
      <div className="flex items-center justify-between">
        <div className="w-20 h-5 rounded-full bg-white/10 animate-pulse" />
        <div className="w-10 h-5 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="w-3/4 h-6 rounded-lg bg-white/10 animate-pulse mt-1" />
    </div>
  </div>
);

const PlaceModal = ({ place, onClose }) => {
  const { currentTrip } = useTripContext();
  const { playSound } = useSoundEffect();
  const { addToast } = useToast();
  const imageQuery = place.imageQuery || `${place.name} ${currentTrip?.destination || ''}`;
  const { image, loading } = useDestinationImage(imageQuery, 'explore');
  const displayImage = image || place.image;

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden [perspective:2000px]">
      {/* Blurred Frosted Glass Backdrop */}
      <motion.div 
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-white/[0.02] saturate-150"
        onClick={onClose}
      >
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </motion.div>
      
      {/* 3D Modal Glow Behind */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-[80vw] max-w-4xl h-[60vh] bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-emerald-500/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-2xl overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-[0_64px_128px_rgba(0,0,0,0.6),0_16px_32px_rgba(0,0,0,0.4)] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-3xl ring-1 ring-white/10 isolate`}
      >
        <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1),inset_1px_0_2px_rgba(255,255,255,0.1),inset_-1px_0_2px_rgba(255,255,255,0.1)] pointer-events-none z-20" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all text-white/80 hover:text-white hover:scale-105 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
          {/* Image Section */}
          <div className="relative w-full md:w-2/5 h-[240px] md:h-auto shrink-0 overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            ) : (
              <img src={displayImage} alt={place.name} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/20 md:to-black/80 pointer-events-none" />
            
            {/* Top Left Badge */}
            <div className="absolute top-4 left-4 z-10 [transform-style:preserve-3d]">
              <div className="ios-liquid-button px-4 py-1.5 rounded-full flex items-center justify-center shadow-md group">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateZ(12px)]">
                  {place.category}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-center overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-1 text-yellow-400 drop-shadow-md mb-2">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold text-white tracking-wide">{place.rating}</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-4 tracking-tight leading-tight">{place.name}</h2>
            
            <p className="text-sm font-medium text-white/80 leading-relaxed mb-8">
              {place.desc}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/5 border border-blue-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Navigation className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Distance</div>
                  <div className="text-sm font-bold text-white drop-shadow-md">{place.distance}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/5 border border-emerald-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Clock className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Travel Time</div>
                  <div className="text-sm font-bold text-white drop-shadow-md">{place.time}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedPlace.name + ' ' + selectedPlace.vicinity)}`, '_blank')} className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl ios-liquid-button text-white group hover:!bg-gradient-to-br hover:from-sky-400 hover:to-blue-600 hover:shadow-[0_20px_40px_rgba(14,165,233,0.5),inset_0_2px_6px_rgba(255,255,255,0.6)] hover:-translate-y-2 hover:scale-[1.04] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-bold drop-shadow-md">Get Directions</span>
              </button>
              <button onClick={() => { playSound('tap'); addToast('success', `${selectedPlace.name} saved!`); }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl ios-liquid-button text-white group/heart">
                <Heart className="w-4 h-4 group-hover/heart:text-rose-400 group-hover/heart:fill-rose-400/50 transition-colors" />
                <span className="text-sm font-bold drop-shadow-md group-hover/heart:text-rose-100">Save</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ExploreNearbyWidget = ({ className = "" }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { currentTrip } = useTripContext();
  const { getRecommendations, loading } = useAI();
  const [places, setPlaces] = useState([]);
  
  const cardRef = useRef(null);
  const scrollRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 2, stiffness: 200, damping: 30 });

  const filters = ["All", "Attractions", "Food", "Nature", "Shopping", "Entertainment", "Nightlife", "Art"];

  useEffect(() => {
    if (currentTrip?.destination) {
      const categoryToFetch = activeFilter === "All" ? "Attractions" : activeFilter;
      // Force refresh=true here so changing filters or initially loading always fetches fresh unique AI data
      getRecommendations(currentTrip.destination, categoryToFetch, true).then(res => {
        const data = res?.data || res;
        if (Array.isArray(data)) setPlaces(data);
        if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      });
    }
  }, [currentTrip?.destination, activeFilter]);

  // Auto-scroll slideshow every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !loading && places.length > 0) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If we've reached the end, loop back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [loading, places.length]);

  const handleRefresh = () => {
    if (currentTrip?.destination && !loading) {
      const categoryToFetch = activeFilter === "All" ? "Attractions" : activeFilter;
      getRecommendations(currentTrip.destination, categoryToFetch, true).then(res => {
        const data = res?.data || res;
        if (Array.isArray(data)) setPlaces(data);
        if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`relative p-6 flex flex-col h-[520px] rounded-[32px] overflow-hidden ios-glass-card shadow-[0_24px_48px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] [transform-style:preserve-3d] ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 shrink-0 mb-4 [transform:translateZ(30px)]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Discover</span>
            <span className="text-2xl font-semibold tracking-tighter text-white drop-shadow-sm">Explore Nearby</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2 bg-white/5 rounded-full p-1 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <button onClick={scrollLeft} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={scrollRight} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[12px] ios-liquid-button cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bot className={`w-3.5 h-3.5 text-blue-300 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.5))_drop-shadow(0_-1px_1px_rgba(255,255,255,0.2))] transition-transform duration-500 ${loading ? 'animate-bounce' : 'group-hover:rotate-12 group-hover:scale-110'}`} />
              <span className="text-[11px] font-bold text-blue-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {loading ? 'Thinking...' : 'AI Recommends'}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-4 px-1 -mx-1 scrollbar-none relative z-20" style={{ scrollbarWidth: 'none' }}>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`ios-liquid-button shrink-0 whitespace-nowrap px-4 py-2 rounded-[14px] text-[13px] font-medium shadow-md transition-all duration-300 relative outline-none
                ${activeFilter === filter 
                  ? 'text-white' 
                  : 'text-white/70 border border-transparent hover:text-white hover:border-white/20'
                }
              `}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {activeFilter === filter && (
                <motion.div
                  layoutId="exploreFilterActive"
                  className="absolute inset-0 rounded-[14px] bg-white/10 ring-1 ring-white/20 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] border border-white/40 pointer-events-none"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{filter}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scrolling Carousel */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden flex gap-4 pb-8 pt-2 -mx-2 px-2 scrollbar-none snap-x snap-mandatory relative [transform:translateZ(20px)]" 
        style={{ scrollbarWidth: 'none' }}
      >
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <AnimatePresence mode="popLayout">
            {places.map(place => (
              <PlaceCard key={place.id || place.name} place={place} onSelect={setSelectedPlace} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Expanded Modal Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedPlace && (
            <PlaceModal 
              place={selectedPlace} 
              onClose={() => setSelectedPlace(null)} 
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};
