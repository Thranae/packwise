import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchExchangeRates, calculateTripCost } from '@/utils/costEngine';
import { Loader2, AlertCircle, Sparkles, RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ConfigurationPanel } from '@/components/budget/ConfigurationPanel';
import { BudgetHero } from '@/components/budget/BudgetHero';
import { BudgetGrid } from '@/components/budget/BudgetGrid';
import { BudgetTimeline } from '@/components/budget/BudgetTimeline';

export default function CostIntelligencePage() {
  const [inputs, setInputs] = useState({
    originCountry: 'India',
    destCountry: 'United States',
    days: 5,
    travelers: 2,
    travelStyle: 'standard',
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

      const costs = calculateTripCost(
        inputs.destCountry,
        inputs.days,
        inputs.travelers,
        inputs.travelStyle
      );
      
      // Ensure smooth loading animation transition
      await new Promise(r => setTimeout(r, 400));
      
      setCostData(costs);
    } catch (err) {
      setError(err.message || 'Failed to load cost estimates');
    } finally {
      setLoading(false);
    }
  }, [inputs]);

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="col-span-12 w-full max-w-5xl mx-auto flex flex-col gap-6 pb-20 px-4 pt-6">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Smart Cost Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Budget <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Intelligence</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfigOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            Configure
            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${configOpen ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={handleCalculate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300 text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Calculate
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
