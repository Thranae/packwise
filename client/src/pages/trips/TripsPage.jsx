import React, { useState, useMemo, useDeferredValue, useEffect } from 'react';
import { Plus, Search, Map, Compass, Globe, MapPin, Loader2, Bot, Plane, Home, Wallet, CloudSun, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { PageTransition } from '@/components/common/PageTransition';
import { AnimatedBackground as PageBackground } from '@/components/common/AnimatedBackground';
import { AnimatedBackground as FilterBackground } from '@/components/motion-primitives/animated-background';
import { ROUTES } from '@/constants/routes';
import { TripCard } from '@/components/trips/TripCard';
import { useTripContext } from '@/context/TripContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useRoutePreload } from '@/hooks/useRoutePreload';
import { Skeleton } from '@/components/ui/Skeleton';
import { GeneratingTripCard } from '@/components/trips/GeneratingTripCard';
import { SlidingNumber } from '@/components/motion-primitives/sliding-number';

import { EmptyTrips } from '@/components/trips/EmptyTrips';

const FILTERS = ['All', 'draft', 'planning', 'upcoming', 'ongoing', 'completed'];

  export default function TripsPage() {
    const { trips, loadingTrips, fetchTrips, isGeneratingTrip, generatingDestination } = useTripContext();
    const scrollContainerRef = React.useRef(null);
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
      <PageBackground />
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scrollbar-hide relative z-10 w-full">
        <div className="min-h-screen px-6 pb-24 pt-[calc(24px+var(--safe-top))] md:pt-12 w-full max-w-[1440px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between gap-4 mb-6 mt-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-3">
            My Trips
            <div className="flex items-center justify-center bg-white/10 border border-white/20 rounded-2xl px-3 py-1 backdrop-blur-xl shadow-lg">
              <span className="text-2xl font-bold text-white tracking-tighter">
                <SlidingNumber value={trips.length} />
              </span>
            </div>
          </h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link to="/assistant/builder" onClick={() => successTap()}>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white shadow-sm hover:bg-white/20 active:scale-95 transition-all duration-300">
                <Plus className="w-5 h-5" strokeWidth={2} />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Control Bar */}
        {(trips.length > 0 || loadingTrips) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-5 w-full mb-10"
          >
            {/* Inline Search */}
            <div className={`
              relative flex items-center w-full h-12 rounded-[16px]
              bg-white/[0.06] border border-white/10
              transition-all duration-300
              ${isSearchFocused ? 'bg-white/10 border-white/20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]' : ''}
            `}>
              <div className="pl-4 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 transition-colors duration-300 ${isSearchFocused ? 'text-white' : 'text-white/40'}`} />
              </div>
              <input 
                type="text" 
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full h-full bg-transparent border-none outline-none text-white placeholder-white/40 px-3 font-medium text-[15px]"
              />
            </div>

            {/* Segmented Filters */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full px-1 snap-x pb-2">
              <FilterBackground
                defaultValue={activeFilter}
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                enableHover={false}
              >
                {FILTERS.map(filter => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      data-id={filter}
                      onClick={() => { setActiveFilter(filter); lightTap(); }}
                      className={`
                        shrink-0 snap-start relative px-5 py-2.5 rounded-full text-[14px] font-bold tracking-wide
                        transition-all duration-300 outline-none
                        ${isActive 
                          ? 'text-white drop-shadow-md' 
                          : 'text-white/60 hover:text-white/90 border border-transparent'
                        }
                      `}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <span className="capitalize">{filter}</span>
                    </button>
                  )
                })}
              </FilterBackground>
            </div>
          </motion.div>
        )}

        {/* Trips Grid or Empty State */}
        <div className="relative z-10 w-full">
          <AnimatePresence mode="wait">
            {loadingTrips ? (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-[460px] md:h-[500px] w-full rounded-[32px] bg-white/5" />
                ))}
              </motion.div>
            ) : (isGeneratingTrip || filteredTrips.length > 0) ? (
              <motion.div
                key="grid"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
              >
                {isGeneratingTrip && <GeneratingTripCard key="generating-card" destination={generatingDestination} />}
                {filteredTrips.map(trip => {
                  if (isGeneratingTrip) {
                    const isRecentlyCreated = trip.createdAt && (Date.now() - new Date(trip.createdAt).getTime() < 15000);
                    if (isRecentlyCreated) return null;
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
              <EmptyTrips />
            )}
          </AnimatePresence>
        </div>
        
        </div>
      </div>
    </PageTransition>
  );
}

