import React, { useState, useMemo, useDeferredValue, useEffect } from 'react';
import { Plus, Search, Map, Compass, Globe, MapPin, Loader2, Sparkles, Plane, Home, Wallet, CloudSun, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';
import { ROUTES } from '@/constants/routes';
import { TripCard } from '@/components/trips/TripCard';
import { useTripContext } from '@/context/TripContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useRoutePreload } from '@/hooks/useRoutePreload';
import { Skeleton } from '@/components/ui/Skeleton';

const GeneratingTripCard = ({ destination }) => (
  <motion.div 
    key="generating"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="relative w-full h-[460px] rounded-[32px] overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.6)] ios-glass-card flex flex-col justify-center items-center p-8 group transform-gpu will-change-transform"
  >
    {/* Dynamic Background Effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 mix-blend-overlay animate-[pulse_4s_ease-in-out_infinite]" />
    <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.0)_50%)] bg-[length:200%_100%] animate-[shimmer_3s_infinite_linear]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

    {/* Central 3D Globe Element */}
    <div className="relative z-10 flex flex-col items-center">
      <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
        {/* Floating animated rings */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/30 animate-[spin_12s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-[spin_8s_linear_infinite_reverse]" />
        
        {/* Central Glowing Icon */}
        <div className="absolute inset-0 flex items-center justify-center animate-[bounce_3s_infinite]">
          <div className="absolute w-12 h-12 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
          <Globe className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] relative z-10" strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Refined Typography */}
      <h3 className="text-sm font-bold text-white tracking-[0.25em] uppercase mb-4 text-center drop-shadow-md">Curating Journey</h3>
      <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mb-5" />
      <p className="text-base text-white/70 text-center font-medium leading-relaxed max-w-[260px] drop-shadow-sm">
        Synthesizing the perfect itinerary for <br/><span className="font-extrabold text-white text-lg mt-1 block drop-shadow-md">{destination}</span>
      </p>
    </div>
    
    {/* Scanning Laser Line */}
    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(96,165,250,0.8)] z-10 opacity-70 animate-[scan_3s_ease-in-out_infinite]" />
    
    {/* Minimalist Linear Progress */}
    <div className="absolute bottom-0 left-0 right-0 h-[3px] w-full bg-black/20 overflow-hidden z-20">
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-500 to-emerald-400 animate-[gen-progress_8s_cubic-bezier(0.4,0,0.2,1)_forwards] shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
    </div>
    
    <style>{`
      @keyframes scan {
        0% { top: 0%; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
      @keyframes shimmer {
        from { background-position: 200% 0; }
        to { background-position: -200% 0; }
      }
      @keyframes gen-progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0%); }
      }
    `}</style>
  </motion.div>
);

const FILTERS = ['All', 'draft', 'planning', 'upcoming', 'ongoing', 'completed'];

  export default function TripsPage() {
    const { trips, loadingTrips, fetchTrips, isGeneratingTrip, generatingDestination } = useTripContext();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const deferredSearchQuery = useDeferredValue(searchQuery);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { lightTap, successTap } = useHaptics();
    
    useRoutePreload(2000); // Preload heavy route chunks after 2s of idle

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      // Guard against corrupted null entries
      if (!trip || !trip._id) return false;

      if (!deferredSearchQuery && activeFilter === 'All') return true;
      
      const search = deferredSearchQuery.toLowerCase().trim();
      const dest = trip.destination?.toLowerCase() || '';
      const country = trip.country?.toLowerCase() || '';
      const status = trip.status?.toLowerCase() || '';
      
      const startDateStr = trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase() : '';
      const endDateStr = trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase() : '';
      const monthYearStr = trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toLowerCase() : '';
      
      const matchesSearch = !search || 
        dest.includes(search) || 
        country.includes(search) || 
        status.includes(search) ||
        startDateStr.includes(search) ||
        endDateStr.includes(search) ||
        monthYearStr.includes(search);
        
      const matchesFilter = activeFilter === 'All' || trip.status === activeFilter;

      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [deferredSearchQuery, activeFilter, trips]);

  return (
    <PageTransition className="col-span-12">
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide relative z-0">
        <div className="min-h-screen px-3 md:px-8 lg:px-10 pb-24 pt-[calc(24px+env(safe-area-inset-top))] md:pt-8">
        
        {/* Header Section */}
        <div className="flex flex-row items-start justify-between gap-4 mb-8 md:mb-10 mt-2">
          <div className="flex flex-col">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm mb-2"
            >
              My Trips
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-lg font-medium text-white/50 tracking-wide"
            >
              Plan, manage and revisit.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-2"
          >
            <Link to={`${ROUTES.ASSISTANT}?mode=builder`} onClick={() => successTap()}>
              <button className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-14 md:px-8 rounded-full ios-liquid-button group bg-white/10 border border-white/20 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:bg-white/20">
                <Plus className="w-6 h-6 md:w-5 md:h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform ios-3d-icon" />
                <span className="hidden md:inline text-[15px] font-semibold text-white tracking-wide drop-shadow-md ios-3d-element">Create Trip</span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-5 md:gap-6 mb-8 md:mb-12"
        >
          {/* Liquid Glass Search Bar */}
          <div className={`
            relative flex items-center w-full max-w-2xl h-14 md:h-16 rounded-[20px] md:rounded-[24px]
            bg-white/5 backdrop-blur-2xl
            border border-white/10
            transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)]
            ${isSearchFocused 
              ? 'bg-white/10 border-blue-400/50 shadow-[0_12px_40px_rgba(59,130,246,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)] -translate-y-1 scale-[1.02]' 
              : 'hover:bg-white/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:border-white/20 hover:-translate-y-0.5'}
          `}>
            <div className="pl-4 md:pl-6 flex items-center pointer-events-none">
              <Search className={`w-5 h-5 transition-colors duration-700 ${isSearchFocused ? 'text-blue-400' : 'text-white/50'}`} />
            </div>
            <input 
              type="text" 
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-full bg-transparent border-none outline-none text-white placeholder-white/40 px-4 md:px-5 font-medium text-[14px] md:text-[15px]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-start gap-2 md:gap-3 pb-6 pt-4 px-1">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); lightTap(); }}
                className={`
                  ios-liquid-button shrink-0 relative flex items-center justify-center px-4 md:px-6 min-h-[34px] md:min-h-[38px] rounded-full text-[12px] font-bold tracking-wide
                  transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                  outline-none
                  ${activeFilter === filter 
                    ? 'text-white scale-[1.03] z-10' 
                    : 'text-white/60 hover:text-white/90 hover:scale-[1.03]'
                  }
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="tripsFilterActive"
                    className="absolute inset-0 rounded-full bg-white/15 ring-1 ring-white/40 shadow-[0_8px_16px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] saturate-150 pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 block drop-shadow-md capitalize truncate text-center ${activeFilter === filter ? '' : 'ios-3d-element'}`}>{filter}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trips Grid or Skeletons */}
        <AnimatePresence mode="wait">
          {loadingTrips ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-[400px] w-full rounded-[32px]" />
              ))}
            </motion.div>
          ) : (isGeneratingTrip || filteredTrips.length > 0) ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
            >
              <AnimatePresence>
                {isGeneratingTrip && <GeneratingTripCard key="generating-card" destination={generatingDestination} />}
              </AnimatePresence>
              {filteredTrips.map(trip => {
                if (isGeneratingTrip && trip.destination === generatingDestination) return null;
                return <TripCard key={trip._id} trip={trip} />;
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center w-full min-h-[400px] rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] ios-3d-element"
            >
              <div className="relative w-24 h-24 mb-6 rounded-[24px] bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center ios-3d-icon">
                <Compass className="w-12 h-12 text-white/80 drop-shadow-lg" />
              </div>
              
              <h3 className="text-2xl font-semibold tracking-tighter text-white mb-2 drop-shadow-md">No trips yet.</h3>
              <p className="text-white/60 text-[15px] font-medium mb-8 max-w-sm text-center">
                Your travel library is empty. Let's change that by planning your next unforgettable adventure.
              </p>
              
              <Link to={`${ROUTES.ASSISTANT}?mode=builder`}>
                <button className="flex items-center gap-2 h-12 px-8 rounded-full ios-liquid-button text-white group bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_8px_16px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-300">
                  <span className="text-[14px] font-bold tracking-wide">Create your first journey</span>
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

