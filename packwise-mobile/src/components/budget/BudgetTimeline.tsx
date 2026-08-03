import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PlaneTakeoff, PlaneLanding, Map, Clock } from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';

export const BudgetTimeline = React.memo(({ summary, breakdown, inputs, rates }: any) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const destCurrency = COUNTRY_DATA[inputs.destCountry]?.currency || 'USD';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const fmtOrigin = (val: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));

  const days = Math.min(inputs.days, 10);
  const dayCards = Array.from({ length: days }, (_, i) => i + 1);
  const dailyTotal = breakdown.total;

  return (
    <Animated.View
      entering={FadeInUp.duration(500).delay(250)}
      className="w-full bg-[#111827] rounded-[32px] p-6 flex flex-col gap-5 border border-gray-800 mt-4 mb-10"
    >
      {/* Header */}
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Map size={16} color="#60a5fa" />
          <Text className="text-[11px] font-bold uppercase tracking-widest text-white/60">Itinerary Cost Projection</Text>
        </View>
        <View className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          <Text className="text-xs font-semibold text-white/40">{inputs.days} Days</Text>
        </View>
      </View>

      {/* Horizontal scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
        <View className="flex flex-row items-start min-w-[500px]">

          {/* Arrival */}
          <TimelineNode
            icon={<PlaneTakeoff size={16} color="#60a5fa" />}
            iconBg="bg-blue-500/20 border border-blue-500/30"
            label="Arrival"
            sublabel="Setup day"
            isFirst
          >
            <Text className="text-[10px] text-white/40 mt-1 leading-4">Airport transfer + SIM card included</Text>
          </TimelineNode>

          {/* Days */}
          {dayCards.map((day) => (
            <TimelineNode
              key={day}
              icon={<Text className="text-xs font-black text-white">D{day}</Text>}
              iconBg="bg-white/5 border border-white/20"
              label={`Day ${day}`}
              sublabel="Explore"
            >
              <View className="flex flex-row items-center justify-between mt-1 gap-1">
                <View className="flex flex-row items-center gap-1">
                  <Clock size={12} color="#9ca3af" />
                  <Text className="text-[10px] text-white/40">spend</Text>
                </View>
                <Text className="text-xs font-bold text-white">{originSymbol}{fmtOrigin(dailyTotal)}</Text>
              </View>
            </TimelineNode>
          ))}

          {/* Departure */}
          <TimelineNode
            icon={<PlaneLanding size={16} color="#c084fc" />}
            iconBg="bg-purple-500/20 border border-purple-500/30"
            label="Departure"
            sublabel="End of trip"
            isLast
          >
            <Text className="text-[10px] text-white/40 mt-1 leading-4">Return to {inputs.originCountry}</Text>
          </TimelineNode>

        </View>
      </ScrollView>
    </Animated.View>
  );
});

const TimelineNode = ({ icon, iconBg, label, sublabel, children, isFirst, isLast }: any) => (
  <View className="flex flex-col items-center w-[140px] relative">
    {/* Horizontal connector line */}
    {!isLast && (
      <View className="absolute top-[20px] left-1/2 w-full h-[2px] bg-white/10 z-0" />
    )}
    {!isFirst && (
      <View className="absolute top-[20px] right-1/2 w-full h-[2px] bg-white/10 z-0" />
    )}

    {/* Circle node */}
    <View className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center z-10 relative bg-[#111827]`}>
      {icon}
    </View>

    {/* Text below */}
    <View className="mt-2 text-center px-3 items-center">
      <Text className="text-xs font-bold text-white">{label}</Text>
      <Text className="text-[10px] text-white/40 capitalize">{sublabel}</Text>
    </View>

    {/* Card */}
    <View className="mt-2 w-[125px] bg-white/5 border border-white/10 rounded-xl p-3">
      {children}
    </View>
  </View>
);
