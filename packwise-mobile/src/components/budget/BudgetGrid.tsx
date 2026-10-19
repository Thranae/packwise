import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  BedDouble, Utensils, Car, Landmark, ShoppingBag, ShieldAlert,
  FileText, Wifi, BatteryCharging, CloudSun, ShieldCheck, RefreshCw,
  TrendingUp, ArrowRight
} from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';
import Svg, { Circle } from 'react-native-svg';

const ICON_COLORS: Record<string, string> = {
  blue: '#3b82f6',
  orange: '#f97316',
  green: '#10b981',
  purple: '#8b5cf6',
  pink: '#ec4899',
  red: '#ef4444',
  amber: '#f59e0b',
};

const Card = ({ title, icon: Icon, iconColor, children, delay = 0 }: any) => (
  <Animated.View entering={FadeInUp.duration(450).delay(delay)} style={s.card}>
    <View style={s.cardHeader}>
      <Icon size={16} color={iconColor} />
      <Text style={s.cardTitle}>{title}</Text>
    </View>
    {children}
  </Animated.View>
);

export const BudgetGrid = React.memo(({ summary, breakdown, inputs, rates }: any) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const countryDict = COUNTRY_DATA as Record<string, any>;
  const destCurrency = countryDict[inputs.destCountry]?.currency || 'USD';
  const destSymbol = countryDict[inputs.destCountry]?.symbol || '$';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const fmtOrigin = (val: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));
  const fmtDest = (val: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val));

  const dailyItems = [
    { name: 'Hotel', val: breakdown.hotel, icon: BedDouble, color: ICON_COLORS.blue, bg: 'rgba(59, 130, 246, 0.1)' },
    { name: 'Food', val: breakdown.food, icon: Utensils, color: ICON_COLORS.orange, bg: 'rgba(249, 115, 22, 0.1)' },
    { name: 'Transport', val: breakdown.transport, icon: Car, color: ICON_COLORS.green, bg: 'rgba(16, 185, 129, 0.1)' },
    { name: 'Activities', val: breakdown.attractions, icon: Landmark, color: ICON_COLORS.purple, bg: 'rgba(139, 92, 246, 0.1)' },
    { name: 'Shopping', val: breakdown.shopping, icon: ShoppingBag, color: ICON_COLORS.pink, bg: 'rgba(236, 72, 153, 0.1)' },
    { name: 'Emergency', val: summary.emergencyReserve / inputs.days, icon: ShieldAlert, color: ICON_COLORS.red, bg: 'rgba(239, 68, 68, 0.1)' },
  ];

  const total = summary.totalBudget;
  const cats = [
    { name: 'Hotel', val: breakdown.hotel * inputs.days, color: '#3b82f6' },
    { name: 'Food', val: breakdown.food * inputs.days, color: '#f97316' },
    { name: 'Transport', val: breakdown.transport * inputs.days, color: '#10b981' },
    { name: 'Other', val: total - (breakdown.hotel + breakdown.food + breakdown.transport) * inputs.days, color: '#94a3b8' },
  ];
  let offset = 0;
  const pieData = cats.map(c => {
    const pct = (c.val / total) * 100;
    const o = offset;
    offset += pct;
    return { ...c, pct, offset: o };
  });

  const recs = [
    { icon: FileText, color: ICON_COLORS.blue, bg: 'rgba(59, 130, 246, 0.1)', label: 'Visa', value: 'E-Visa Suggested' },
    { icon: Wifi, color: ICON_COLORS.green, bg: 'rgba(16, 185, 129, 0.1)', label: 'Connectivity', value: 'eSIM Recommended' },
    { icon: BatteryCharging, color: ICON_COLORS.amber, bg: 'rgba(245, 158, 11, 0.1)', label: 'Power Adapter', value: 'Type A / B' },
    { icon: CloudSun, color: ICON_COLORS.orange, bg: 'rgba(249, 115, 22, 0.1)', label: 'Avg Weather', value: '18°C – 24°C' },
  ];

  return (
    <View style={s.container}>

      {/* 1. Daily Breakdown */}
      <Card title="Daily Breakdown" icon={BedDouble} iconColor={ICON_COLORS.blue} delay={50}>
        <View style={s.dailyList}>
          {dailyItems.map((item, i) => (
            <View key={i} style={s.dailyRow}>
              <View style={s.dailyLeft}>
                <View style={[s.iconBox, { backgroundColor: item.bg }]}>
                  <item.icon size={16} color={item.color} />
                </View>
                <Text style={s.dailyName} numberOfLines={1}>{item.name}</Text>
              </View>
              <View style={s.dailyRight}>
                <Text style={s.dailyAmount}>{originSymbol} {fmtOrigin(item.val)}</Text>
                <Text style={s.dailySub}>≈ {destSymbol}{fmtDest(item.val)}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* 2. Currency Converter */}
      <Card title="Live Converter" icon={RefreshCw} iconColor={ICON_COLORS.green} delay={100}>
        <View style={s.converterBox}>
          <View style={s.converterLabels}>
            <Text style={s.converterLabel}>You pay ({originCurrency})</Text>
            <Text style={s.converterLabel}>They get ({destCurrency})</Text>
          </View>
          <View style={s.converterValues}>
            <Text style={s.converterBig}>{originSymbol} 10,000</Text>
            <View style={s.arrowCircle}>
              <ArrowRight size={14} color="#10b981" />
            </View>
            <Text style={[s.converterBig, { color: '#059669' }]}>
              {destSymbol} {fmtDest(10000 / rateMultiplier)}
            </Text>
          </View>
          <View style={s.rateRow}>
            <TrendingUp size={13} color="#059669" />
            <Text style={s.rateText}>1 {destCurrency} = {originSymbol}{rateMultiplier.toFixed(2)}</Text>
          </View>
        </View>

        <View style={s.quickAmounts}>
          <Text style={s.quickLabel}>QUICK AMOUNTS</Text>
          <View style={s.quickRow}>
            {[1000, 5000, 10000].map(amt => (
              <TouchableOpacity key={amt} style={s.quickChip} activeOpacity={0.7}>
                <Text style={s.quickChipMain}>{originSymbol}{amt.toLocaleString()}</Text>
                <Text style={s.quickChipSub}>{destSymbol}{fmtDest(amt / rateMultiplier)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Card>

      {/* 3. Category Breakdown */}
      <Card title="Category Breakdown" icon={Landmark} iconColor={ICON_COLORS.purple} delay={150}>
        <View style={s.pieRow}>
          <View style={s.pieContainer}>
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
            <View style={s.pieCenter}>
              <Text style={s.pieCenterLabel}>TOTAL</Text>
              <Text style={s.pieCenterValue}>{destSymbol}{fmtDest(total / rateMultiplier)}</Text>
            </View>
          </View>

          <View style={s.pieLegend}>
            {pieData.map((slice, i) => (
              <View key={i} style={s.legendRow}>
                <View style={s.legendLeft}>
                  <View style={[s.legendDot, { backgroundColor: slice.color }]} />
                  <Text style={s.legendName} numberOfLines={1}>{slice.name}</Text>
                </View>
                <View style={s.legendRight}>
                  <Text style={s.legendAmount}>{originSymbol}{fmtOrigin(slice.val / rateMultiplier)}</Text>
                  <Text style={s.legendPct}>{Math.round(slice.pct)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>

      {/* 4. Smart Recommendations */}
      <Card title="Smart Recommendations" icon={ShieldCheck} iconColor={ICON_COLORS.green} delay={200}>
        <View style={s.recsGrid}>
          {recs.map((r, i) => (
            <View key={i} style={s.recItem}>
              <View style={[s.recIconBox, { backgroundColor: r.bg }]}>
                <r.icon size={16} color={r.color} />
              </View>
              <View style={s.recTextCol}>
                <Text style={s.recLabel} numberOfLines={1}>{r.label}</Text>
                <Text style={s.recValue} numberOfLines={1}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

    </View>
  );
});

const s = StyleSheet.create({
  container: { 
    gap: 16 
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  cardTitle: {
    fontSize: 11.5,
    fontFamily: 'Outfit_700Bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  dailyList: { 
    gap: 8 
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  dailyLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    flex: 1 
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyName: { 
    fontSize: 14, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#1e293b' 
  },
  dailyRight: { 
    alignItems: 'flex-end', 
    gap: 2 
  },
  dailyAmount: { 
    fontSize: 14.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#0f172a' 
  },
  dailySub: { 
    fontSize: 11, 
    fontFamily: 'Outfit_400Regular', 
    color: '#64748b' 
  },

  converterBox: {
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  converterLabels: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  converterLabel: { 
    fontSize: 10.5, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  converterValues: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  converterBig: { 
    fontSize: 20, 
    fontFamily: 'Outfit_800ExtraBold', 
    color: '#0f172a' 
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.12)',
    paddingTop: 10,
  },
  rateText: { 
    fontSize: 12, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#059669' 
  },

  quickAmounts: { 
    gap: 8,
    marginTop: 2,
  },
  quickLabel: { 
    fontSize: 10, 
    fontFamily: 'Outfit_700Bold', 
    color: '#64748b', 
    letterSpacing: 1.5 
  },
  quickRow: { 
    flexDirection: 'row', 
    gap: 8 
  },
  quickChip: {
    flex: 1,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  quickChipMain: { 
    fontSize: 12.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#1e293b',
    textAlign: 'center',
  },
  quickChipSub: { 
    fontSize: 9.5, 
    fontFamily: 'Outfit_400Regular', 
    color: '#64748b', 
    marginTop: 2,
    textAlign: 'center',
  },

  pieRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16 
  },
  pieContainer: { 
    width: 100, 
    height: 100, 
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterLabel: { 
    fontSize: 8.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#64748b', 
    letterSpacing: 1 
  },
  pieCenterValue: { 
    fontSize: 11, 
    fontFamily: 'Outfit_700Bold', 
    color: '#0f172a' 
  },

  pieLegend: { 
    flex: 1, 
    gap: 8 
  },
  legendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  legendLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    flex: 1,
  },
  legendDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
  legendName: { 
    fontSize: 12.5, 
    fontFamily: 'Outfit_500Medium', 
    color: '#334155' 
  },
  legendRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  legendAmount: { 
    fontSize: 12.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#0f172a' 
  },
  legendPct: { 
    fontSize: 11, 
    fontFamily: 'Outfit_400Regular', 
    color: '#64748b', 
    width: 32, 
    textAlign: 'right' 
  },

  recsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 8 
  },
  recItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  recIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTextCol: { 
    flex: 1, 
    gap: 1 
  },
  recLabel: { 
    fontSize: 9.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  recValue: { 
    fontSize: 11.5, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#0f172a' 
  },
});
