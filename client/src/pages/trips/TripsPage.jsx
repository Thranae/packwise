import React, { useState, useMemo } from 'react';
import { Plus, Search, Map, Compass, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';
import { ROUTES } from '@/constants/routes';
import { TripCard } from '@/components/trips/TripCard';
import { useTripContext } from '@/context/TripContext';
import { useHaptics } from '@/hooks/useHaptics';


const FILTERS = ['All', 'draft', 'planning', 'upcoming', 'ongoing', 'completed'];

export default function TripsPage() {
  const { trips } = useTripContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { lightTap, successTap } = useHaptics();

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      // Guard against corrupted null entries
      if (!trip || !trip._id) return false;

      if (!searchQuery && activeFilter === 'All') return true;
      
      const search = searchQuery.toLowerCase().trim();
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
    });
  }, [searchQuery, activeFilter, trips]);

  return (
    <PageTransition className="col-span-12">
      <div className="min-h-screen px-4 md:px-10 lg:px-12 pb-24 pt-4 md:pt-6">
        
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between gap-4 mb-6 md:mb-10">
          <div className="flex flex-col">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white drop-shadow-sm mb-1"
            >
              My Trips
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-lg font-medium text-white/60 tracking-wide"
            >
              Plan, manage and revisit.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
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
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-4 pt-1 px-4 md:px-10 lg:px-12 -mx-4 md:-mx-10 lg:-mx-12 scrollbar-none snap-x snap-mandatory after:content-[''] after:min-w-[1px] md:after:min-w-[24px] after:h-px" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); lightTap(); }}
                className={`
                  ios-liquid-button shrink-0 relative flex items-center justify-center px-1 md:px-6 min-h-[34px] md:min-h-[38px] rounded-full text-[11px] font-bold tracking-wide
                  transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] snap-start
                  w-[calc((100vw-48px)/3)] md:w-auto md:whitespace-nowrap outline-none
                  ${activeFilter === filter 
                    ? 'text-white scale-105 z-10' 
                    : 'text-white/60 hover:text-white/90 hover:scale-105'
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

        {/* Trips Grid */}
        <AnimatePresence mode="wait">
          {filteredTrips.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredTrips.map(trip => (
                <TripCard key={trip._id} trip={trip} />
              ))}
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
    </PageTransition>
  );
}
