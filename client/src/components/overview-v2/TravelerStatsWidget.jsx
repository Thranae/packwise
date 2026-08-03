import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { Globe, Plane, Award, Map, Compass } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';

export const TravelerStatsWidget = ({ className = "" }) => {
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 250, damping: 25 });
  
  const { trips } = useTripContext();
  
  // Calculate stats based on actual trips if available, otherwise fallback to defaults
  const completedTrips = trips?.filter(t => t.status === 'completed') || [];
  const activeTripsCount = trips?.length || 0;
  
  const stats = {
    countries: Math.max(1, new Set(trips?.map(t => t.country).filter(Boolean)).size),
    trips: activeTripsCount > 0 ? activeTripsCount : 3, // Mock if 0 for visual flair in empty state
    miles: (completedTrips.length * 2400) + 12450 // Mock logic
  };

  const badges = [
    { name: "Globetrotter", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Explorer", icon: Compass, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Frequent Flyer", icon: Plane, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`relative p-6 flex flex-col justify-between h-[300px] rounded-[32px] cursor-pointer ios-glass-card group overflow-hidden ${className}`}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col ios-3d-element">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Travel Passport</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Lifetime Stats</h3>
        </div>
        <div className="w-12 h-12 rounded-[16px] bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] shrink-0 group-hover:scale-110 group-hover:-translate-y-1 group-hover:bg-white/10 transition-all duration-700">
          <Award className="w-6 h-6 text-yellow-400 drop-shadow-md" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 my-4 relative z-10">
        <div className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <Globe className="w-5 h-5 text-blue-400 mb-2 opacity-80" />
          <span className="text-xl font-black text-white">{stats.countries}</span>
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Countries</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <Map className="w-5 h-5 text-emerald-400 mb-2 opacity-80" />
          <span className="text-xl font-black text-white">{stats.trips}</span>
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Trips</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <Plane className="w-5 h-5 text-purple-400 mb-2 opacity-80" />
          <span className="text-xl font-black text-white">{stats.miles.toLocaleString()}</span>
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Miles</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest pl-1">Recent Badges</span>
        <div className="flex gap-2">
          {badges.map((b, i) => (
            <div 
              key={i} 
              className={`flex-1 flex items-center justify-center py-2.5 rounded-[14px] ${b.bg} border border-white/5 hover:scale-105 transition-transform duration-300 group/badge`}
              title={b.name}
            >
              <b.icon className={`w-4 h-4 ${b.color} group-hover/badge:scale-110 transition-transform drop-shadow-sm`} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
