import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Bot } from 'lucide-react';
import { useAssistant, AI_STATES } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';

export default function AssistantOrb({ size = 'small', interactive = false }) {
  const { aiState, changeAiState } = useAssistant();
  const { heavyTap } = useHaptics();

  const handlePress = () => {
    if (!interactive) return;
    heavyTap();
    
    // Toggle listening state manually for demo purposes
    if (aiState === AI_STATES.IDLE || aiState === AI_STATES.SPEAKING) {
      changeAiState(AI_STATES.LISTENING);
      
      // Simulate listening then thinking
      setTimeout(() => {
        changeAiState(AI_STATES.THINKING);
        setTimeout(() => {
          changeAiState(AI_STATES.IDLE);
        }, 2000);
      }, 3000);
    } else {
      changeAiState(AI_STATES.IDLE);
    }
  };

  const getOrbState = () => {
    switch (aiState) {
      case AI_STATES.LISTENING:
        return {
          scale: [1, 1.2, 1],
          opacity: 1,
          boxShadow: ['0 0 20px #3b82f6', '0 0 50px #8b5cf6', '0 0 20px #3b82f6'],
          transition: { duration: 1.5, repeat: Infinity }
        };
      case AI_STATES.THINKING:
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 180, 360],
          opacity: 1,
          boxShadow: '0 0 30px #10b981',
          transition: { duration: 2, repeat: Infinity, ease: "linear" }
        };
      case AI_STATES.SPEAKING:
        return {
          scale: [1, 1.1, 1.05, 1.15, 1],
          opacity: 1,
          boxShadow: '0 0 40px #ec4899',
          transition: { duration: 0.8, repeat: Infinity }
        };
      default: // IDLE
        return {
          scale: 1,
          rotate: 0,
          opacity: 0.8,
          boxShadow: '0 0 15px rgba(255,255,255,0.2)',
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
        };
    }
  };

  const orbSize = size === 'large' ? 'w-24 h-24' : 'w-14 h-14';
  const iconSize = size === 'large' ? 'w-8 h-8' : 'w-5 h-5';

  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        onClick={handlePress}
        className={`${orbSize} rounded-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black border border-white/20 relative z-10 overflow-hidden`}
        whileTap={interactive ? { scale: 0.9 } : {}}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 via-purple-500/40 to-emerald-500/40 blur-md"
          animate={getOrbState()}
        />
        <div className="relative z-20 text-white drop-shadow-md">
          {aiState === AI_STATES.LISTENING ? (
            <Mic className={`${iconSize} animate-pulse text-purple-300`} />
          ) : (
            <Bot className={`${iconSize} ${aiState !== AI_STATES.IDLE ? 'text-white' : 'text-white/60'}`} />
          )}
        </div>
      </motion.button>
    </div>
  );
}
