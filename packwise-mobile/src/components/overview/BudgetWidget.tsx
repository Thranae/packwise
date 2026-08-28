import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Wallet, TrendingUp, ArrowRight, Plus } from 'lucide-react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import AddExpenseSheet from '../budget/AddExpenseSheet';
const { width } = Dimensions.get('window');

const LiquidDividerV = () => (
  <View style={styles.liquidDividerV}>
    <View style={styles.divHighlightV} />
    <View style={styles.divBodyV} />
    <View style={styles.divShadowV} />
  </View>
);

const AnimatedPremiumAmount = ({ amount, glowColor, formatter, isSmall = false, style }: any) => {
  const [displayAmount, setDisplayAmount] = React.useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const end = amount;
    const duration = 1200;
    const startTime = Date.now();
    let animationFrameId: number;
    
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayAmount(start + (end - start) * easeProgress);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [amount]);

  const parts = formatter.formatToParts(displayAmount);
  return (
    <Text style={[
      isSmall ? styles.metricValueSmall : styles.metricValue, 
      glowColor ? { 
        color: glowColor, 
        textShadowColor: glowColor === '#10b981' ? 'rgba(16, 185, 129, 0.4)' : glowColor === '#eab308' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(239, 68, 68, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
      } : null,
      style
    ]}>
      {parts.map((p: any, i: number) => {
        if (p.type === 'currency') {
          return <Text key={i} style={isSmall ? styles.currencySymbolSmall : styles.currencySymbol}>{p.value}&nbsp;</Text>;
        }
        return p.value;
      })}
    </Text>
  );
};

