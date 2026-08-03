import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  BedDouble, Utensils, Car, Landmark, ShoppingBag, ShieldAlert,
  FileText, Wifi, BatteryCharging, CloudSun, ShieldCheck, RefreshCw,
  TrendingUp, ArrowRight
} from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';
import Svg, { Path, Circle, Defs, FeDropShadow, FeGaussianBlur, FeColorMatrix } from 'react-native-svg';

const Card = ({ title, icon: Icon, iconColor, children, delay = 0 }: any) => (
  <Animated.View
    entering={FadeInUp.duration(450).delay(delay)}
    className="bg-[#111827] rounded-[32px] p-6 flex flex-col gap-4 border border-gray-800"
  >
    <View className="flex flex-row items-center gap-2">
      <Icon size={16} color={iconColor} />
      <Text className="text-[11px] font-bold uppercase tracking-widest text-white/60">{title}</Text>
    </View>
    {children}
  </Animated.View>
);

export const BudgetGrid = React.memo(({ summary, breakdown, inputs, rates }: any) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';
  const destSymbol = COUNTRY_DATA[inputs.destCountry]?.symbol || '$';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const fmtOrigin = (val: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));
  const fmtDest = (val: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val));

  const dailyItems = [
    { name: 'Hotel', val: breakdown.hotel, icon: BedDouble, color: '#60a5fa', bg: 'bg-blue-500/15' },
    { name: 'Food', val: breakdown.food, icon: Utensils, color: '#fb923c', bg: 'bg-orange-500/15' },
    { name: 'Transport', val: breakdown.transport, icon: Car, color: '#34d399', bg: 'bg-emerald-500/15' },
    { name: 'Activities', val: breakdown.attractions, icon: Landmark, color: '#c084fc', bg: 'bg-purple-500/15' },
    { name: 'Shopping', val: breakdown.shopping, icon: ShoppingBag, color: '#f472b6', bg: 'bg-pink-500/15' },
    { name: 'Emergency', val: summary.emergencyReserve / inputs.days, icon: ShieldAlert, color: '#f87171', bg: 'bg-red-500/15' },
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
    { icon: FileText, color: '#60a5fa', bg: 'bg-blue-500/15', label: 'Visa', value: 'E-Visa Suggested' },
    { icon: Wifi, color: '#34d399', bg: 'bg-emerald-500/15', label: 'Connectivity', value: 'eSIM Recommended' },
    { icon: BatteryCharging, color: '#fbbf24', bg: 'bg-amber-500/15', label: 'Power Adapter', value: 'Type A / B' },
    { icon: CloudSun, color: '#fb923c', bg: 'bg-orange-500/15', label: 'Avg Weather', value: '18°C – 24°C' },
  ];

  return (
    <View className="flex flex-col gap-4">

      {/* 1. Daily Breakdown */}
      <Card title="Daily Breakdown" icon={BedDouble} iconColor="#60a5fa" delay={50}>
        <View className="flex flex-col gap-1">
          {dailyItems.map((item, i) => (
            <View key={i} className="flex flex-row items-center justify-between py-2 px-2 rounded-xl border border-white/5 bg-white/5 mb-2 gap-2">
              <View className="flex flex-row items-center gap-3 flex-1">
                <View className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center border border-white/20`}>
                  <item.icon size={16} color={item.color} />
                </View>
                <Text className="text-sm font-medium text-white/80" numberOfLines={1}>{item.name}</Text>
              </View>
              <View className="flex flex-col items-end pl-1">
                <Text className="text-sm font-bold text-white">{originSymbol} {fmtOrigin(item.val)}</Text>
                <Text className="text-[10px] text-white/35">≈ {destSymbol}{fmtDest(item.val)}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* 2. Currency Converter */}
      <Card title="Live Converter" icon={RefreshCw} iconColor="#34d399" delay={100}>
        <View className="flex flex-col gap-4">
          <View className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">You pay ({originCurrency})</Text>
              <Text className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">They get ({destCurrency})</Text>
            </View>
            <View className="flex flex-row items-center justify-between gap-1">
              <Text className="text-xl font-bold text-white">{originSymbol} 10,000</Text>
              <View className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center mx-1">
                <ArrowRight size={14} color="#34d399" />
              </View>
              <Text className="text-xl font-bold text-emerald-400">
                {destSymbol} {fmtDest(10000 / rateMultiplier)}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1.5 pt-2 mt-1 border-t border-white/10">
              <TrendingUp size={14} color="#34d399" />
              <Text className="text-xs font-semibold text-emerald-400">1 {destCurrency} = {originSymbol}{rateMultiplier.toFixed(2)}</Text>
            </View>
          </View>

          <View className="flex flex-col gap-2">
            <Text className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Quick Amounts</Text>
            <View className="flex flex-row gap-2">
              {[1000, 5000, 10000].map(amt => (
                <TouchableOpacity key={amt} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 items-center">
                  <Text className="text-[11px] font-bold text-white">{originSymbol}{amt.toLocaleString()}</Text>
                  <Text className="text-[9px] text-white/40">{destSymbol}{fmtDest(amt / rateMultiplier)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Card>

      {/* 3. Category Breakdown */}
      <Card title="Category Breakdown" icon={Landmark} iconColor="#c084fc" delay={150}>
        <View className="flex flex-row items-center gap-4">
          <View className="w-[100px] h-[100px] relative">
            <Svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
              {pieData.map((slice, i) => (
                <Circle
                  key={i}
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="18"
                  strokeDasharray={`${slice.pct * 2.51327} 251.327`}
                  strokeDashoffset={-(slice.offset * 2.51327)}
                  strokeLinecap="round"
                />
              ))}
            </Svg>
            <View className="absolute inset-0 flex flex-col items-center justify-center">
              <Text className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Total</Text>
              <Text className="text-[10px] font-bold text-white">{destSymbol}{fmtDest(total / rateMultiplier)}</Text>
            </View>
          </View>

          <View className="flex flex-col gap-2 flex-1">
            {pieData.map((slice, i) => (
              <View key={i} className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-1.5">
                  <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  <Text className="text-[11px] text-white/70" numberOfLines={1}>{slice.name}</Text>
                </View>
                <View className="flex flex-row items-center gap-1 pl-1">
                  <Text className="text-[11px] font-bold text-white">{originSymbol}{fmtOrigin(slice.val / rateMultiplier)}</Text>
                  <Text className="text-[10px] text-white/35 w-6 text-right">{Math.round(slice.pct)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>

      {/* 4. Smart Recommendations */}
      <Card title="Smart Recommendations" icon={ShieldCheck} iconColor="#34d399" delay={200}>
        <View className="flex flex-row flex-wrap justify-between gap-3">
          {recs.map((r, i) => (
            <View
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-row gap-2 w-[47%] items-center"
            >
              <View className={`w-8 h-8 rounded-lg ${r.bg} flex items-center justify-center border border-white/20`}>
                <r.icon size={16} color={r.color} />
              </View>
              <View className="flex-1">
                <Text className="text-[9px] font-bold text-white/40 uppercase tracking-wider" numberOfLines={1}>{r.label}</Text>
                <Text className="text-[11px] font-semibold text-white mt-0.5" numberOfLines={1}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

    </View>
  );
});
