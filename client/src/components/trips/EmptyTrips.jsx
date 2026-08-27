import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Compass, Sparkles, MapPin, Star, Thermometer, LayoutTemplate, Briefcase } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';
import { BorderTrail } from '@/components/motion-primitives/border-trail';
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';

// Hardcoded trending destinations based on the Stitch screenshot
const TRENDING_DESTINATIONS = [
  {
    id: 1,
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e907a5ea071?q=80&w=1000&auto=format&fit=crop',
    rating: '4.0',
    temp: '6°'
  },
  {
    id: 2,
    name: 'Kyoto',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
    rating: '5.0',
    temp: '6°'
  },
  {
    id: 3,
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop',
    rating: '4.8',
    temp: '4°'
  }
];

export function EmptyTrips() {
  const { heavyTap } = useHaptics();
  const navigate = useNavigate();

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col w-full gap-8 pb-10"
    >
      {/* Main Empty State Card */}
      <div className="relative flex flex-col items-center justify-center w-full p-8 rounded-[32px] bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="w-12 h-12 mb-4 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <Compass className="w-6 h-6 text-white/90" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 text-center">
          Ready for your next adventure?
        </h2>
        
        <p className="text-sm font-medium text-white/60 max-w-sm text-center mb-8">
          Your travel library is waiting to be filled. Start planning your itinerary, save inspirational destinations, and build your perfect getaway.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link to={`${ROUTES.ASSISTANT}?mode=builder`} onClick={() => heavyTap()} className="w-full relative group">
            <button className="relative w-full flex items-center justify-center py-3.5 rounded-[16px] bg-white text-black font-bold text-sm tracking-wide active:scale-95 transition-all duration-200 overflow-hidden">
              <TextShimmer duration={2.5} spread={1}>CREATE FIRST TRIP</TextShimmer>
              <BorderTrail 
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                size={80} 
              />
            </button>
          </Link>
          <Link to={ROUTES.EXPLORE} onClick={() => heavyTap()} className="w-full">
            <button className="w-full flex items-center justify-center py-3.5 rounded-[16px] bg-black/40 border border-white/10 text-white font-bold text-sm tracking-wide active:scale-95 transition-all duration-200">
              EXPLORE DESTINATIONS
            </button>
          </Link>
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="flex flex-col w-full">
        <h3 className="text-lg font-bold text-white mb-4 px-1">Trending Destinations</h3>
        <div className="relative w-full -mx-4 sm:mx-0">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-0 pb-4">
            {TRENDING_DESTINATIONS.map(dest => (
              <div 
                key={dest.id}
                onClick={() => navigate(ROUTES.EXPLORE)}
                className="shrink-0 snap-start relative w-48 md:w-64 h-40 md:h-48 rounded-[24px] overflow-hidden group cursor-pointer border border-white/10"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-active:scale-[0.97]"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-3 inset-x-3 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm md:text-base drop-shadow-md">{dest.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white/60 text-[10px]">Rating</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-white/90 text-[10px] font-bold">{dest.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-white/80">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">{dest.temp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="flex flex-col w-full">
        <h3 className="text-lg font-bold text-white mb-4 px-1">Quick Tools</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link to={`${ROUTES.ASSISTANT}`} className="flex flex-col justify-between h-32 md:h-40 p-5 rounded-[24px] bg-white/[0.04] border border-white/10 active:bg-white/[0.08] transition-colors active:scale-[0.97] group">
            <Sparkles className="w-7 h-7 text-white/80 group-active:text-white" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-[15px]">AI Planner</span>
              <span className="text-white/50 text-xs mt-0.5">Generate itineraries</span>
            </div>
          </Link>
          <div className="flex flex-col justify-between h-32 md:h-40 p-5 rounded-[24px] bg-white/[0.04] border border-white/10 active:bg-white/[0.08] transition-colors active:scale-[0.97] group cursor-not-allowed opacity-70">
            <LayoutTemplate className="w-7 h-7 text-white/80 group-active:text-white" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-[15px]">Templates</span>
              <span className="text-white/50 text-xs mt-0.5">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
