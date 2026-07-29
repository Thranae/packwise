import React, { useState, useEffect } from 'react';
import { Bot, Map, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';
import { TripBuilderWizard } from '@/components/assistant/TripBuilderWizard';
import { AIChatInterface } from '@/components/assistant/AIChatInterface';

export default function AssistantPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'builder' ? 'builder' : 'chat';
  const [mode, setMode] = useState(initialMode);

  // Sync state with URL
  useEffect(() => {
    if (searchParams.get('mode') !== mode) {
      setSearchParams({ mode });
    }
  }, [mode, searchParams, setSearchParams]);

  return (
    <PageTransition className="col-span-12">
      <div className="min-h-[100dvh] px-4 sm:px-6 md:px-10 lg:px-12 pb-6 sm:pb-12 pt-6 flex flex-col items-start w-full relative z-10">
        
        {/* Unified Header & Segmented Control */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 z-20 relative">
          
          <div className="flex flex-col items-start">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md mb-2"
            >
              Planning Hub
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[13px] sm:text-[14.5px] font-medium text-white/60 tracking-wide whitespace-nowrap"
            >
              Chat with your assistant or build an itinerary step-by-step.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
          >
            <button
              onClick={() => setMode('chat')}
              className={`relative flex items-center gap-3 h-14 px-5 pr-7 rounded-full font-bold text-[14px] sm:text-[15px] tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 group ${
                mode === 'chat' ? 'text-white' : 'text-white/50 hover:text-white/90'
              }`}
            >
              {mode === 'chat' && (
                <motion.div 
                  layoutId="activeSegment"
                  className="absolute inset-0 bg-white/10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ios-liquid-button ${mode === 'chat' ? 'bg-blue-500/20 border-blue-400/30 shadow-[0_8px_16px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] scale-100' : 'bg-white/5 border-white/10 scale-90 opacity-70 group-hover:opacity-100 group-hover:scale-100 group-hover:border-blue-400/20 group-hover:bg-blue-500/10'}`}>
                <MessageSquare className={`w-5 h-5 transition-all duration-500 ${mode === 'chat' ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]' : 'text-white/50 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]'}`} />
              </div>
              <span>AI Chat</span>
            </button>

            <button
              onClick={() => setMode('builder')}
              className={`relative flex items-center gap-3 h-14 px-5 pr-7 rounded-full font-bold text-[14px] sm:text-[15px] tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 group ${
                mode === 'builder' ? 'text-white' : 'text-white/50 hover:text-white/90'
              }`}
            >
              {mode === 'builder' && (
                <motion.div 
                  layoutId="activeSegment"
                  className="absolute inset-0 bg-white/10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ios-liquid-button ${mode === 'builder' ? 'bg-emerald-500/20 border-emerald-400/30 shadow-[0_8px_16px_rgba(52,211,153,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] scale-100' : 'bg-white/5 border-white/10 scale-90 opacity-70 group-hover:opacity-100 group-hover:scale-100 group-hover:border-emerald-400/20 group-hover:bg-emerald-500/10'}`}>
                <Map className={`w-5 h-5 transition-all duration-500 ${mode === 'builder' ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'text-white/50 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`} />
              </div>
              <span>Trip Builder</span>
            </button>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="w-full relative z-10 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {mode === 'builder' ? (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1400px] flex-1 flex flex-col items-start"
              >
                <TripBuilderWizard />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl flex-1 flex flex-col items-center mx-auto"
              >
                <AIChatInterface />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </PageTransition>
  );
}
