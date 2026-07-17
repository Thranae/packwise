import React from 'react';
import { Sparkles, ArrowRight, RefreshCw, Plane } from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

export const BudgetHero = ({ summary, inputs, rates, lastUpdated }) => {
  if (!summary || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';
  const destSymbol = COUNTRY_DATA[inputs.destCountry]?.symbol || '$';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const totalOrigin = summary.totalBudget;
  const totalDest = totalOrigin / rateMultiplier;

  const formatAmount = (val) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val));
  const displayRate = rateMultiplier.toFixed(2);

  return (
    <div className="w-full bg-[#121826] border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top row: Tags & Updates */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="bg-[#4F46E5]/10 text-[#818CF8] border border-[#4F46E5]/20 px-3 py-1 text-[11px] font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> AI Estimated
          </span>
          <span className="bg-white/5 border border-white/5 px-3 py-1 text-[11px] font-bold text-white/70 rounded-full uppercase tracking-wider">
            {inputs.travelStyle} • {inputs.days} Days
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/50 font-bold">
          Updated just now <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left: Huge Amount */}
        <div className="flex flex-col justify-center">
          <span className="text-[13px] font-bold text-white/60 mb-2">Estimated Trip Cost</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-light text-white/80">{originSymbol}</span>
            <span className="text-5xl lg:text-[64px] font-extrabold text-white tracking-tight leading-none">{formatAmount(totalOrigin)}</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-baseline gap-1 text-white/50">
              <span className="text-lg">≈ {destSymbol}</span>
              <span className="text-xl font-bold text-white/80 tracking-tight">{formatAmount(totalDest)}</span>
              <span className="text-[11px] font-bold">{destCurrency}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <RefreshCw className="w-3.5 h-3.5" /> 1 {destCurrency} = {originSymbol}{displayRate}
            </div>
          </div>
        </div>

        {/* Right: Flags & Path */}
        <div className="flex flex-col items-center justify-center md:items-end">
          <div className="w-full max-w-[280px] bg-[#1A202C] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Origin</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-sm overflow-hidden shrink-0"><img src="https://flagcdn.com/w40/in.png" alt="India" className="w-full h-full object-cover"/></div>
                  <span className="text-sm font-bold text-white">{inputs.originCountry}</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                 <Plane className="w-4 h-4 text-blue-500 mb-1" />
                 <div className="w-full h-[1px] border-t border-dashed border-white/20" />
              </div>

              <div className="flex flex-col gap-2 items-end">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Dest</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{inputs.destCountry}</span>
                  <div className="w-6 h-6 rounded-sm overflow-hidden shrink-0"><img src={`https://flagcdn.com/w40/${COUNTRY_DATA[inputs.destCountry]?.countryCode?.toLowerCase() || 'us'}.png`} alt={inputs.destCountry} className="w-full h-full object-cover"/></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
