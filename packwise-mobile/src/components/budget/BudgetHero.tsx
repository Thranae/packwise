import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, Plane } from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';

export const BudgetHero = React.memo(({ summary, inputs, rates, lastUpdated }: any) => {
  if (!summary || !rates) return null;

  const countryDict = COUNTRY_DATA as Record<string, any>;
  const originCurrency = countryDict[inputs.originCountry]?.currency || 'USD';
  const originSymbol = countryDict[inputs.originCountry]?.symbol || '$';
  const destCurrency = countryDict[inputs.destCountry]?.currency || 'USD';
  const destSymbol = countryDict[inputs.destCountry]?.symbol || '$';
  const destCode = countryDict[inputs.destCountry]?.code?.toLowerCase() || 'us';

  const originRate = rates[originCurrency] || 1;
  const destRate = rates[destCurrency] || 1;

  const totalDest = summary.totalBudget;
  const totalOrigin = (totalDest / destRate) * originRate;

  const fmt = (val: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val));
  const fmtDest = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val));

  const stats = [
    { label: 'Per Day', value: `${originSymbol}${fmt((summary.averageDailySpend / destRate) * originRate)}`, sub: `${destSymbol}${fmtDest(summary.averageDailySpend)}` },
    { label: 'Per Person', value: `${originSymbol}${fmt(totalOrigin / inputs.travelers)}`, sub: `${inputs.travelers} traveler${inputs.travelers > 1 ? 's' : ''}` },
    { label: 'Duration', value: `${inputs.days} Days`, sub: inputs.travelStyle + ' style' },
    { label: 'Emergency', value: `${originSymbol}${fmt((summary.emergencyReserve / destRate) * originRate)}`, sub: '12% buffer' },
  ];

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={s.card}>
      {/* Top badges */}
      <View style={s.topRow}>
        <View style={s.aiBadge}>
          <Sparkles size={13} color="#4f46e5" />
          <Text style={s.aiBadgeText}>AI Predictor Active</Text>
        </View>
        <View style={s.liveDot}>
          <View style={s.dot} />
          <Text style={s.liveText}>Live Rates</Text>
        </View>
      </View>

      {/* Flight path */}
      <View style={s.flightPath}>
        <View style={s.flagCol}>
          <View style={s.flagCircle}>
            <Image source={{ uri: "https://flagcdn.com/w80/in.png" }} style={s.flagImg} resizeMode="cover" />
          </View>
          <Text style={s.countryLabel} numberOfLines={1}>{inputs.originCountry}</Text>
        </View>

        <View style={s.planeCol}>
          <Plane size={20} color="#4f46e5" />
          <View style={s.planeLine} />
        </View>

        <View style={s.flagCol}>
          <View style={s.flagCircle}>
            <Image source={{ uri: `https://flagcdn.com/w80/${destCode}.png` }} style={s.flagImg} resizeMode="cover" />
          </View>
          <Text style={s.countryLabel} numberOfLines={1}>{inputs.destCountry}</Text>
        </View>
      </View>

      {/* Big total */}
      <View style={s.totalBlock}>
        <Text style={s.totalLabel}>ESTIMATED TOTAL</Text>
        <View style={s.totalRow}>
          <Text style={s.totalSymbol}>{originSymbol}</Text>
          <Text style={s.totalAmount}>{fmt(totalOrigin)}</Text>
        </View>
        <View style={s.subtotalRow}>
          <Text style={s.subtotalText}>≈ {destSymbol} {fmtDest(totalDest)} {destCurrency}</Text>
          <Text style={s.subtotalDot}>·</Text>
          <Text style={s.exchangeRate}>1 {destCurrency} = {originSymbol}{(originRate / destRate).toFixed(2)}</Text>
        </View>
      </View>

      {/* Stats grid */}
      <View style={s.statsGrid}>
        {stats.map((stat, i) => (
          <View key={i} style={s.statItem}>
            <Text style={s.statLabel} numberOfLines={1}>{stat.label}</Text>
            <Text style={s.statValue} numberOfLines={1}>{stat.value}</Text>
            <Text style={s.statSub} numberOfLines={1}>{stat.sub}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
});

const s = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 22,
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  topRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  aiBadgeText: { 
    fontSize: 10.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#4f46e5', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  liveDot: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#10b981' 
  },
  liveText: { 
    fontSize: 11, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#64748b' 
  },

  flightPath: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 4,
  },
  flagCol: { 
    alignItems: 'center', 
    gap: 6,
    width: 80,
  },
  flagCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagImg: { 
    width: '100%', 
    height: '100%' 
  },
  countryLabel: { 
    fontSize: 12, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#334155',
    textAlign: 'center',
  },
  planeCol: { 
    alignItems: 'center', 
    gap: 4, 
    paddingHorizontal: 8 
  },
  planeLine: { 
    width: 48, 
    height: 2, 
    backgroundColor: 'rgba(99, 102, 241, 0.25)', 
    borderRadius: 1 
  },

  totalBlock: { 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 4 
  },
  totalLabel: { 
    fontSize: 11, 
    fontFamily: 'Outfit_700Bold', 
    color: '#64748b', 
    letterSpacing: 2,
    textAlign: 'center',
  },
  totalRow: { 
    flexDirection: 'row', 
    alignItems: 'baseline', 
    justifyContent: 'center',
    gap: 4 
  },
  totalSymbol: { 
    fontSize: 24, 
    fontFamily: 'Outfit_400Regular', 
    color: '#64748b' 
  },
  totalAmount: { 
    fontSize: 44, 
    fontFamily: 'Outfit_900Black', 
    color: '#0f172a', 
    letterSpacing: -2,
    textAlign: 'center',
  },
  subtotalRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8, 
    marginTop: 2 
  },
  subtotalText: { 
    fontSize: 13, 
    fontFamily: 'Outfit_400Regular', 
    color: '#475569' 
  },
  subtotalDot: { 
    fontSize: 12, 
    color: '#cbd5e1' 
  },
  exchangeRate: { 
    fontSize: 11.5, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#059669' 
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.12)',
    gap: 8,
  },
  statItem: { 
    width: '48%', 
    padding: 12,
    backgroundColor: 'rgba(241, 245, 249, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
    gap: 2,
  },
  statLabel: { 
    fontSize: 10, 
    fontFamily: 'Outfit_700Bold', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    letterSpacing: 1.2 
  },
  statValue: { 
    fontSize: 16, 
    fontFamily: 'Outfit_700Bold', 
    color: '#0f172a' 
  },
  statSub: { 
    fontSize: 11, 
    fontFamily: 'Outfit_400Regular', 
    color: '#64748b', 
    textTransform: 'capitalize' 
  },
});
