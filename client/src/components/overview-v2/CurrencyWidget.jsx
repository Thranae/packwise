import React, { useRef } from 'react';
import { DollarSign, ArrowRightLeft, Clock, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import { useLiveCurrency } from '@/hooks/useLiveApis';

export const CurrencyWidget = ({ className = "" }) => {
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 250, damping: 25 });
  
  const { currentTrip } = useTripContext();
  const targetCurrency = currentTrip?.currency || 'EUR';
  const { exchangeRate, trend, history, loading } = useLiveCurrency(targetCurrency, 'INR');

  const generateSparkline = (data) => {
    if (!data || data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    // SVG viewBox 0 0 100 30
    // Pad Y axis slightly to avoid clipping stroke at edges
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 28 - ((val - min) / range) * 26; // max y=28, min y=2
      return `${x},${y}`;
    }).join(' ');
  };

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
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/50 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Loading Live Rates</span>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex flex-col ios-3d-element">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Currency</span>
              <span className="text-3xl font-semibold tracking-tighter text-white drop-shadow-sm">{targetCurrency}</span>
            </div>
            <div className="w-12 h-12 rounded-[16px] bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ios-3d-icon shrink-0">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="flex flex-col gap-3 ios-3d-element mt-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white/90">1 INR</span>
              </div>
              <ArrowRightLeft className="w-4 h-4 text-white/40" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">{exchangeRate} {targetCurrency}</span>
              </div>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-400 ml-auto" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400 ml-auto" />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white/50 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">14-Day Trend</span>
            </div>

            {/* Sparkline Chart */}
            <div className="mt-2 h-[30px] w-full ios-3d-element relative group/chart">
              <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradientUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(52,211,153,0.4)" />
                    <stop offset="100%" stopColor="rgba(52,211,153,0)" />
                  </linearGradient>
                  <linearGradient id="trendGradientDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(244,63,94,0.4)" />
                    <stop offset="100%" stopColor="rgba(244,63,94,0)" />
                  </linearGradient>
                </defs>
                {history?.length > 0 && (
                  <>
                    <polyline
                      fill={trend === 'up' ? "url(#trendGradientUp)" : "url(#trendGradientDown)"}
                      stroke="none"
                      points={`0,30 ${generateSparkline(history)} 100,30`}
                      className="opacity-50 transition-opacity duration-500 group-hover/chart:opacity-80"
                    />
                    <polyline
                      fill="none"
                      stroke={trend === 'up' ? "#34d399" : "#f43f5e"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={generateSparkline(history)}
                      className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-700 [stroke-dasharray:1000] [stroke-dashoffset:0]"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
