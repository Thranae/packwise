import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Sparkles, SlidersHorizontal, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react-native';

import { fetchExchangeRates, calculateTripCost } from '../../utils/costEngine';
import { ConfigurationPanel } from '../../components/budget/ConfigurationPanel';
import { BudgetHero } from '../../components/budget/BudgetHero';
import { BudgetGrid } from '../../components/budget/BudgetGrid';
import { BudgetTimeline } from '../../components/budget/BudgetTimeline';
import { useTripContext } from '../../context/TripContext';

export default function BudgetScreen() {
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

      // If the AI generated perfect budget data, use it!
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
        // Fallback to local offline calculation engine if AI data is missing
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#030712' }}>
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Page Header */}
        <View className="flex flex-col gap-4 mb-4">
          <View className="flex flex-col gap-1">
            <View className="flex flex-row items-center gap-2 mb-1">
              <Sparkles size={14} color="#60a5fa" />
              <Text className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Smart Cost Engine</Text>
            </View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Budget <Text className="text-purple-400">Intelligence</Text>
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setConfigOpen(v => !v)}
              className="flex-1 flex flex-row items-center justify-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10"
            >
              <SlidersHorizontal size={14} color="#c084fc" />
              <Text className="text-white text-sm font-semibold">Configure</Text>
              <ChevronDown size={14} color="#9ca3af" style={{ transform: [{ rotate: configOpen ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCalculate}
              className="flex-1 flex flex-row items-center justify-center gap-2 px-3 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30"
            >
              <RefreshCw size={14} color="#93c5fd" />
              <Text className="text-blue-300 text-sm font-semibold">Calculate</Text>
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

        {/* Results Area */}
        {error ? (
          <Animated.View entering={FadeIn.duration(300)} className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-row items-center gap-4 mt-4">
            <AlertCircle size={20} color="#f87171" />
            <Text className="text-sm font-medium text-red-400 flex-1">{error}</Text>
          </Animated.View>
        ) : loading ? (
          <Animated.View entering={FadeIn.duration(300)} className="flex flex-col items-center justify-center py-20 gap-5 rounded-3xl bg-white/5 border border-white/10 mt-4">
            <ActivityIndicator size="large" color="#60a5fa" />
            <Text className="text-sm font-semibold text-white/40 tracking-widest uppercase">Crunching the numbers…</Text>
          </Animated.View>
        ) : costData && rates ? (
          <View className="flex flex-col gap-6 mt-2">
            <BudgetHero summary={costData.summary} inputs={inputs} rates={rates} lastUpdated={lastUpdated} />
            <BudgetGrid summary={costData.summary} breakdown={costData.dailyBreakdown} inputs={inputs} rates={rates} />
            <BudgetTimeline summary={costData.summary} breakdown={costData.dailyBreakdown} inputs={inputs} rates={rates} />
          </View>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}
