import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plane, Wallet, Clock } from 'lucide-react';
import { COUNTRY_DATA } from '@/utils/costEngine';

export const BudgetHero = React.memo(({ summary, inputs, rates, lastUpdated }) => {
  if (!summary || !rates) return null;

  const originCurrency = COUNTRY_DATA[inputs.originCountry]?.currency || 'USD';
  const originSymbol = COUNTRY_DATA[inputs.originCountry]?.symbol || '$';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';
  const destSymbol = COUNTRY_DATA[inputs.destCountry]?.symbol || '$';
  const destCode = COUNTRY_DATA[inputs.destCountry]?.code?.toLowerCase() || 'us';

  const originRate = rates[originCurrency] || 1;
  const destRate = rates[destCurrency] || 1;

  // The cost engine calculates everything in the destination currency
  const totalDest = summary.totalBudget;
  // Convert back to origin currency
  const totalOrigin = (totalDest / destRate) * originRate;

  const fmt = (val) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val));
  const fmtDest = (val) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val));

  const stats = [
    { label: 'Per Day', value: `${originSymbol}${fmt((summary.averageDailySpend / destRate) * originRate)}`, sub: `${destSymbol}${fmtDest(summary.averageDailySpend)}` },
    { label: 'Per Person', value: `${originSymbol}${fmt((totalOrigin / inputs.travelers))}`, sub: `${inputs.travelers} traveler${inputs.travelers > 1 ? 's' : ''}` },
    { label: 'Duration', value: `${inputs.days} Days`, sub: inputs.travelStyle + ' style' },
    { label: 'Emergency', value: `${originSymbol}${fmt((summary.emergencyReserve / destRate) * originRate)}`, sub: '12% buffer' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full ios-glass-card rounded-[32px] overflow-hidden relative"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 p-6 flex flex-col gap-6">

        {/* Top: badge + live indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">AI Predictor Active</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-white/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live Rates
          </div>
        </div>

        {/* Middle: flight path + big number */}
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Flight path */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/15 bg-white/5">
                <img src="https://flagcdn.com/w80/in.png" alt="India" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-white/60">{inputs.originCountry}</span>
            </div>

            <div className="flex flex-col items-center gap-1 px-2">
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Plane className="w-5 h-5 text-blue-400" />
              </motion.div>
              <div className="w-16 h-px bg-gradient-to-r from-white/20 via-blue-400/50 to-white/20" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/15 bg-white/5">
                <img src={`https://flagcdn.com/w80/${destCode}.png`} alt={inputs.destCountry} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-white/60">{inputs.destCountry}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-white/10 self-center" />

          {/* Big total */}
          <div className="flex flex-col flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Estimated Total</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-white/50">{originSymbol}</span>
              <span className="text-5xl font-extrabold text-white tracking-tighter leading-none">{fmt(totalOrigin)}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-white/50">≈ {destSymbol} {fmtDest(totalDest)} {destCurrency}</span>
              <span className="text-xs text-white/30">·</span>
              <span className="text-xs font-semibold text-emerald-400">1 {destCurrency} = {originSymbol}{(originRate / destRate).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Bottom: stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-white/5">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">{s.label}</span>
              <span className="text-base font-bold text-white">{s.value}</span>
              <span className="text-xs text-white/40 capitalize">{s.sub}</span>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
});
