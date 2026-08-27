import React from 'react';
import { Bot, Sparkles, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAssistant, AI_STATES } from '@/context/AssistantContext';

export default function AssistantHeader() {
  const { aiState } = useAssistant();

  const getStatusText = () => {
    switch (aiState) {
      case AI_STATES.LISTENING: return "Listening...";
      case AI_STATES.THINKING: return "Analyzing preferences...";
      case AI_STATES.SPEAKING: return "Recommending...";
      case AI_STATES.LOADING: return "Connecting to AI...";
      default: return "Ready";
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-6 pt-[calc(16px+var(--safe-top))] pb-4 shrink-0 bg-transparent z-50">
      <div className="flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <div className="relative flex items-center justify-center w-6 h-6">
            {aiState !== AI_STATES.IDLE && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-blue-500/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <Bot className={`w-5 h-5 relative z-10 ${aiState !== AI_STATES.IDLE ? 'text-blue-400' : 'text-white'}`} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-['Outfit']">PackWise AI</h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-1.5 mt-1"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${aiState !== AI_STATES.IDLE ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-[11px] font-medium text-white/60 tracking-wider uppercase">{getStatusText()}</span>
        </motion.div>
      </div>

      <button className="w-10 h-10 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/10 active:scale-95 transition-all text-white">
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
}
