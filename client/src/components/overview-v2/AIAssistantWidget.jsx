import React, { useState, useRef } from 'react';
import { Sparkles, Send, Map, Wallet, MapPin, Box, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { LogoIcon } from '@/components/ui/Logo';
import { useTripContext } from '@/context/TripContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Spline from '@splinetool/react-spline';
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
      className={`relative p-4 sm:p-5 flex flex-col justify-between h-auto min-h-[300px] max-h-[450px] sm:max-h-none sm:h-[480px] rounded-[24px] sm:rounded-[32px] overflow-hidden ios-glass-card group cursor-pointer ${className}`}
    >
      <div className="flex flex-col gap-2 ios-3d-element flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 mb-3">
        
        <AnimatePresence mode="wait">
          {!chatResponse && !isLoading ? (
            <motion.div 
              key="default-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-1.5 sm:gap-2"
            >
              {/* Avatar & Greeting */}
              <div className="flex flex-col items-center gap-1.5 mt-0 mb-0">
                {/* 3D Genie Style Avatar */}
                <div className="relative group/avatar mt-1 mb-1">
                  {/* Mild Aurora */}
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-cyan-400/30 via-blue-500/30 to-purple-500/30 blur-[16px] -z-10 animate-pulse" />
                  <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full bg-gradient-to-b from-white/20 to-white/5 p-[1px] shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5b8cff] to-[#4d7fff] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.2)] border border-white/30 relative overflow-hidden group-active/avatar:scale-95 transition-transform duration-200">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover/avatar:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none z-30" />
                      <div className="absolute inset-[-24px] z-10 pointer-events-none scale-[0.65]">
                        <Spline scene="https://prod.spline.design/UP9ptfgAz0jjQwkK/scene.splinecode" />
                      </div>
                    </div>
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute top-1 right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 rounded-full border-2 border-[#1c1d29] shadow-[0_0_8px_rgba(52,211,153,0.8)] z-40" />
                </div>
                <div className="flex flex-col text-center bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-[16px] sm:rounded-[20px] py-1.5 px-3 sm:p-3 mx-2 hover:bg-white/10 transition-all duration-700 cursor-default group">
                  <h3 className="text-base sm:text-lg font-semibold tracking-tighter text-white group-hover:scale-105 transition-transform duration-700 mb-0 sm:mb-0.5 drop-shadow-md">Voyage Genie AI</h3>
                  <p className="text-white/60 text-[10px] sm:text-xs font-medium group-hover:text-white/80 transition-colors duration-700 leading-tight">
                    Hi! I'm Voyage Genie AI.<br />Ask me anything about your trip.
                  </p>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-col gap-1.5 sm:gap-2 mt-0 sm:mt-1 px-1 pb-1">
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 ml-1 mb-0">Suggested</span>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {suggestions.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(item.label)}
                      className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:p-2.5 rounded-[12px] sm:rounded-[14px] bg-white/5 hover:bg-white/10 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group transition-all duration-300"
                    >
                      <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] sm:text-[11px] font-medium text-white/80 group-hover:text-white transition-colors text-center leading-tight">
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
              <div className="p-4 rounded-[20px] bg-white/10 border border-white/20 text-sm text-white/90 leading-relaxed shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-white font-bold text-lg mt-3 mb-1" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-white font-bold text-base mt-3 mb-1" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-white font-semibold mt-2 mb-1" {...props} />,
                  }}
                >
                  {chatResponse}
                </ReactMarkdown>
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