export default function BudgetWidget({ trip }: { trip?: any }) {
  const { totalBudget: budget, getSpentAmount, currency } = useBudgetStore();
  const spent = getSpentAmount();
  const [showAddExpense, setShowAddExpense] = React.useState(false);
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  });

  const remaining = Math.max(0, budget - spent);
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remainingPct = 100 - percentage;

  let remainingColor = '#10b981'; // Green
  if (remainingPct <= 15) {
    remainingColor = '#ef4444'; // Red
  } else if (remainingPct <= 50) {
    remainingColor = '#eab308'; // Yellow
  }

  // Smart Forecasting Mock Logic
  const totalDays = 7;
  const daysPassed = 4;
  const dailyBurnRate = spent / daysPassed;
  const forecastedTotalSpend = dailyBurnRate * totalDays;
  const forecastedRemaining = budget - forecastedTotalSpend;
  
  let forecastColor = '#10b981';
  if (forecastedRemaining < 0) {
    forecastColor = '#ef4444';
  } else if (forecastedRemaining < budget * 0.2) {
    forecastColor = '#eab308';
  }

  return (
    <Animated.View entering={FadeInDown.duration(800).delay(250).springify().damping(24).stiffness(200)} style={styles.container}>
      <View style={styles.shadowWrapper}>
        <BlurView intensity={90} tint="light" style={styles.glassContainer}>
          {/* Top Caustic Light */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.4)', 'transparent']}
            locations={[0, 0.2, 0.5]}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Depth Shadow */}
          <LinearGradient
            colors={['transparent', 'rgba(47, 107, 255, 0.03)', 'rgba(0, 0, 0, 0.08)']}
            locations={[0.5, 0.8, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Inner stroke glow */}
          <View style={styles.innerGlowRim} pointerEvents="none" />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.liquidPillShadow}>
              <BlurView intensity={80} tint="default" style={styles.liquidPill}>
                {/* Plump top highlight */}
                <LinearGradient
                  colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.2)', 'transparent']}
                  locations={[0, 0.3, 1]}
                  style={StyleSheet.absoluteFillObject}
                />
                {/* Plump bottom shadow */}
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.05)', 'rgba(47, 107, 255, 0.15)']}
                  locations={[0.5, 0.8, 1]}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.liquidPillInnerStroke} pointerEvents="none" />
                <Wallet size={16} color="#2F6BFF" strokeWidth={2.5} />
                <Text style={styles.title}>BUDGET OVERVIEW</Text>
              </BlurView>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.actionArrowShadow} onPress={() => setShowAddExpense(true)}>
              <BlurView intensity={80} tint="default" style={styles.actionArrowPill}>
                {/* Plump top highlight */}
                <LinearGradient
                  colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.2)', 'transparent']}
                  locations={[0, 0.3, 1]}
                  style={StyleSheet.absoluteFillObject}
                />
                {/* Plump bottom shadow */}
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.05)', 'rgba(47, 107, 255, 0.15)']}
                  locations={[0.5, 0.8, 1]}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.actionArrowStroke} pointerEvents="none" />
                <Plus size={16} color="#0f172a" strokeWidth={2.5} />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Partition Container */}
          <View style={styles.partitionContainer}>
            {/* Base recessed color */}
            <LinearGradient
              colors={['rgba(220, 235, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
              locations={[0, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Inner Shadow Gradient at Top */}
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0.02)', 'transparent']}
              locations={[0, 0.15, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.partitionInnerStroke} pointerEvents="none" />

            {/* Metrics Row */}
            <View style={styles.metricsRow}>
              {/* Left: Total Budget */}
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>TOTAL BUDGET</Text>
                <AnimatedPremiumAmount amount={budget} glowColor="#10b981" formatter={formatter} />
              </View>

              <LiquidDividerV />

              {/* Right: Remaining */}
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>REMAINING</Text>
                <AnimatedPremiumAmount amount={remaining} glowColor={remainingColor} formatter={formatter} />
                <View style={styles.forecastShadow}>
                  <BlurView intensity={70} tint="light" style={styles.forecastContainer}>
                    {/* Plump top highlight */}
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
                      locations={[0, 0.3, 1]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    {/* Plump bottom shadow */}
                    <LinearGradient
                      colors={['transparent', 'rgba(0, 0, 0, 0.02)', 'rgba(47, 107, 255, 0.08)']}
                      locations={[0.5, 0.8, 1]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.forecastStroke} pointerEvents="none" />
                    <Text style={styles.forecastLabel}>PROJECTED:</Text>
                    <AnimatedPremiumAmount amount={forecastedRemaining} glowColor={forecastColor} formatter={formatter} isSmall />
                  </BlurView>
                </View>
              </View>
            </View>

            {/* Progress Bar Area */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]}>
                  <LinearGradient
                    colors={['#5AA9FF', '#2F6BFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  {/* Glossy top edge on progress bar */}
                  <LinearGradient
                    colors={['rgba(255,255,255,0.6)', 'transparent']}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                </View>
              </View>
              <View style={styles.progressFooter}>
                <Text style={styles.progressText}>
                  {percentage.toFixed(0)}% used
                </Text>
                <View style={styles.trendContainer}>
                  <TrendingUp size={12} color="#64748b" />
                  <Text style={styles.trendText}>On track</Text>
                </View>
              </View>
            </View>

          </View>

        </BlurView>
      </View>
      <AddExpenseSheet visible={showAddExpense} onClose={() => setShowAddExpense(false)} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
    zIndex: 10,
  },
  shadowWrapper: {
    borderRadius: 32,
    backgroundColor: '#ffffff',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
  glassContainer: {
    borderRadius: 32,
    padding: 24,
    backgroundColor: 'rgba(235, 245, 255, 0.85)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  innerGlowRim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
    borderRightColor: 'rgba(0, 0, 0, 0.02)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liquidPillShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  liquidPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  liquidPillInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 12, // Increased from 10
    fontWeight: '800',
    color: '#0f172a', // Darker for better contrast in the pill
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actionArrowShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  actionArrowPill: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  actionArrowStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  partitionContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(240, 248, 255, 0.5)',
    borderTopWidth: 2,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.15)', // Shadow on top
    borderLeftColor: 'rgba(0, 0, 0, 0.1)', // Shadow on left
    borderBottomColor: 'rgba(255, 255, 255, 1)', // Highlight on bottom
    borderRightColor: 'rgba(255, 255, 255, 0.8)', // Highlight on right
  },
  partitionInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    opacity: 0.8,
  },
  liquidDividerV: {
    width: 3,
    height: '80%',
    flexDirection: 'row',
    borderRadius: 1.5,
    overflow: 'hidden',
    opacity: 0.8,
  },
  divHighlightV: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  divBodyV: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(200, 224, 255, 0.3)',
  },
  divShadowV: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.2,
  },
  metricValueSmall: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  currencySymbolSmall: {
    fontSize: 12,
    fontWeight: '800',
    opacity: 0.8,
  },
  forecastShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  forecastContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    overflow: 'hidden',
  },
  forecastStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  forecastLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
  },
});
