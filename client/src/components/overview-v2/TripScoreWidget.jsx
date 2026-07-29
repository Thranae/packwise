import React, { useRef, useState, useEffect } from 'react';
import { Shield, Loader2, Cloud, Wallet, Package, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import api from '@/services/api';

const SCORE_COLORS = {
  high: { text: 'text-emerald-400', bg: 'bg-emerald-400', stroke: '#34d399', glow: 'rgba(52,211,153,0.3)' },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-400', stroke: '#facc15', glow: 'rgba(250,204,21,0.3)' },
  low: { text: 'text-orange-400', bg: 'bg-orange-400', stroke: '#fb923c', glow: 'rgba(251,146,60,0.3)' },
  critical: { text: 'text-rose-400', bg: 'bg-rose-400', stroke: '#fb7185', glow: 'rgba(251,113,133,0.3)' },
};

const getScoreTheme = (score) => {
  if (score >= 80) return SCORE_COLORS.high;
  if (score >= 60) return SCORE_COLORS.medium;
  if (score >= 40) return SCORE_COLORS.low;
  return SCORE_COLORS.critical;
};

const getLabel = (score) => {
  if (score >= 80) return '🟢 Ready to Go';
  if (score >= 60) return '🟡 Almost Ready';
  if (score >= 40) return '🟠 Needs Attention';
  return '🔴 Not Ready';
};

const FACTOR_ICONS = [
  { key: 'weather', label: 'Weather', icon: Cloud },
  { key: 'budget', label: 'Budget', icon: Wallet },
  { key: 'packing', label: 'Packing', icon: Package },
  { key: 'visa', label: 'Visa', icon: FileCheck },
];

const widgetVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export const TripScoreWidget = ({ className = "" }) => {
  const cardRef = useRef(null);
  useMouseTilt(cardRef);
  const { currentTrip } = useTripContext();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchScore = async () => {
      setLoading(true);
      try {
        if (!currentTrip?._id) throw new Error("No trip id");
        const res = await api.get(`/ai/trip-score/${currentTrip._id}`);
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) {
          setData({ score: 72, label: 'Almost Ready', factors: { weather: 85, budget: 65, packing: 70, visa: 68 } });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchScore();
    return () => { isMounted = false; };
  }, [currentTrip?._id]);

  if (loading) {
    return (
      <motion.div variants={widgetVariants} className={`ios-glass-card rounded-[32px] p-6 h-[200px] flex items-center justify-center ${className}`}>
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </motion.div>
    );
  }

  const { score, factors } = data || { score: 72, factors: { weather: 85, budget: 65, packing: 70, visa: 68 } };
  const theme = getScoreTheme(score);
  const label = getLabel(score);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      ref={cardRef}
      variants={widgetVariants}
      className={`ios-glass-card rounded-[32px] p-6 h-[200px] flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-white/50" />
        <span className="text-[11px] font-medium tracking-wider text-white/50 uppercase">Trip Readiness</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-[80px] h-[80px] flex-shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="fill-none stroke-white/10"
              strokeWidth="6"
            />
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              className="fill-none drop-shadow-md"
              stroke={theme.stroke}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              style={{ filter: `drop-shadow(0 0 6px ${theme.glow})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${theme.text}`}>{score}</span>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 gap-2">
          <div className="text-sm font-medium text-white mb-1">{label}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {FACTOR_ICONS.map(({ key, label, icon: Icon }) => {
              const factorScore = factors[key] || 0;
              const factorTheme = getScoreTheme(factorScore);
              return (
                <div key={key} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-white/40" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-white/50">{label}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${factorTheme.bg}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${factorScore}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
