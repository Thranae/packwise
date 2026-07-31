import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchExchangeRates, calculateTripCost } from '@/utils/costEngine';
import { Loader2, AlertCircle, Sparkles, RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ConfigurationPanel } from '@/components/budget/ConfigurationPanel';
import { BudgetHero } from '@/components/budget/BudgetHero';
import { BudgetGrid } from '@/components/budget/BudgetGrid';
import { BudgetTimeline } from '@/components/budget/BudgetTimeline';
import { useTripContext } from '@/context/TripContext';

export default function CostIntelligencePage() {
  const { currentTrip } = useTripContext();

  const [inputs, setInputs] = useState({
    originCountry: 'India',
    destCountry: currentTrip?.country || 'United States',
    days: currentTrip ? Math.max(1, Math.ceil((new Date(currentTrip.endDate) - new Date(currentTrip.startDate)) / 86400000)) : 5,
    travelers: currentTrip?.travelers || 2,
    travelStyle: currentTrip?.travelStyle?.toLowerCase().includes('luxury') ? 'luxury' : currentTrip?.travelStyle?.toLowerCase().includes('budget') ? 'budget' : 'standard',
    budgetType: 'balanced',
    transportation: 'public',
    accommodation: 'hotel',
  });

  const [costData, setCostData] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
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
        const getCat = (name) => bd.categories.find(c => c.name.toLowerCase().includes(name))?.amount || 0;
        
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
      
      // Ensure smooth loading animation transition
      await new Promise(r => setTimeout(r, 400));
      
      setCostData(costs);
    } catch (err) {
      setError(err.message || 'Failed to load cost estimates');
    } finally {
      setLoading(false);
    }
  }, [inputs, currentTrip]);

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="col-span-12 w-full max-w-5xl mx-auto flex flex-col gap-6 pb-20 px-4 pt-2 md:pt-6">

      {/* ✨ Page Header ✨ */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Smart Cost Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Budget <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Intelligence</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={() => setConfigOpen(v => !v)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>Configure</span>
            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${configOpen ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={handleCalculate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300 text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" /> <span>Calculate</span>
          </button>
        </div>
      </div>

      {/* ── Collapsible Config Panel ── */}
      <AnimatePresence>
        {configOpen && (
          <motion.div
            key="config"
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[100]"
          >
            <div className="py-2 px-1 relative z-[100]">
              <ConfigurationPanel
                inputs={inputs}
                setInputs={setInputs}
                onCalculate={handleCalculate}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results Area ── */}
      <AnimatePresence>
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>

        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-5 rounded-3xl bg-white/[0.04] border border-white/10"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
              </div>
              <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-white/40 tracking-widest uppercase animate-pulse">
              Crunching the numbers…
            </p>
          </motion.div>

        ) : costData && rates ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Hero card */}
            <BudgetHero
              summary={costData.summary}
              inputs={inputs}
              rates={rates}
              lastUpdated={lastUpdated}
            />

            {/* Stats grid */}
            <BudgetGrid
              summary={costData.summary}
              breakdown={costData.dailyBreakdown}
              inputs={inputs}
              rates={rates}
            />

            {/* Timeline */}
            <BudgetTimeline
              summary={costData.summary}
              breakdown={costData.dailyBreakdown}
              inputs={inputs}
              rates={rates}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

    </div>
  );
}
