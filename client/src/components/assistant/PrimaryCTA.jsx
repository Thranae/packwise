import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { useAssistant } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';
import { aiService } from '@/services/aiService';

export default function PrimaryCTA() {
  const { currentRecommendation, setItinerary, addChatMessage } = useAssistant();
  const { heavyTap } = useHaptics();
  const [state, setState] = useState('idle');

  const handleGenerate = async () => {
    if (!currentRecommendation || state === 'loading') return;
    heavyTap();
    setState('loading');

    const dest = currentRecommendation.city;
    const days = parseInt(currentRecommendation.duration) || 7;

    try {
      const result = await aiService.generateItinerary(dest, days);
      if (result?.data) {
        setItinerary(result.data);
        addChatMessage('assistant', `I've generated a ${days}-day itinerary for ${dest}! Check it out in your trips.`);
      }
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      addChatMessage('assistant', `Couldn't generate the itinerary right now. Please try again.`);
      setState('idle');
    }
  };

  return (
    <motion.button
      whileTap={{ scale: state === 'loading' ? 1 : 0.97 }}
      onClick={handleGenerate}
      disabled={state === 'loading'}
      className={`relative w-full h-[56px] rounded-[18px] font-bold text-[16px] tracking-wide overflow-hidden flex items-center justify-center gap-2 transition-all duration-300 ${
        state === 'done'
          ? 'bg-emerald-500 text-white shadow-[0_6px_24px_rgba(16,185,129,0.25)]'
          : state === 'loading'
            ? 'bg-white/80 text-black/60'
            : 'ios-liquid-button text-white shadow-[0_6px_24px_rgba(255,255,255,0.12)] active:shadow-[0_2px_8px_rgba(255,255,255,0.08)]'
      }`}
    >
      <AnimatePresence mode="wait">
        {state === 'loading' ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </motion.div>
        ) : state === 'done' ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>Itinerary Ready!</span>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Sparkles className="w-[18px] h-[18px] text-purple-600" />
            <span>Generate Itinerary</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
