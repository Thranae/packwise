import React, { useRef, useEffect, useState } from 'react';
import { Wallet, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import { useAI } from '@/hooks/useAI';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const BudgetWidget = ({ className = "" }) => {
  const { currentTrip } = useTripContext();
  const { getBudgetAdvice, loading } = useAI();
  const [advice, setAdvice] = useState(null);
  const navigate = useNavigate();

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
      onClick={() => navigate(ROUTES.BUDGET)}
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

      <div className="flex items-center gap-6 mt-2 ios-3d-element h-full">
        {/* Animated SVG Donut Chart */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
            
            {/* Animated Progress Ring */}
            <motion.circle 
              cx="50" cy="50" r="40" 
              stroke={isOverBudget ? "url(#overBudgetGrad)" : "url(#budgetGrad)"} 
              strokeWidth="12" 
              fill="none" 
              strokeLinecap="round"
              initial={{ strokeDasharray: 251.2, strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
            
            <defs>
              <linearGradient id="budgetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="overBudgetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
          </svg>
          {/* Inner Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white tracking-tighter">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex flex-col justify-center h-full gap-3 flex-grow">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Expected</span>
            <div className="flex items-center gap-1.5 text-white/90">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-sm font-semibold">AI Analyzing...</span>
                </>
              ) : isOverBudget ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Est. {expected} / day</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold">Est. {expected} / day</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Budget</span>
            <span className="text-sm font-semibold text-white/80">{dailyBudget} {currency} / day</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
