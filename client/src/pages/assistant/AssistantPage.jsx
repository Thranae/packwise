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
      <div className="h-full min-h-0 px-4 sm:px-6 md:px-10 lg:px-12 pb-[90px] sm:pb-12 pt-[calc(24px+env(safe-area-inset-top))] md:pt-6 flex flex-col items-center justify-center w-full relative z-10">
        
        {/* Dynamic Background to match the chat aesthetic but highly performant */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021] to-[#040812] -z-10" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none -z-10" />

        {/* Content Area */}
        <div className="w-full relative z-10 flex-1 flex flex-col min-h-0 items-center justify-center max-w-5xl mx-auto py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1 flex flex-col items-center justify-center"
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
