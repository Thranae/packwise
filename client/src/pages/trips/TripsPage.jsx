import React, { useState, useMemo, useDeferredValue, useEffect } from 'react';
import { Plus, Search, Map, Compass, Globe, MapPin, Loader2, Bot, Plane, Home, Wallet, CloudSun, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { PageTransition } from '@/components/common/PageTransition';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { ROUTES } from '@/constants/routes';
import { TripCard } from '@/components/trips/TripCard';
import { useTripContext } from '@/context/TripContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useRoutePreload } from '@/hooks/useRoutePreload';
import { Skeleton } from '@/components/ui/Skeleton';
import { GeneratingTripCard } from '@/components/trips/GeneratingTripCard';

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
    <PageTransition className="col-span-12 relative flex flex-col w-full h-full">
      <AnimatedBackground />
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scrollbar-hide relative z-10 w-full">
        <div className="min-h-screen px-4 md:px-8 lg:px-10 pb-24 pt-[calc(24px+var(--safe-top))] md:pt-8 w-full max-w-[1440px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-row items-start justify-between gap-4 mb-8 md:mb-10 mt-2">
          <div className="flex flex-col">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-[0_4px_16px_rgba(255,255,255,0.1)] mb-2 ios-3d-element"
            >
              My Trips
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-lg font-medium text-white/40 tracking-wide"
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
            relative flex items-center w-full max-w-2xl h-14 md:h-16 rounded-[24px] md:rounded-[28px]
            bg-white/[0.03] backdrop-blur-3xl
            border-[1.5px] border-white/5 border-t-white/10
            transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)]
            shadow-[inset_0_2px_8px_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.2)]
            ${isSearchFocused 
              ? 'bg-white/[0.06] border-white/20 border-t-white/30 shadow-[0_12px_40px_rgba(99,102,241,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)] -translate-y-1 scale-[1.01]' 
              : 'active:bg-white/[0.05] active:border-white/10 active:border-t-white/20'}
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
          <div className="relative w-full -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-6 pt-2 snap-x snap-mandatory pr-8">
              {FILTERS.map(filter => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); lightTap(); }}
                    className={`
                      shrink-0 snap-start relative flex items-center justify-center px-6 py-3 rounded-full text-[13px] font-bold tracking-wide
                      transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
                      outline-none border-[1.5px]
                      ${isActive 
                        ? 'text-black bg-white border-white shadow-[0_8px_24px_rgba(255,255,255,0.4)] scale-105 z-10' 
                        : 'text-white/60 bg-white/[0.03] border-white/5 active:bg-white/10 active:text-white/90 active:border-white/20'
                      }
                    `}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className={`capitalize block whitespace-nowrap ${isActive ? 'drop-shadow-sm' : ''}`}>{filter}</span>
                  </button>
                )
              })}
            </div>
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
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
              }}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
            >
              {isGeneratingTrip && <GeneratingTripCard key="generating-card" destination={generatingDestination} />}
              {filteredTrips.map(trip => {
                if (isGeneratingTrip) {
                  // Hide any trip created in the last 15 seconds to avoid showing both the generating card and the actual card
                  const isRecentlyCreated = trip.createdAt && (Date.now() - new Date(trip.createdAt).getTime() < 15000);
                  if (isRecentlyCreated) return null;
                  
                  // Fallback to name matching just in case
                  if (generatingDestination) {
                    const genDest = generatingDestination.toLowerCase();
                    const tripDest = (trip.destination || '').toLowerCase();
                    if (genDest.includes(tripDest) || tripDest.includes(genDest)) return null;
                  }
                }
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
              className="flex flex-col items-center justify-center w-full min-h-[400px] py-12 rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] ios-3d-element"
            >
              <Compass className="w-16 h-16 text-white/20 mb-6 drop-shadow-md" />
              
              <h3 className="text-2xl font-semibold tracking-tighter text-white mb-2 drop-shadow-md">No trips yet.</h3>
              <p className="text-white/60 text-[15px] font-medium mb-8 max-w-sm text-center px-4">
                Your travel library is empty. Let's change that by planning your next unforgettable adventure.
              </p>
              
              <Link to={`${ROUTES.ASSISTANT}?mode=builder`}>
                <button className="flex items-center gap-2 h-12 px-8 rounded-full ios-liquid-button text-white group bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_8px_16px_rgba(59,130,246,0.3)] active:scale-95 transition-transform duration-300">
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

