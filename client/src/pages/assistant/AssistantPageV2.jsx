import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { AssistantProvider, useAssistant, AI_STATES, REC_STATES } from '@/context/AssistantContext';
import { RecommendationEngine } from '@/services/RecommendationEngine';
import { useHaptics } from '@/hooks/useHaptics';

import HeroDestinationCard from '@/components/assistant/HeroDestinationCard';
import FilterChipCarousel from '@/components/assistant/FilterChipCarousel';
import PromptBar from '@/components/assistant/PromptBar';
import SuggestedPrompts from '@/components/assistant/SuggestedPrompts';
import AIInsightCard from '@/components/assistant/AIInsightCard';
import PrimaryCTA from '@/components/assistant/PrimaryCTA';
import QuickActionGrid from '@/components/assistant/QuickActionGrid';
import RecommendedDestinations from '@/components/assistant/RecommendedDestinations';
import ChatHistory from '@/components/assistant/ChatHistory';
import ItinerarySheet from '@/components/assistant/ItinerarySheet';

function AssistantOrchestrator() {
  const {
    changeAiState, updateRecommendation, recState,
    userPreferences, sessionHistory, activeFilter
  } = useAssistant();
  const { heavyTap } = useHaptics();

  const loadRecommendation = useCallback(async (filter) => {
    changeAiState(AI_STATES.THINKING);
    try {
      const rec = await RecommendationEngine.generateRecommendation(
        userPreferences, sessionHistory, filter
      );
      updateRecommendation(rec);
      heavyTap();
    } catch {
      changeAiState(AI_STATES.ERROR);
    }
  }, [changeAiState, updateRecommendation, userPreferences, sessionHistory, heavyTap]);

  useEffect(() => {
    loadRecommendation(null);
  }, []);

  useEffect(() => {
    if (activeFilter !== null) {
      loadRecommendation(activeFilter);
    }
  }, [activeFilter]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden relative">
      <AnimatePresence mode="wait">
        {recState === REC_STATES.LOADING ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex-1 flex items-center justify-center"
          >
            <div className="w-10 h-10 border-2 border-white/15 border-t-white/70 rounded-full animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex flex-col w-full pb-8">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 180 }}
              >
                <HeroDestinationCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', damping: 25, delay: 0.1 }}
                className="mt-4"
              >
                <FilterChipCarousel />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, delay: 0.15 }}
                className="mt-5 px-4"
              >
                <PromptBar />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', damping: 25, delay: 0.2 }}
                className="mt-3"
              >
                <SuggestedPrompts />
              </motion.div>

              <div className="px-4">
                <ChatHistory />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, delay: 0.25 }}
                className="mt-5 px-4"
              >
                <AIInsightCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 22, delay: 0.3 }}
                className="mt-5 px-4"
              >
                <PrimaryCTA />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-5 px-4"
              >
                <QuickActionGrid />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, delay: 0.4 }}
                className="mt-6"
              >
                <RecommendedDestinations />
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ItinerarySheet />
    </div>
  );
}

export default function AssistantPageV2() {
  return (
    <AssistantProvider>
      <PageTransition className="col-span-1 lg:col-span-12 h-full flex flex-col min-h-0 relative bg-transparent">
        <AssistantOrchestrator />
      </PageTransition>
    </AssistantProvider>
  );
}
