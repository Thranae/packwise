import React, { useRef, useEffect, useState } from 'react';
import { Box, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import { useAI } from '@/hooks/useAI';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const PackingWidget = ({ className = "" }) => {
  const { currentTrip, packedItems } = useTripContext();
  const { getPackingList, loading } = useAI();
  const [packingData, setPackingData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentTrip?.destination) {
      getPackingList(currentTrip.destination, currentTrip.weather || 'Sunny').then(setPackingData);
    }
  }, [currentTrip?.destination]);

  const totalItemsList = packingData?.categories?.flatMap(cat => cat.items) || [];
  const total = totalItemsList.length;
  const packed = totalItemsList.filter(item => item.packed || packedItems.has(item.name || item.text)).length;
  const remaining = total - packed;
  const percentage = total > 0 ? (packed / total) * 100 : 0;
  
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 250, damping: 25 });

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      onClick={() => navigate(ROUTES.PACKING)}
      className={`relative p-6 flex flex-col justify-between h-[200px] rounded-[32px] cursor-pointer ios-glass-card group ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col ios-3d-element">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Packing</span>
          <span className="text-3xl font-semibold tracking-tighter text-white drop-shadow-sm">{packed} / {total}</span>
          <span className="text-white/50 text-xs font-medium mt-0.5">Items Packed</span>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center ios-3d-icon">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="24" cy="24" r={radius}
              className="stroke-white/10"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="24" cy="24" r={radius}
              className="stroke-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.8)]"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Box className="w-4 h-4 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 ios-3d-element">
        <div className="flex flex-col">
          {loading ? (
            <span className="flex items-center gap-1.5 text-xs text-orange-400 font-medium"><Loader2 className="w-3 h-3 animate-spin"/> AI planning...</span>
          ) : (
            <span className="text-sm font-semibold text-white/90">{remaining > 0 ? `${remaining} Remaining` : 'Ready to pack'}</span>
          )}
        </div>
        
        {/* Quick Action Button */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] ios-liquid-button text-white cursor-pointer group">
          <span className="text-xs font-bold">Continue</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
