import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Sparkles, SlidersHorizontal, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react-native';

import { fetchExchangeRates, calculateTripCost } from '../../utils/costEngine';
import { ConfigurationPanel } from '../../components/budget/ConfigurationPanel';
import { BudgetHero } from '../../components/budget/BudgetHero';
import { BudgetGrid } from '../../components/budget/BudgetGrid';
import { BudgetTimeline } from '../../components/budget/BudgetTimeline';
import { useTripContext } from '../../context/TripContext';

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const { currentTrip } = useTripContext();

  const [inputs, setInputs] = useState({
    originCountry: 'India',
    destCountry: currentTrip?.country || 'United States',
    days: currentTrip ? Math.max(1, Math.ceil((new Date(currentTrip.endDate).getTime() - new Date(currentTrip.startDate).getTime()) / 86400000)) : 5,
    travelers: currentTrip?.travelers || 2,
    travelStyle: currentTrip?.travelStyle?.toLowerCase().includes('luxury') ? 'luxury' : currentTrip?.travelStyle?.toLowerCase().includes('budget') ? 'budget' : 'standard',
    budgetType: 'balanced',
    transportation: 'public',
    accommodation: 'hotel',
  });

  const [costData, setCostData] = useState<any>(null);
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setConfigOpen(false);
    try {
      const response = await fetchExchangeRates();
      setRates(response.rates);
      setLastUpdated(Date.now());

      let costs;

      if (currentTrip && currentTrip.budgetDetails && Array.isArray(currentTrip.budgetDetails.categories)) {
        const bd = currentTrip.budgetDetails;
        const getCat = (name: string) => bd.categories.find((c: any) => c.name.toLowerCase().includes(name))?.amount || 0;
        
        const aiHotel = getCat('hotel') || getCat('stay');
        const aiFood = getCat('food') || getCat('dining');
        const aiTransport = getCat('transport') || getCat('flight') || getCat('travel');
        const aiShopping = getCat('shop');
        const aiMisc = getCat('misc') || getCat('other');
        
        costs = {
          dailyBreakdown: {
            hotel: Math.round(aiHotel / inputs.days),
            food: Math.round(aiFood / inputs.days),
            transport: Math.round(aiTransport / inputs.days),
            attractions: Math.round((bd.total - (aiHotel + aiFood + aiTransport + aiShopping + aiMisc)) / inputs.days) || 0,
            shopping: Math.round(aiShopping / inputs.days),
            insurance: 0,
            total: Math.round(bd.total / inputs.days)
          },
          summary: {
            totalBudget: bd.total,
            averageDailySpend: Math.round(bd.total / inputs.days),
            emergencyReserve: Math.round(aiMisc * 0.5),
            internetSim: Math.round(aiMisc * 0.25),
            visaFees: 0,
            miscellaneous: Math.round(aiMisc * 0.25)
          },
          destCurrency: currentTrip.currency || 'USD',
          destSymbol: currentTrip.currency === 'INR' ? '₹' : (currentTrip.currency === 'EUR' ? '€' : '$'),
          destCode: currentTrip.country || inputs.destCountry,
          destFlag: '🌍'
        };
      } else {
        costs = calculateTripCost(
          inputs.destCountry,
          inputs.days,
          inputs.travelers,
          inputs.travelStyle
        );
      }
      
      setCostData(costs);
    } catch (err: any) {
      setError(err.message || 'Failed to load cost estimates');
    } finally {
      setLoading(false);
    }
  }, [inputs, currentTrip]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // Compute clearance height to sit safely below the floating TopHeader
  const topClearance = (insets.top > 0 ? insets.top : 20) + 76;

  return (
    <View style={s.root}>
      <LinearGradient colors={['#eef2ff', '#e0e7ff', '#f0f4ff']} style={StyleSheet.absoluteFill} />
      <ScrollView 
        contentContainerStyle={[s.scroll, { paddingTop: topClearance }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Page Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.badge}>
              <Sparkles size={13} color="#4f46e5" />
              <Text style={s.badgeText}>Smart Cost Engine</Text>
            </View>
            <Text style={s.title}>
              Budget <Text style={s.titleAccent}>Intelligence</Text>
            </Text>
          </View>

          <View style={s.actions}>
            <TouchableOpacity
              onPress={() => setConfigOpen(v => !v)}
              style={s.actionBtn}
              activeOpacity={0.7}
            >
              <SlidersHorizontal size={15} color="#6366f1" />
              <Text style={s.actionBtnText}>Configure</Text>
              <ChevronDown size={14} color="#64748b" style={{ transform: [{ rotate: configOpen ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCalculate}
              style={[s.actionBtn, s.calcBtn]}
              activeOpacity={0.7}
            >
              <RefreshCw size={15} color="#ffffff" />
              <Text style={s.calcBtnText}>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Configuration Panel */}
        {configOpen && (
          <Animated.View entering={FadeInUp.duration(300)}>
            <ConfigurationPanel
              inputs={inputs}
              setInputs={setInputs}
              onCalculate={handleCalculate}
            />
          </Animated.View>
        )}

        {/* Results */}
        {error ? (
          <Animated.View entering={FadeIn.duration(300)} style={s.errorCard}>
            <AlertCircle size={20} color="#ef4444" />
            <Text style={s.errorText}>{error}</Text>
          </Animated.View>
        ) : loading ? (
          <Animated.View entering={FadeIn.duration(300)} style={s.loadingCard}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={s.loadingText}>Crunching the numbers…</Text>
          </Animated.View>
        ) : costData && rates ? (
          <View style={s.results}>
            <BudgetHero summary={costData.summary} inputs={inputs} rates={rates} lastUpdated={lastUpdated} />
            <BudgetGrid summary={costData.summary} breakdown={costData.dailyBreakdown} inputs={inputs} rates={rates} />
            <BudgetTimeline summary={costData.summary} breakdown={costData.dailyBreakdown} inputs={inputs} rates={rates} />
          </View>
        ) : null}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { 
    flex: 1 
  },
  scroll: { 
    paddingHorizontal: 20, 
    paddingBottom: 130 
  },

  header: { 
    marginBottom: 20, 
    gap: 14 
  },
  headerLeft: { 
    gap: 6 
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#0f172a',
    letterSpacing: -0.8,
  },
  titleAccent: { 
    color: '#4f46e5' 
  },

  actions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
  },
  actionBtn: {
    flex: 1,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1e293b',
    textAlign: 'center',
  },
  calcBtn: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },
  calcBtnText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: '#ef4444',
  },

  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 16,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    marginTop: 8,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },

  results: { 
    gap: 16, 
    marginTop: 4 
  },
});
