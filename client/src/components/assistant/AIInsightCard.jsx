import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { useAssistant, REC_STATES } from '@/context/AssistantContext';

export default function AIInsightCard() {
  const { currentRecommendation, recState } = useAssistant();

  if (!currentRecommendation || recState === REC_STATES.LOADING) return null;

  const highlights = currentRecommendation.highlights || ['Great Nightlife', 'Cultural Hub', 'Foodie Paradise'];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentRecommendation.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="w-full relative"
      >
        <div className="w-full p-5 rounded-[28px] ios-glass-card bg-black/30 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col gap-3 relative overflow-hidden">

          {/* Top edge highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">AI Insight</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20">
              <Zap className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">High Match</span>
            </div>
          </div>

          {/* Reasoning */}
          <p className="text-[14px] leading-[1.55] font-medium text-white/85">
            {currentRecommendation.reasoning}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {highlights.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-[8px] bg-white/[0.04] border border-white/[0.08] text-[10px] font-semibold text-white/55">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
