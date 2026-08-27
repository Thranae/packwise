import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Plane, Briefcase, Sparkles } from 'lucide-react';
import { useAssistant, REC_STATES } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';

export default function QuickActions() {
  const { currentRecommendation, recState } = useAssistant();
  const { heavyTap, lightTap } = useHaptics();

  if (!currentRecommendation || recState === REC_STATES.LOADING) return null;

  return (
    <div className="w-full grid grid-cols-2 gap-3 mt-2">
      {/* Primary Action */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => heavyTap()}
        className="col-span-2 w-full py-4 rounded-[20px] bg-white text-black font-bold text-sm tracking-wide shadow-[0_8px_32px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 overflow-hidden relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <Sparkles className="w-4 h-4 text-purple-600" />
        Generate Itinerary
      </motion.button>

      {/* Secondary Actions */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => lightTap()}
        className="w-full py-3 rounded-[16px] bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white font-semibold text-[13px] flex items-center justify-center gap-2"
      >
        <Plane className="w-4 h-4 text-blue-400" />
        Check Flights
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => lightTap()}
        className="w-full py-3 rounded-[16px] bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white font-semibold text-[13px] flex items-center justify-center gap-2"
      >
        <Briefcase className="w-4 h-4 text-amber-400" />
        Packing List
      </motion.button>
    </div>
  );
}
