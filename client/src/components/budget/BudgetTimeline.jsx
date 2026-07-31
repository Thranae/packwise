import React from 'react';
import { motion } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, Map, Clock } from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

export const BudgetTimeline = React.memo(({ summary, breakdown, inputs, rates }) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const fmtOrigin = (val) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));

  const days = Math.min(inputs.days, 10);
  const dayCards = Array.from({ length: days }, (_, i) => i + 1);
  const dailyTotal = breakdown.total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="w-full ios-glass-card rounded-[32px] p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">Itinerary Cost Projection</span>
        </div>
        <span className="text-xs font-semibold text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          {inputs.days} Days
        </span>
      </div>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-start gap-0 min-w-max">

          {/* Arrival */}
          <TimelineNode
            icon={<PlaneTakeoff className="w-4 h-4 text-blue-400" />}
            iconBg="bg-blue-500/20 border-blue-500/30"
            label="Arrival"
            sublabel="Setup day"
            isFirst
          >
            <p className="text-[10px] text-white/40 leading-relaxed mt-1">Airport transfer + SIM card included</p>
          </TimelineNode>

          {/* Days */}
          {dayCards.map((day) => (
            <TimelineNode
              key={day}
              icon={<span className="text-xs font-black text-white">D{day}</span>}
              iconBg="bg-white/5 border-white/20"
              label={`Day ${day}`}
              sublabel="Explore"
            >
              <div className="flex items-center justify-between mt-1 gap-1">
                <span className="text-[10px] text-white/40 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" /> spend
                </span>
                <span className="text-xs font-bold text-white whitespace-nowrap truncate">{originSymbol}{fmtOrigin(dailyTotal)}</span>
              </div>
            </TimelineNode>
          ))}

          {/* Departure */}
          <TimelineNode
            icon={<PlaneLanding className="w-4 h-4 text-purple-400" />}
            iconBg="bg-purple-500/20 border-purple-500/30"
            label="Departure"
            sublabel="End of trip"
            isLast
          >
            <p className="text-[10px] text-white/40 leading-relaxed mt-1">
              Return to {inputs.originCountry}
            </p>
          </TimelineNode>

        </div>
      </div>
    </motion.div>
  );
});

const TimelineNode = ({ icon, iconBg, label, sublabel, children, isFirst, isLast }) => (
  <div className="flex flex-col items-center min-w-[140px] relative">
    {/* Horizontal connector line */}
    {!isLast && (
      <div className="absolute top-[19px] left-1/2 w-full h-[2px] bg-white/10 z-0" />
    )}
    {!isFirst && (
      <div className="absolute top-[19px] right-1/2 w-full h-[2px] bg-white/10 z-0" />
    )}

    {/* Circle node */}
    <div className={`w-10 h-10 rounded-full border ${iconBg} flex items-center justify-center z-10 relative`}>
      {icon}
    </div>

    {/* Text below */}
    <div className="mt-2 text-center px-3">
      <p className="text-xs font-bold text-white">{label}</p>
      <p className="text-[10px] text-white/40 capitalize">{sublabel}</p>
    </div>

    {/* Card */}
    <div className="mt-2 w-[135px] bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors">
      {children}
    </div>
  </div>
);
