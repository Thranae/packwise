import React from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, Plane, Wallet, Clock } from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';

export const BudgetHero = React.memo(({ summary, inputs, rates, lastUpdated }: any) => {
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

  const fmt = (val: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val));
  const fmtDest = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val));

  const stats = [
    { label: 'Per Day', value: `${originSymbol}${fmt((summary.averageDailySpend / destRate) * originRate)}`, sub: `${destSymbol}${fmtDest(summary.averageDailySpend)}` },
    { label: 'Per Person', value: `${originSymbol}${fmt((totalOrigin / inputs.travelers))}`, sub: `${inputs.travelers} traveler${inputs.travelers > 1 ? 's' : ''}` },
    { label: 'Duration', value: `${inputs.days} Days`, sub: inputs.travelStyle + ' style' },
    { label: 'Emergency', value: `${originSymbol}${fmt((summary.emergencyReserve / destRate) * originRate)}`, sub: '12% buffer' },
  ];

  return (
    <Animated.View
      entering={FadeInUp.duration(500)}
      className="w-full bg-[#111827] rounded-[32px] overflow-hidden relative border border-gray-800"
    >
      <View className="relative z-10 p-6 flex flex-col gap-6">

        {/* Top: badge + live indicator */}
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <Sparkles size={14} color="#60a5fa" />
            <Text className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">AI Predictor Active</Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-emerald-500" />
            <Text className="text-[11px] font-semibold text-white/40">Live Rates</Text>
          </View>
        </View>

        {/* Middle: flight path + big number */}
        <View className="flex flex-col gap-6">
          {/* Flight path */}
          <View className="flex flex-row items-center justify-between gap-4 self-center">
            <View className="flex flex-col items-center gap-2">
              <View className="w-12 h-12 rounded-full overflow-hidden border border-white/15 bg-white/5">
                <Image source={{ uri: "https://flagcdn.com/w80/in.png" }} className="w-full h-full" resizeMode="cover" />
              </View>
              <Text className="text-xs font-semibold text-white/60">{inputs.originCountry}</Text>
            </View>

            <View className="flex flex-col items-center gap-1 px-2">
              <Plane size={20} color="#60a5fa" />
              <View className="w-16 h-[1px] bg-blue-400/50" />
            </View>

            <View className="flex flex-col items-center gap-2">
              <View className="w-12 h-12 rounded-full overflow-hidden border border-white/15 bg-white/5">
                <Image source={{ uri: `https://flagcdn.com/w80/${destCode}.png` }} className="w-full h-full" resizeMode="cover" />
              </View>
              <Text className="text-xs font-semibold text-white/60">{inputs.destCountry}</Text>
            </View>
          </View>

          {/* Big total */}
          <View className="flex flex-col items-center mt-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Estimated Total</Text>
            <View className="flex flex-row items-baseline gap-2">
              <Text className="text-2xl font-light text-white/50">{originSymbol}</Text>
              <Text className="text-5xl font-extrabold text-white tracking-tighter leading-none">{fmt(totalOrigin)}</Text>
            </View>
            <View className="flex flex-row items-center gap-2 mt-3">
              <Text className="text-sm text-white/50">≈ {destSymbol} {fmtDest(totalDest)} {destCurrency}</Text>
              <Text className="text-xs text-white/30">·</Text>
              <Text className="text-xs font-semibold text-emerald-400">1 {destCurrency} = {originSymbol}{(originRate / destRate).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Bottom: stats row */}
        <View className="flex flex-row flex-wrap justify-between gap-3 pt-4 mt-2 border-t border-white/5">
          {stats.map((s, i) => (
            <View key={i} className="flex flex-col gap-0.5 w-[45%] mb-2">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-white/35">{s.label}</Text>
              <Text className="text-base font-bold text-white">{s.value}</Text>
              <Text className="text-xs text-white/40 capitalize">{s.sub}</Text>
            </View>
          ))}
        </View>

      </View>
    </Animated.View>
  );
});
