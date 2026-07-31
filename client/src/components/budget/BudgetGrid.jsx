import React from 'react';
import { motion } from 'framer-motion';
import {
  BedDouble, Utensils, Car, Landmark, ShoppingBag, ShieldAlert,
  FileText, Wifi, BatteryCharging, CloudSun, ShieldCheck, RefreshCw,
  TrendingUp, ArrowRight
} from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

const Card = ({ title, icon: Icon, iconColor, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    className="ios-glass-card rounded-[32px] p-6 flex flex-col gap-4 group"
  >
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{title}</span>
    </div>
    {children}
  </motion.div>
);

export const BudgetGrid = React.memo(({ summary, breakdown, inputs, rates }) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';
  const destSymbol = COUNTRY_DATA[inputs.destCountry]?.symbol || '$';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const fmtOrigin = (val) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));
  const fmtDest = (val) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val));

  const dailyItems = [
    { name: 'Hotel', val: breakdown.hotel, icon: BedDouble, color: 'text-blue-400', bg: 'bg-blue-500/15' },
    { name: 'Food', val: breakdown.food, icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-500/15' },
    { name: 'Transport', val: breakdown.transport, icon: Car, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { name: 'Activities', val: breakdown.attractions, icon: Landmark, color: 'text-purple-400', bg: 'bg-purple-500/15' },
    { name: 'Shopping', val: breakdown.shopping, icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-500/15' },
    { name: 'Emergency', val: summary.emergencyReserve / inputs.days, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/15' },
  ];

  const total = summary.totalBudget;
  const cats = [
    { name: 'Hotel', val: breakdown.hotel * inputs.days, color: '#60A5FA' },
    { name: 'Food', val: breakdown.food * inputs.days, color: '#F97316' },
    { name: 'Transport', val: breakdown.transport * inputs.days, color: '#34D399' },
    { name: 'Other', val: total - (breakdown.hotel + breakdown.food + breakdown.transport) * inputs.days, color: '#9CA3AF' },
  ];
  let offset = 0;
  const pieData = cats.map(c => {
    const pct = (c.val / total) * 100;
    const o = offset;
    offset += pct;
    return { ...c, pct, offset: o };
  });

  const recs = [
    { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Visa', value: 'E-Visa Suggested' },
    { icon: Wifi, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Connectivity', value: 'eSIM Recommended' },
    { icon: BatteryCharging, color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Power Adapter', value: 'Type A / B' },
    { icon: CloudSun, color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Avg Weather', value: '18°C – 24°C' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* 1. Daily Breakdown */}
      <Card title="Daily Breakdown" icon={BedDouble} iconColor="text-blue-400" delay={0.05}>
        <div className="flex flex-col gap-1">
          {dailyItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-white/5 transition-colors gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 border border-white/20 shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)] backdrop-blur-md`}>
                  <item.icon className={`w-4 h-4 ${item.color} drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]`} />
                </div>
                <span className="text-sm font-medium text-white/80 truncate">{item.name}</span>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-1 text-right">
                <span className="text-sm font-bold text-white truncate max-w-[100px]">{originSymbol} {fmtOrigin(item.val)}</span>
                <span className="text-[10px] text-white/35 truncate max-w-[100px]">≈ {destSymbol}{fmtDest(item.val)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Currency Converter */}
      <Card title="Live Converter" icon={RefreshCw} iconColor="text-emerald-400" delay={0.1}>
        <div className="flex flex-col gap-4">
          {/* Big conversion */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] font-semibold text-white/40 uppercase tracking-wider">
              <span>You pay ({originCurrency})</span>
              <span>They get ({destCurrency})</span>
            </div>
            <div className="flex items-center justify-between gap-1 min-w-0">
              <span className="text-xl font-bold text-white truncate min-w-0">{originSymbol} 10,000</span>
              <div className="w-7 h-7 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center mx-1">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 truncate text-right min-w-0">
                {destSymbol} {fmtDest(10000 / rateMultiplier)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 pt-1 border-t border-white/10">
              <TrendingUp className="w-3.5 h-3.5" />
              1 {destCurrency} = {originSymbol}{rateMultiplier.toFixed(2)}
            </div>
          </div>

          {/* Quick amounts */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Quick Amounts</span>
            <div className="flex gap-2">
              {[1000, 5000, 10000].map(amt => (
                <div key={amt} className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl p-2 sm:p-3 text-center hover:bg-white/10 transition-colors cursor-pointer">
                  <p className="text-[11px] sm:text-xs font-bold text-white truncate">{originSymbol}{amt.toLocaleString()}</p>
                  <p className="text-[9px] sm:text-[10px] text-white/40 truncate">{destSymbol}{fmtDest(amt / rateMultiplier)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Category Breakdown */}
      <Card title="Category Breakdown" icon={Landmark} iconColor="text-purple-400" delay={0.15}>
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          {/* Donut */}
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] relative shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-[0_8px_12px_rgba(0,0,0,0.4)]">
              <defs>
                <filter id="liquidTube" x="-20%" y="-20%" width="140%" height="140%">
                  {/* Drop shadow */}
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4" result="shadow"/>
                  {/* Inner highlight to create 3D tube effect */}
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                  <feOffset dx="-2" dy="-2" result="offsetBlur"/>
                  <feComposite in="SourceAlpha" in2="offsetBlur" operator="out" result="highlight"/>
                  <feFlood floodColor="white" floodOpacity="0.5" result="highlightColor"/>
                  <feComposite in="highlightColor" in2="highlight" operator="in" result="highlightMask"/>
                  {/* Merge graphic with highlight and shadow */}
                  <feMerge>
                    <feMergeNode in="shadow"/>
                    <feMergeNode in="SourceGraphic"/>
                    <feMergeNode in="highlightMask"/>
                  </feMerge>
                </filter>
              </defs>
              {pieData.map((slice, i) => (
                <motion.circle
                  key={i}
                  initial={{ strokeDasharray: '0 251.327' }}
                  animate={{ strokeDasharray: `${slice.pct * 2.51327} 251.327` }}
                  transition={{ duration: 0.9, delay: i * 0.15, ease: 'easeOut' }}
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="18"
                  strokeDashoffset={-(slice.offset * 2.51327)}
                  filter="url(#liquidTube)"
                  style={{ strokeLinecap: 'round' }}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[8px] sm:text-[9px] font-bold text-white/40 uppercase tracking-wider">Total</span>
              <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{destSymbol}{fmtDest(total / rateMultiplier)}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {pieData.map((slice, i) => (
              <div key={i} className="flex items-center justify-between min-w-0 gap-1">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)]" style={{ backgroundColor: slice.color }} />
                  <span className="text-[11px] sm:text-sm text-white/70 truncate">{slice.name}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0 pl-1 text-right">
                  <span className="text-[11px] sm:text-sm font-bold text-white truncate min-w-0">{originSymbol}{fmtOrigin(slice.val / rateMultiplier)}</span>
                  <span className="text-[10px] sm:text-xs text-white/35 w-6 sm:w-7 shrink-0 text-right">{Math.round(slice.pct)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 4. Smart Recommendations */}
      <Card title="Smart Recommendations" icon={ShieldCheck} iconColor="text-emerald-400" delay={0.2}>
        <div className="grid grid-cols-2 gap-3">
          {recs.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col gap-2 hover:bg-white/8 transition-all cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg ${r.bg} flex items-center justify-center border border-white/20 shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)] backdrop-blur-md`}>
                <r.icon className={`w-4 h-4 ${r.color} drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider truncate">{r.label}</p>
                <p className="text-[13px] sm:text-sm font-semibold text-white mt-0.5 truncate">{r.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

    </div>
  );
});
