import React, { useState, useRef } from 'react';
import { Sparkles, Send, Map, Wallet, MapPin, Box, Bot, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useAI } from '@/hooks/useAI';
import { useTripContext } from '@/context/TripContext';

export const AIAssistantWidget = ({ className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 4, stiffness: 250, damping: 25 });
  const { chatAssistant, loading } = useAI();
  const { currentTrip } = useTripContext();

  const suggestions = [
    { icon: Map, label: "Optimize itinerary" },
    { icon: MapPin, label: "Find restaurants" },
    { icon: Wallet, label: "Reduce budget" },
    { icon: Box, label: "Packing help" },
  ];

  const handleSend = async (text = inputValue) => {
    if (!text.trim() || loading) return;
    setInputValue("");
    setChatResponse(null);
    const response = await chatAssistant(text, currentTrip);
    setChatResponse(response);
  };

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`relative p-5 flex flex-col justify-between h-[600px] rounded-[32px] overflow-hidden ios-glass-card group cursor-pointer ${className}`}
    >
      <div className="flex flex-col gap-2 ios-3d-element h-[480px] overflow-y-auto custom-scrollbar pr-2">
        
        <AnimatePresence mode="wait">
          {!chatResponse && !loading ? (
            <motion.div 
              key="default-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {/* Avatar & Greeting */}
              <div className="flex flex-col items-center gap-2 mt-0 mb-1">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/30 shadow-[0_4px_24px_rgba(168,85,247,0.5)] ios-3d-icon">
                  <Bot className="w-7 h-7 text-white drop-shadow-lg" />
                  <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1c1d29] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="flex flex-col text-center bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[20px] p-3 mx-2 hover:bg-white/10 transition-all duration-700 cursor-default group">
                  <h3 className="text-lg font-semibold tracking-tighter text-white group-hover:scale-105 transition-transform duration-700 mb-0.5 drop-shadow-md">Voyage Genie AI</h3>
                  <p className="text-white/60 text-xs font-medium group-hover:text-white/80 transition-colors duration-700">
                    Hi! I'm Voyage Genie AI.<br />Ask me anything about your trip.
                  </p>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-col gap-3 mt-2 px-1 pb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 ml-1">Suggested</span>
                {suggestions.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(item.label)}
                    className="flex items-center gap-3 w-full p-3 rounded-[16px] ios-liquid-button group"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shrink-0">
                      <item.icon className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-3 text-white/50"
            >
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="text-xs font-medium uppercase tracking-widest">AI is thinking...</span>
            </motion.div>
          ) : (
            <motion.div 
              key="chat-response"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              <button 
                onClick={() => setChatResponse(null)}
                className="self-start flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors mb-2"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
              <div className="p-4 rounded-[20px] bg-white/10 border border-white/20 text-sm text-white/90 leading-relaxed shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                {chatResponse}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Input */}
      <div className="shrink-0 mt-auto pt-3 ios-3d-element">
        <div className={`
          relative flex items-center w-full rounded-[20px] h-[56px]
          bg-white/5 backdrop-blur-md
          border border-white/10
          transition-all duration-700
          ${isFocused ? 'bg-white/10 border-purple-400/50 shadow-[0_12px_32px_rgba(168,85,247,0.25),inset_0_1px_2px_rgba(255,255,255,0.2)] -translate-y-1' : 'hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'}
        `}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Voyage Genie AI..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={loading}
            className="w-full h-full bg-transparent border-none outline-none text-white placeholder-white/40 px-5 font-medium text-[13px]"
          />
          <button 
            onClick={() => handleSend()}
            disabled={loading}
            className={`
            absolute right-2 w-9 h-9 flex items-center justify-center rounded-full
            transition-all duration-700
            ${isFocused ? 'bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.6)] scale-105' : 'bg-white/10 hover:bg-white/20 text-white/50 hover:text-white'}
          `}>
            <Send className={`w-3.5 h-3.5 ${isFocused ? 'text-white translate-x-px -translate-y-px' : ''}`} />
          </button>
        </div>
      </div>

    </motion.div>
  );
};
