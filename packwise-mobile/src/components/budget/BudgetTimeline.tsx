import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PlaneTakeoff, PlaneLanding, Map, Clock } from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';

export const BudgetTimeline = React.memo(({ summary, breakdown, inputs, rates }: any) => {
  if (!summary || !breakdown || !rates) return null;

  const originCurrency = 'INR';
  const originSymbol = '₹';
  const countryDict = COUNTRY_DATA as Record<string, any>;
  const destCurrency = countryDict[inputs.destCountry]?.currency || 'USD';

  const rateMultiplier = (rates[originCurrency] || 1) / (rates[destCurrency] || 1);
  const fmtOrigin = (val: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(val * rateMultiplier));

  const days = Math.min(inputs.days, 10);
  const dayCards = Array.from({ length: days }, (_, i) => i + 1);
  const dailyTotal = breakdown.total;

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(250)} style={s.card}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Map size={16} color="#4f46e5" />
          <Text style={s.headerTitle}>Itinerary Cost Projection</Text>
        </View>
        <View style={s.daysBadge}>
          <Text style={s.daysText}>{inputs.days} Days</Text>
        </View>
      </View>

      {/* Horizontal scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {/* Arrival */}
        <TimelineNode
          icon={<PlaneTakeoff size={16} color="#4f46e5" />}
          iconBg="rgba(79, 70, 229, 0.1)"
          iconBorder="rgba(79, 70, 229, 0.25)"
          label="Arrival"
          sublabel="Setup day"
          isFirst
        >
          <Text style={s.nodeDetail}>Airport transfer + SIM card included</Text>
        </TimelineNode>

        {/* Days */}
        {dayCards.map((day) => (
          <TimelineNode
            key={day}
            icon={<Text style={s.dayNum}>D{day}</Text>}
            iconBg="rgba(241, 245, 249, 0.9)"
            iconBorder="rgba(148, 163, 184, 0.25)"
            label={`Day ${day}`}
            sublabel="Explore"
          >
            <View style={s.spendRow}>
              <View style={s.spendLeft}>
                <Clock size={11} color="#64748b" />
                <Text style={s.spendLabel}>Spend</Text>
              </View>
              <Text style={s.spendAmount}>{originSymbol}{fmtOrigin(dailyTotal)}</Text>
            </View>
          </TimelineNode>
        ))}

        {/* Departure */}
        <TimelineNode
          icon={<PlaneLanding size={16} color="#8b5cf6" />}
          iconBg="rgba(139, 92, 246, 0.1)"
          iconBorder="rgba(139, 92, 246, 0.25)"
          label="Departure"
          sublabel="End of trip"
          isLast
        >
          <Text style={s.nodeDetail}>Return to {inputs.originCountry}</Text>
        </TimelineNode>
      </ScrollView>
    </Animated.View>
  );
});

const TimelineNode = ({ icon, iconBg, iconBorder, label, sublabel, children, isFirst, isLast }: any) => (
  <View style={s.node}>
    {!isLast && <View style={[s.connector, s.connectorRight]} />}
    {!isFirst && <View style={[s.connector, s.connectorLeft]} />}

    <View style={[s.nodeCircle, { backgroundColor: iconBg, borderColor: iconBorder }]}>
      {icon}
    </View>

    <View style={s.nodeLabels}>
      <Text style={s.nodeLabel} numberOfLines={1}>{label}</Text>
      <Text style={s.nodeSublabel} numberOfLines={1}>{sublabel}</Text>
    </View>

    <View style={s.nodeCard}>
      {children}
    </View>
  </View>
);

const s = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    marginTop: 2,
    marginBottom: 10,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },

  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  headerTitle: { 
    fontSize: 11.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#475569', 
    textTransform: 'uppercase', 
    letterSpacing: 1.2 
  },
  daysBadge: {
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  daysText: { 
    fontSize: 12, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#334155' 
  },

  scrollContent: { 
    paddingBottom: 6 
  },

  node: { 
    alignItems: 'center', 
    width: 132, 
    position: 'relative' 
  },
  connector: { 
    position: 'absolute', 
    top: 20, 
    height: 2, 
    backgroundColor: 'rgba(148, 163, 184, 0.2)', 
    zIndex: 0 
  },
  connectorRight: { 
    left: '50%', 
    width: '100%' 
  },
  connectorLeft: { 
    right: '50%', 
    width: '100%' 
  },

  nodeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1.5,
  },
  dayNum: { 
    fontSize: 13, 
    fontFamily: 'Outfit_900Black', 
    color: '#0f172a' 
  },

  nodeLabels: { 
    marginTop: 8, 
    alignItems: 'center', 
    gap: 1 
  },
  nodeLabel: { 
    fontSize: 12.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#0f172a',
    textAlign: 'center',
  },
  nodeSublabel: { 
    fontSize: 10.5, 
    fontFamily: 'Outfit_400Regular', 
    color: '#64748b', 
    textTransform: 'capitalize',
    textAlign: 'center',
  },

  nodeCard: {
    marginTop: 8,
    width: 122,
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  nodeDetail: { 
    fontSize: 10, 
    fontFamily: 'Outfit_400Regular', 
    color: '#64748b', 
    lineHeight: 14,
    textAlign: 'center',
  },

  spendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: 4 
  },
  spendLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  spendLabel: { 
    fontSize: 10, 
    fontFamily: 'Outfit_500Medium', 
    color: '#64748b' 
  },
  spendAmount: { 
    fontSize: 12.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#0f172a' 
  },
});
