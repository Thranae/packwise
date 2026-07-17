import React from 'react';
import { BedDouble, Utensils, Car, Landmark, ShoppingBag, ShieldAlert, FileText, Wifi, BatteryCharging, CloudSun, ShieldCheck, RefreshCw, TrendingUp } from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

export const BudgetGrid = ({ summary, breakdown, inputs, rates }) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';
  const destSymbol = COUNTRY_DATA[inputs.destCountry]?.symbol || '$';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const formatAmount = (val) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));
  const formatDest = (val) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val));

  // Daily budget items
  const dailyItems = [
    { name: 'Hotel', val: breakdown.hotel, icon: BedDouble, color: 'text-blue-400' },
    { name: 'Food', val: breakdown.food, icon: Utensils, color: 'text-orange-400' },
    { name: 'Transport', val: breakdown.transport, icon: Car, color: 'text-emerald-400' },
    { name: 'Activities', val: breakdown.attractions, icon: Landmark, color: 'text-purple-400' },
    { name: 'Shopping', val: breakdown.shopping, icon: ShoppingBag, color: 'text-pink-400' },
    { name: 'Emergency', val: (summary.emergencyReserve / inputs.days), icon: ShieldAlert, color: 'text-red-400' }
  ];

  // Pie chart calculation
  const total = summary.totalBudget;
  const cats = [
    { name: 'Hotel', val: breakdown.hotel * inputs.days, color: '#60A5FA' },
    { name: 'Food', val: breakdown.food * inputs.days, color: '#F97316' },
    { name: 'Transport', val: breakdown.transport * inputs.days, color: '#34D399' },
    { name: 'Other', val: total - ((breakdown.hotel + breakdown.food + breakdown.transport) * inputs.days), color: '#9CA3AF' }
  ];
  
  let currentOffset = 0;
  const pieData = cats.map(c => {
    const pct = (c.val / total) * 100;
    const offset = currentOffset;
    currentOffset += pct;
    return { ...c, pct, offset };
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
      
      {/* 1. Daily Budget */}
      <div className="bg-[#121826] border border-white/5 rounded-2xl p-6 flex flex-col shadow-sm">
        <h3 className="text-[13px] font-bold text-white mb-5 flex items-center gap-2">
           <BedDouble className="w-4 h-4 text-blue-400" /> Daily Budget Breakdown
        </h3>
        <div className="flex flex-col gap-3">
          {dailyItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-white/70 group-hover:text-white transition-colors">{item.name}</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-sm font-bold text-white tracking-tight">{originSymbol} {formatAmount(item.val)}</span>
                 <span className="text-[9px] font-bold text-white/40">≈ {destSymbol}{formatDest(item.val)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Currency Converter */}
      <div className="bg-[#121826] border border-white/5 rounded-2xl p-6 flex flex-col shadow-sm">
        <h3 className="text-[13px] font-bold text-white mb-5 flex items-center gap-2">
           <RefreshCw className="w-4 h-4 text-emerald-400" /> Live Converter
        </h3>
        <div className="bg-[#1A202C] border border-white/5 rounded-xl p-4 flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center text-[10px] font-bold text-white/50 uppercase tracking-wider">
            <span>You pay ({originCurrency})</span>
            <span>They get ({destCurrency})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">{originSymbol} 10,000</span>
            <ArrowRight className="w-5 h-5 text-white/20" />
            <span className="text-2xl font-bold text-white">{destSymbol} {formatDest(10000 / rateMultiplier)}</span>
          </div>
          <div className="w-full h-px bg-white/5 my-1" />
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" /> 1 {destCurrency} = {originSymbol}{rateMultiplier.toFixed(2)}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Quick Amounts</span>
          <div className="flex gap-2">
            {[1000, 5000, 10000].map(amt => (
              <div key={amt} className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-xs font-bold text-white">{originSymbol}{amt}</span>
                <span className="text-[10px] font-medium text-white/50">{destSymbol}{formatDest(amt / rateMultiplier)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Budget Breakdown Pie Chart */}
      <div className="bg-[#121826] border border-white/5 rounded-2xl p-6 flex flex-col shadow-sm">
        <h3 className="text-[13px] font-bold text-white mb-5 flex items-center gap-2">
           <Landmark className="w-4 h-4 text-purple-400" /> Category Breakdown
        </h3>
        <div className="flex items-center gap-6 flex-1">
          <div className="w-[120px] h-[120px] relative shrink-0">
             {/* Simple SVG Pie representation */}
             <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
               {pieData.map((slice, i) => (
                 <circle
                   key={i}
                   cx="50"
                   cy="50"
                   r="40"
                   fill="transparent"
                   stroke={slice.color}
                   strokeWidth="20"
                   strokeDasharray={`${slice.pct * 2.51327} 251.327`}
                   strokeDashoffset={-(slice.offset * 2.51327)}
                 />
               ))}
             </svg>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {pieData.map((slice, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  <span className="text-[11px] font-bold text-white/70">{slice.name}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[11px] font-bold text-white">{originSymbol} {formatAmount(slice.val / rateMultiplier)}</span>
                   <span className="text-[10px] font-bold text-white/40 w-6 text-right">{Math.round(slice.pct)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Travel Recommendations */}
      <div className="bg-[#121826] border border-white/5 rounded-2xl p-6 flex flex-col shadow-sm">
        <h3 className="text-[13px] font-bold text-white mb-5 flex items-center gap-2">
           <ShieldCheck className="w-4 h-4 text-emerald-400" /> Travel Recommendations
        </h3>
        <div className="grid grid-cols-2 gap-3 flex-1">
           <div className="bg-[#1A202C] border border-white/5 rounded-xl p-3 flex items-start gap-3">
             <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
             <div className="flex flex-col gap-0.5">
               <span className="text-[10px] font-bold text-white/40 uppercase">Visa</span>
               <span className="text-[11px] font-bold text-white leading-tight">E-Visa Required</span>
             </div>
           </div>
           <div className="bg-[#1A202C] border border-white/5 rounded-xl p-3 flex items-start gap-3">
             <Wifi className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
             <div className="flex flex-col gap-0.5">
               <span className="text-[10px] font-bold text-white/40 uppercase">Internet</span>
               <span className="text-[11px] font-bold text-white leading-tight">eSIM Recommended</span>
             </div>
           </div>
           <div className="bg-[#1A202C] border border-white/5 rounded-xl p-3 flex items-start gap-3">
             <BatteryCharging className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
             <div className="flex flex-col gap-0.5">
               <span className="text-[10px] font-bold text-white/40 uppercase">Adapter</span>
               <span className="text-[11px] font-bold text-white leading-tight">Type A / B</span>
             </div>
           </div>
           <div className="bg-[#1A202C] border border-white/5 rounded-xl p-3 flex items-start gap-3">
             <CloudSun className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
             <div className="flex flex-col gap-0.5">
               <span className="text-[10px] font-bold text-white/40 uppercase">Weather</span>
               <span className="text-[11px] font-bold text-white leading-tight">18°C - 24°C Avg</span>
             </div>
           </div>
        </div>
      </div>

    </div>
  );
};
