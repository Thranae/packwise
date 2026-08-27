import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Flame, Leaf } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

const INSPIRATION = [
  { id: 'popular', title: 'Popular This Week', icon: Flame, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'hidden', title: 'Hidden Gems', icon: Compass, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'seasonal', title: 'Seasonal Picks', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

export default function TravelInspirationCarousel() {
  const { lightTap } = useHaptics();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="px-4 sm:px-6 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white tracking-tight">Get Inspired</h3>
      </div>
      
      <div className="relative w-full -mx-4 sm:mx-0">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-0 pb-4">
          {INSPIRATION.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => lightTap()}
                className="shrink-0 snap-start relative w-40 h-32 rounded-[24px] bg-white/[0.04] backdrop-blur-xl border border-white/10 flex flex-col items-start justify-between p-4 group active:bg-white/[0.08]"
              >
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                
                <span className="text-[13px] font-bold text-white tracking-wide text-left leading-tight">
                  {item.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
