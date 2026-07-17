import React, { useRef, useEffect, useState } from 'react';
import { Wallet, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import { useAI } from '@/hooks/useAI';

export const BudgetWidget = ({ className = "" }) => {
  const { currentTrip } = useTripContext();
  const { getBudgetAdvice, loading } = useAI();
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    if (currentTrip?.destination && currentTrip?.budget) {
      getBudgetAdvice(currentTrip.destination, currentTrip.budget, currentTrip.currency || 'INR').then(setAdvice);
    }
  }, [currentTrip?.destination, currentTrip?.budget]);

  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 250, damping: 25 });
  
  const getDuration = (start, end) => {
    if (!start || !end) return 1;
    const diff = new Date(end) - new Date(start);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  
  const duration = currentTrip ? getDuration(currentTrip.startDate, currentTrip.endDate) : 1;
  const budget = currentTrip?.budget || 0;
  const currency = currentTrip?.currency || 'INR';
  const dailyBudget = Math.round(budget / duration);
  
  // AI Logic
  const expected = advice?.expectedDailyCost || 0;
  let percentage = 0;
  let isOverBudget = false;
  if (expected > 0 && dailyBudget > 0) {
    percentage = Math.min(100, (expected / dailyBudget) * 100);
    isOverBudget = !advice?.isSufficient;
  }

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`relative p-6 flex flex-col justify-between h-[200px] rounded-[32px] cursor-pointer ios-glass-card group ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col ios-3d-element">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Est. Budget</span>
          <span className="text-3xl font-semibold tracking-tighter text-white drop-shadow-sm">{budget} {currency}</span>
        </div>
        <div className="w-12 h-12 rounded-[16px] bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ios-3d-icon">
          <Wallet className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4 ios-3d-element">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white/10">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              isOverBudget 
                ? 'bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/90">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-sm font-semibold">AI Analyzing...</span>
              </>
            ) : isOverBudget ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Est. {expected} {currency}/day</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold">{dailyBudget} {currency} / day</span>
              </>
            )}
          </div>
          <span className="text-xs font-semibold text-white/50">{duration} Days</span>
        </div>
      </div>
    </motion.div>
  );
};
