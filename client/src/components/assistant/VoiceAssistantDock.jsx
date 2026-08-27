import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Sparkles } from 'lucide-react';
import { useHaptics } from '@/hooks/useHaptics';

export default function VoiceAssistantDock() {
  const [state, setState] = useState('idle'); // idle, listening, recognizing, thinking, responding
  const [inputText, setInputText] = useState('');
  const { heavyTap, lightTap } = useHaptics();

  // Mock State Machine Transitions
  useEffect(() => {
    let timer;
    if (state === 'listening') {
      timer = setTimeout(() => setState('recognizing'), 3000);
    } else if (state === 'recognizing') {
      setInputText('Plan a 5 day trip to Paris');
      timer = setTimeout(() => setState('thinking'), 1000);
    } else if (state === 'thinking') {
      timer = setTimeout(() => setState('idle'), 2500); // Back to idle after response
    }
    return () => clearTimeout(timer);
  }, [state]);

  const handleMicTap = () => {
    heavyTap();
    if (state === 'idle') {
      setState('listening');
      setInputText('');
    } else {
      setState('idle');
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.8 }}
      className="fixed bottom-[90px] left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none flex justify-center"
    >
      <div className="pointer-events-auto relative flex flex-col items-center justify-center w-full max-w-md">
        
        <AnimatePresence mode="wait">
          {state !== 'idle' && (
            <motion.div
              key="prompt-bubble"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-[70px] px-6 py-4 rounded-[24px] bg-white/[0.08] backdrop-blur-3xl border border-white/20 shadow-2xl w-[90%] flex flex-col items-center gap-2"
            >
              {state === 'listening' && (
                <div className="flex items-center gap-1.5 h-6">
                  {[1,2,3,4,5].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['4px', '20px', '4px'] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 bg-blue-400 rounded-full"
                    />
                  ))}
                </div>
              )}
              {state === 'recognizing' && (
                <p className="text-white/90 font-medium text-center">{inputText}</p>
              )}
              {state === 'thinking' && (
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold text-sm">Genie is thinking...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dock Bar */}
        <motion.div 
          layout
          className="h-[60px] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full px-2 flex items-center justify-between shadow-[0_16px_32px_rgba(0,0,0,0.5)] w-full"
        >
          <div className="flex-1 flex items-center px-4 h-full">
            <span className="text-white/40 text-[15px] font-medium tracking-wide">Ask anything...</span>
          </div>
          
          <button
            onClick={handleMicTap}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              state !== 'idle' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white text-black shadow-lg'
            }`}
          >
            {state !== 'idle' ? (
              <X className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
