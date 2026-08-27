import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const TRENDING = [
  { id: 1, name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop', rating: '4.9' },
  { id: 2, name: 'Swiss Alps', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-77cf3527e79a?q=80&w=800&auto=format&fit=crop', rating: '5.0' },
  { id: 3, name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop', rating: '4.8' },
];

export default function TrendingDestinationCarousel() {
  const { lightTap } = useHaptics();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="px-4 sm:px-6 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white tracking-tight">Trending Now</h3>
      </div>
      
      <div className="relative w-full -mx-4 sm:mx-0">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-0 pb-4">
          {TRENDING.map((dest) => (
            <motion.button
              key={dest.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => lightTap()}
              className="shrink-0 snap-start relative w-56 h-72 rounded-[28px] overflow-hidden group text-left border border-white/10"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 group-active:scale-[0.98]"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
              
              <div className="absolute top-3 right-3 px-2 py-1 rounded-[10px] bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-white text-[11px] font-bold">{dest.rating}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-col">
                <div className="flex items-center gap-1 mb-1 opacity-80">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">{dest.country}</span>
                </div>
                <h4 className="text-xl font-bold text-white drop-shadow-md">{dest.name}</h4>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
