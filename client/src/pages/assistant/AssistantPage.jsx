import React, { useState } from 'react';
import { Bot, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { TripBuilderWizard } from '@/components/assistant/TripBuilderWizard';
import UpgradeModal from '@/components/premium/UpgradeModal';
import { usePremium } from '@/context/PremiumContext';
import AssistantIntro from '@/components/assistant/AssistantIntro';

export default function AssistantPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [swipedDestination, setSwipedDestination] = useState("");
  const { isPremium } = usePremium();

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100]"
          >
            <AssistantIntro onStart={(dest) => {
              if (dest && dest.city) {
                setSwipedDestination(`${dest.city}, ${dest.country}`);
              }
              setShowIntro(false);
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      <PageTransition className="col-span-1 lg:col-span-12 h-full flex flex-col min-h-0 relative">
        <div className="h-full min-h-0 px-3 sm:px-6 md:px-10 pb-2 pt-[calc(8px+var(--safe-top))] md:pt-4 flex flex-col items-start w-full relative z-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Compact Header */}
        <div className="w-full max-w-[700px] mx-auto flex items-center justify-between gap-3 mb-3 z-20 relative shrink-0">
          
          <div className="flex flex-col">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md flex items-center gap-2"
            >
              <Map className="w-6 h-6 text-blue-400" /> Planning Hub
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[12px] sm:text-[13px] font-medium text-white/50 tracking-wide"
            >
              Build your perfect itinerary step-by-step.
            </motion.p>
          </div>

          {!isPremium && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowUpgradeModal(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.5)] transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Premium</span>
            </motion.button>
          )}
        </div>

        {/* Content Area */}
        <div className="w-full relative z-10 flex-1 flex flex-col min-h-0 items-center justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1 flex flex-col items-center"
            >
              <TripBuilderWizard initialDestination={swipedDestination} />
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </PageTransition>
    </>
  );
}
