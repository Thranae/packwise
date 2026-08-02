import React, { useState, useEffect, useRef } from 'react';
import { Bot, ArrowUp, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTripContext } from '@/context/TripContext';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useHaptics } from '@/hooks/useHaptics';

export const TripBuilderWizard = () => {
  const navigate = useNavigate();
  const { generateTrip, isGenerating, loadingStep } = useTripContext();
  const { playSound } = useSoundEffect();
  const { lightTap, successTap } = useHaptics();
  
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm Voyage Genie. Where would you like to travel, and for how many days?", type: 'text' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tripData, setTripData] = useState({ prompt: '' });
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isGenerating]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    lightTap();
    playSound('tap');
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg, type: 'text' }]);
    setInputValue('');
    setIsTyping(true);
    
    // Simple AI simulation logic
    setTimeout(() => {
      setIsTyping(false);
      playSound('success');
      
      const count = messages.filter(m => m.role === 'user').length;
      
      if (count === 0) {
        setMessages(prev => [...prev, { role: 'ai', text: "Sounds amazing! Do you have a specific budget in mind? Are there any specific activities you love?", type: 'text' }]);
        setTripData(prev => ({ ...prev, prompt: userMsg }));
      } else if (count === 1) {
        setMessages(prev => [...prev, { role: 'ai', text: "Perfect! I have enough details to craft a spectacular itinerary for you. Shall we build it now?", type: 'action' }]);
        setTripData(prev => ({ ...prev, prompt: prev.prompt + " " + userMsg }));
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "I've noted that down too! Ready to generate when you are.", type: 'action' }]);
        setTripData(prev => ({ ...prev, prompt: prev.prompt + " " + userMsg }));
      }
    }, 1200);
  };

  const handleGenerate = async () => {
    lightTap();
    playSound('tap');
    
    const fullPrompt = tripData.prompt || "Surprise me with a great trip!";
    await generateTrip(fullPrompt, { duration: 7 }); // Default duration if not parsed
    
    successTap();
    playSound('success');
    navigate(ROUTES.TRIPS, { state: { generatingTrip: true, destination: "Your Custom Trip" } });
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center relative h-full w-full min-h-[400px]">
        <motion.div 
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center w-28 h-28 mb-8 rounded-[32px] bg-white/[0.02] border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)]"
        >
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" style={{ animationDuration: '2s' }} />
             <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
             <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
        </motion.div>
        
        <h3 className="text-[14px] font-bold tracking-[0.3em] uppercase text-white/90 drop-shadow-lg animate-pulse">
          {loadingStep || 'Crafting Journey...'}
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto h-[60vh] sm:h-[70vh] flex flex-col bg-[#050B14]/80 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.05)] overflow-hidden">
      
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-white/10 flex items-center px-6 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-white tracking-wide">Voyage Genie</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">AI Travel Assistant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex items-end gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-white/10' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white/70" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3.5 rounded-[20px] text-[14.5px] leading-relaxed shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white/[0.05] border border-white/10 text-white/90 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>

                {msg.type === 'action' && (
                  <button 
                    onClick={handleGenerate}
                    className="mt-2 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    Generate Itinerary Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-end gap-3 self-start"
            >
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-5 py-4 rounded-[20px] rounded-bl-sm bg-white/[0.05] border border-white/10 flex items-center gap-1.5">
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-5 shrink-0 bg-white/[0.01] border-t border-white/10">
        <div className="relative flex items-center bg-[#030712]/60 border border-white/15 rounded-full p-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus-within:border-white/30 focus-within:bg-[#030712]/80 transition-all">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your dream trip..."
            className="flex-1 h-12 bg-transparent text-white px-5 outline-none placeholder-white/30 text-[15px]"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition-all text-white border border-white/10"
          >
            <ArrowUp className="w-5 h-5 drop-shadow-md" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TripBuilderWizard;
