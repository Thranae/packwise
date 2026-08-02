import React, { useState } from 'react';
import { Bot, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { TripBuilderWizard } from '@/components/assistant/TripBuilderWizard';
import UpgradeModal from '@/components/premium/UpgradeModal';
import { usePremium } from '@/context/PremiumContext';

export default function AssistantPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isPremium } = usePremium();

  return (
    <PageTransition className="col-span-1 lg:col-span-12 h-full flex flex-col min-h-0">
      <div className="h-full min-h-0 px-4 sm:px-6 md:px-10 lg:px-12 pb-[90px] sm:pb-12 pt-[calc(24px+env(safe-area-inset-top))] md:pt-6 flex flex-col items-start w-full relative z-10">
        
        {/* Unified Header & Segmented Control */}
        <div className="w-full max-w-[960px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-8 z-20 relative shrink-0">
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md mb-2 flex items-center gap-3"
            >
              <Map className="w-8 h-8 text-blue-400" /> Planning Hub
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[13px] sm:text-[14.5px] font-medium text-white/60 tracking-wide whitespace-nowrap"
            >
              Build your perfect itinerary step-by-step with AI.
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            {!isPremium && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowUpgradeModal(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.5)] transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Go Premium</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full relative z-10 flex-1 flex flex-col min-h-0 items-center justify-center pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[1400px] flex-1 flex flex-col items-center justify-center"
            >
              <TripBuilderWizard />
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </PageTransition>
  );
}
