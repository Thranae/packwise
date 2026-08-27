import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';
import { useAssistant, REC_STATES } from '@/context/AssistantContext';
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';

export default function AIReasoningPanel() {
  const { currentRecommendation, recState } = useAssistant();

  if (!currentRecommendation || recState === REC_STATES.LOADING) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentRecommendation.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ delay: 0.2 }}
        className="w-full relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-[24px] blur-lg -z-10" />
        
        <div className="w-full p-5 rounded-[24px] bg-white/[0.04] backdrop-blur-xl border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">AI Insight</span>
          </div>
          
          <p className="text-[14px] leading-relaxed font-medium text-white/90">
            {currentRecommendation.reasoning}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
