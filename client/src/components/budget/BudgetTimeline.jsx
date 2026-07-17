import React from 'react';
import { PlaneTakeoff, PlaneLanding, Map, Clock } from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

export const BudgetTimeline = ({ summary, breakdown, inputs, rates }) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const formatAmount = (val) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));

  const days = Math.min(inputs.days, 10); // cap display to 10 for timeline
  const dayCards = Array.from({ length: days }, (_, i) => i + 1);
  
  const dailyTotal = breakdown.total;

  return (
    <div className="w-full bg-[#121826] border border-white/5 rounded-2xl p-6 lg:p-8 mt-6 flex flex-col shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
           <Map className="w-4 h-4 text-blue-400" /> Itinerary Cost Projection
        </h3>
        <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{inputs.days} Days Total</span>
      </div>

      <div className="flex w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex items-stretch min-w-max">
          
          {/* Arrival Node */}
          <div className="flex flex-col relative pr-12 min-w-[180px]">
             <div className="absolute top-[28px] right-0 w-full h-[2px] bg-white/5" />
             <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-14 h-14 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center shrink-0">
                 <PlaneTakeoff className="w-6 h-6 text-blue-400" />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Start</span>
                 <span className="text-sm font-bold text-white tracking-tight">Arrival</span>
               </div>
             </div>
             <div className="bg-[#1A202C] border border-white/5 rounded-xl p-4 flex flex-col gap-2">
               <div className="flex justify-between items-center text-[10px]">
                 <span className="text-white/50">Initial setup</span>
                 <span className="font-bold text-emerald-400">Included</span>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed">Airport transfer and SIM card purchase.</p>
             </div>
          </div>

          {/* Daily Nodes */}
          {dayCards.map((day) => (
            <div key={day} className="flex flex-col relative pr-12 min-w-[180px]">
               <div className="absolute top-[28px] right-0 w-full h-[2px] bg-white/5" />
               <div className="flex items-center gap-3 mb-6 relative z-10">
                 <div className="w-14 h-14 rounded-full bg-[#1A202C] border-2 border-white/10 flex items-center justify-center shrink-0">
                   <span className="text-sm font-bold text-white">D{day}</span>
                 </div>
                 <div className="flex flex-col gap-0.5">
                   <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active</span>
                   <span className="text-sm font-bold text-white tracking-tight">Explore</span>
                 </div>
               </div>
               <div className="bg-[#1A202C] border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative group hover:bg-[#1f2635] transition-colors cursor-default">
                 <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex justify-between items-center text-[11px]">
                   <span className="text-white/50">Est. Spend</span>
                   <span className="font-bold text-white tracking-tight">{originSymbol} {formatAmount(dailyTotal)}</span>
                 </div>
                 <div className="w-full h-px bg-white/5 my-1" />
                 <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                   <Clock className="w-3 h-3" /> Full day budget
                 </div>
               </div>
            </div>
          ))}

          {/* Departure Node */}
          <div className="flex flex-col relative min-w-[180px]">
             <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-14 h-14 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center shrink-0">
                 <PlaneLanding className="w-6 h-6 text-purple-400" />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">End</span>
                 <span className="text-sm font-bold text-white tracking-tight">Departure</span>
               </div>
             </div>
             <div className="bg-[#1A202C] border border-white/5 rounded-xl p-4 flex flex-col gap-2">
               <div className="flex justify-between items-center text-[10px]">
                 <span className="text-white/50">Remaining</span>
                 <span className="font-bold text-emerald-400">{originSymbol} 0</span>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed">Return to {inputs.originCountry}. Save leftovers for next time!</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
