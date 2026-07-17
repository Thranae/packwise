import React, { useState, useEffect } from 'react';
import { fetchExchangeRates, calculateTripCost } from '@/utils/costEngine';
import { Loader2, AlertCircle, Sparkles, RefreshCw, Bell, Moon, ChevronDown } from 'lucide-react';
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

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const exchangeRates = await fetchExchangeRates();
      setRates(exchangeRates);
      setLastUpdated(Date.now());
      
      const costs = calculateTripCost(
        inputs.originCountry,
        inputs.destCountry,
        inputs.days,
        inputs.travelers,
        inputs.travelStyle
      );
      setCostData(costs);
    } catch (err) {
      setError(err.message || 'Failed to load cost estimates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial load only. Recalculates on button click via ConfigurationPanel.

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8 pb-12">
      
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-extrabold text-white tracking-tight flex items-center gap-2">
            Smart Travel Cost Engine <Sparkles className="w-5 h-5 text-purple-500" />
          </h1>
          <p className="text-gray-300 text-[11px] font-medium">AI-Powered Budget Estimation for Your Trip</p>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-bold">
           <button onClick={handleCalculate} className="flex items-center gap-2 text-white/80 bg-[#121826] hover:bg-white/5 border border-white/5 px-3 py-1.5 rounded-full shadow-sm transition-colors active:scale-95">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Rates
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[32%_68%] gap-8 items-start relative">
        
        {/* LEFT COLUMN: Configuration Panel */}
        <div className="w-full relative h-full">
           <ConfigurationPanel inputs={inputs} setInputs={setInputs} onCalculate={handleCalculate} />
        </div>

        {/* RIGHT COLUMN: Dashboard UI */}
        <div className="w-full flex flex-col">
          {error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : loading && !costData ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-gray-300 bg-[rgba(255,255,255,0.08)] backdrop-blur-[30px] saturate-180 border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.15)] rounded-3xl hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] hover:bg-[rgba(255,255,255,0.12)] hover:border-white/20 transition-all duration-700">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium animate-pulse">Calculating AI budget...</p>
            </div>
          ) : costData && rates ? (
            <>
              <BudgetHero 
                summary={costData.summary}
                inputs={inputs}
                rates={rates}
                lastUpdated={lastUpdated}
              />
              
              <BudgetGrid 
                summary={costData.summary}
                breakdown={costData.dailyBreakdown}
                inputs={inputs}
                rates={rates}
              />

              <BudgetTimeline
                summary={costData.summary}
                breakdown={costData.dailyBreakdown}
                inputs={inputs}
                rates={rates}
              />
            </>
          ) : null}
        </div>
        
      </div>

    </div>
  );
}

