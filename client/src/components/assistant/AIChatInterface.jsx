import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Search, MapPin, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripContext } from '@/context/TripContext';
import { useNavigate } from 'react-router-dom';

export const AIChatInterface = () => {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi Thranae! I'm your personal Voyage Genie AI. Where are we dreaming of going today? Ask me about flights, itineraries, or packing lists!",
      suggestions: ['Plan a weekend getaway to Paris', 'What should I pack for Tokyo?', 'Find hidden gems in Rome']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  
  const { currentTrip, generateTrip } = useTripContext();
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate 5 seconds of typing delay before making the request
      await new Promise(resolve => setTimeout(resolve, 5000));

      const res = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          context: { 
            previousMessages: messages.map(m => m.content).join('\n'),
            currentTrip: currentTrip ? { destination: currentTrip.destination, status: currentTrip.status } : null
          }
        })
      });
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botReply = '';
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      setIsLoading(false); // Stop the loading animation immediately, we are streaming now

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.choices[0]?.delta?.content || '';
              botReply += text;
              
              // Check for action tag incrementally
              const actionMatch = botReply.match(/\[ACTION:\s*GENERATE_TRIP\s*\|\s*destination:\s*([^\]]+)\]/i);
              
              if (actionMatch && !isExecutingAction) {
                const destination = actionMatch[1].trim();
                setIsExecutingAction(true);
                // Remove the tag from the visible reply
                botReply = botReply.replace(actionMatch[0], '').trim();
                
                // Trigger the generation
                setTimeout(async () => {
                   setMessages(prev => [...prev, { role: 'assistant', content: `Generating your trip to ${destination}...` }]);
                   await generateTrip(`Destination: ${destination}`);
                   navigate('/trips');
                }, 500);
              }

              setMessages(prev => {
                const newMsgs = [...prev];
                // Don't show the raw tag to the user while streaming
                newMsgs[newMsgs.length - 1].content = botReply.replace(/\[ACTION:.*$/i, '').trim();
                return newMsgs;
              });
            } catch (e) {
              console.error("Stream parse error", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops, something went wrong on my end. Please make sure my AI integration is active!",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 1 || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col flex-1 h-full min-h-[300px] w-full max-w-4xl overflow-hidden relative bg-white/[0.03] backdrop-blur-[40px] rounded-[24px] sm:rounded-[40px] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] transition-shadow duration-700 z-10"
    >
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-[16px] bg-white/5 border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
            {/* Reactive AI Core Orb */}
            <motion.div 
              animate={{ 
                scale: isLoading ? [1, 1.2, 1] : [1, 1.05, 1],
                opacity: isLoading ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4],
                rotate: isLoading ? 360 : 0
              }}
              transition={{ 
                duration: isLoading ? 1.5 : 4, 
                repeat: Infinity, 
                ease: isLoading ? "easeInOut" : "linear" 
              }}
              className={`absolute inset-2 rounded-full blur-[8px] ${isLoading ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500' : 'bg-gradient-to-r from-blue-400/50 to-purple-500/50'}`}
            />
            <div className="absolute w-4 h-4 bg-white/80 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10" />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-[#060b14] rounded-full z-20 ${isLoading ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white drop-shadow-md">Voyage Genie AI</h2>
            <p className="text-sm font-medium text-white/50">Always active and ready to plan.</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <button className="w-10 h-10 rounded-[14px] ios-liquid-button flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-[14px] ios-liquid-button flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 z-10 relative scrollbar-hide">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, mass: 0.8 }}
            className="flex flex-col max-w-[90%] self-start items-start"
          >
            <div className="flex items-center gap-3 mb-2 px-1">
              {msg.role === 'user' ? (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">YOU</div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md"><Sparkles className="w-3.5 h-3.5" /></div>
              )}
              <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">
                {msg.role === 'user' ? 'You' : 'Voyage Genie AI'}
              </span>
            </div>
            <div className={`p-5 shadow-xl text-left ${
              msg.role === 'user' 
                ? 'rounded-[24px] bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-400/30 text-white rounded-tl-sm' 
                : 'rounded-[24px] ios-glass-card border border-white/10 text-white rounded-tl-sm'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap text-[15px] font-medium">{msg.content}</p>
            </div>
            
            {/* Suggestions */}
            {msg.suggestions && (
              <div className="flex flex-wrap gap-2 mt-4">
                {msg.suggestions.map((sug, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(sug)}
                    className="px-4 py-2.5 rounded-[16px] ios-liquid-button text-[13px] font-bold text-white/70 hover:text-white transition-colors text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex flex-col max-w-[90%] self-start items-start"
            >
              <div className="px-5 py-4 rounded-[24px] rounded-tl-sm bg-white/5 border border-white/10 shadow-xl flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 bg-white/50 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-6 bg-white/[0.02] border-t border-white/5 z-10 relative shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your travel plans..." 
            className="flex-1 w-full h-12 sm:h-14 px-4 sm:px-6 text-[14px] sm:text-[15px] rounded-[16px] sm:rounded-[20px] bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:bg-white/10 focus:border-white/20 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isExecutingAction}
            className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-[16px] sm:rounded-[20px] bg-gradient-to-br from-indigo-500 to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-[0_8px_16px_rgba(99,102,241,0.4)]"
          >
            <Send className="w-5 h-5 sm:w-6 sm:h-6 ml-1 text-white" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
