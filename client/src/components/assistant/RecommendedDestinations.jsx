import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';
import { useAssistant } from '@/context/AssistantContext';
import { RecommendationEngine } from '@/services/RecommendationEngine';
import { useDestinationImage } from '@/hooks/useDestinationImage';

function DestinationCard({ dest, onSelect }) {
  const { image } = useDestinationImage(dest.city, null, dest.searchQuery);
  const { lightTap } = useHaptics();

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        lightTap();
        onSelect(dest);
      }}
      className="shrink-0 snap-start relative w-[200px] h-[260px] rounded-[24px] overflow-hidden text-left ios-glass-card p-0"
    >
      <div
        className="absolute inset-0 bg-cover bg-center group-active:scale-[0.98] transition-transform duration-500"
        style={{ backgroundImage: `url(${image || ''})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="absolute top-3 right-3 px-2 py-1 rounded-[8px] bg-black/40 backdrop-blur-md border border-white/[0.1] flex items-center gap-1">
        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
        <span className="text-white text-[10px] font-bold">{dest.rating || '4.8'}</span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex flex-col">
        <div className="flex items-center gap-1 mb-0.5">
          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">{dest.country}</span>
        </div>
        <h4 className="text-[18px] font-bold text-white leading-tight drop-shadow-md">{dest.city}</h4>
      </div>
    </motion.button>
  );
}

export default function RecommendedDestinations() {
  const { activeFilter, updateRecommendation } = useAssistant();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    // Re-fetch recommendations when active filter changes
    const recs = RecommendationEngine.getRecommendedDestinations(activeFilter, 6);
    setDestinations(recs);
  }, [activeFilter]);

  if (!destinations || destinations.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="px-4 mb-3 flex justify-between items-center">
        <h3 className="text-[17px] font-bold text-white tracking-tight">Recommended</h3>
        <button className="text-[12px] font-semibold text-white/40 active:text-white/70 transition-colors">See All</button>
      </div>

      <div
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pl-4 pr-2 pb-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {destinations.slice(0, 3).map((dest) => (
          <DestinationCard 
            key={dest.id} 
            dest={dest} 
            onSelect={(selectedDest) => updateRecommendation(selectedDest)}
          />
        ))}
      </div>
    </div>
  );
}
