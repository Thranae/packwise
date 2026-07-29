import React, { useState, useRef } from 'react';
import { Sparkles, Send, Map, Wallet, MapPin, Box, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { LogoIcon } from '@/components/ui/Logo';
import { useTripContext } from '@/context/TripContext';
import api from '@/services/api';

export const AIAssistantWidget = ({ className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 4, stiffness: 250, damping: 25 });
  const { currentTrip } = useTripContext();

  const suggestions = [
    { icon: Map, label: "Optimize itinerary" },
    { icon: MapPin, label: "Find restaurants" },
    { icon: Wallet, label: "Reduce budget" },
    { icon: Box, label: "Packing help" },
  ];

  const handleSend = async (text = inputValue) => {
    if (!text.trim() || isLoading) return;
    setInputValue("");
    setChatResponse(null);
    setIsLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: text, context: currentTrip });
      const reply = res.data?.reply;
      setChatResponse(reply || 'I received your message but couldn\'t generate a detailed response. Please try again!');
    } catch (err) {
      console.error('AI Widget error:', err);
      setChatResponse('Sorry, I\'m having trouble connecting right now. Please try again in a moment!');
    } finally {
      setIsLoading(false);
    }
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
      className={`relative p-4 sm:p-5 flex flex-col justify-between h-[400px] sm:h-[600px] rounded-[24px] sm:rounded-[32px] overflow-hidden ios-glass-card group cursor-pointer ${className}`}
    >
      <div className="flex flex-col gap-2 ios-3d-element flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 mb-3">
        
        <AnimatePresence mode="wait">
          {!chatResponse && !isLoading ? (
            <motion.div 
              key="default-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {/* Avatar & Greeting */}
              <div className="flex flex-col items-center gap-2 mt-0 mb-1">
                <div className="relative w-12 h-12 rounded-[16px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center group-hover:bg-white/10 transition-all duration-700 backdrop-blur-xl">
                  <Sparkles className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" />
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#1c1d29] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="flex flex-col text-center bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[20px] p-3 mx-2 hover:bg-white/10 transition-all duration-700 cursor-default group">
                  <h3 className="text-lg font-semibold tracking-tighter text-white group-hover:scale-105 transition-transform duration-700 mb-0.5 drop-shadow-md">Voyage Genie AI</h3>
                  <p className="text-white/60 text-xs font-medium group-hover:text-white/80 transition-colors duration-700">
                    Hi! I'm Voyage Genie AI.<br />Ask me anything about your trip.
                  </p>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-col gap-2 mt-1 px-1 pb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 ml-1 mb-0.5">Suggested</span>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(item.label)}
                      className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-[14px] bg-white/5 hover:bg-white/10 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group transition-all duration-300"
                    >
                      <item.icon className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors text-center leading-tight">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : isLoading ? (
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
      <div className="shrink-0 mt-auto pt-1 ios-3d-element">
        <div className={`
          relative flex items-center w-full rounded-[16px] sm:rounded-[20px] h-[48px] sm:h-[56px]
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
            disabled={isLoading}
            className="w-full h-full bg-transparent border-none outline-none text-white placeholder-white/40 px-5 font-medium text-[13px]"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading}
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
