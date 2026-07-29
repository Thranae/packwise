import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Search, MapPin, ArrowUp, Loader2 } from 'lucide-react';
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
      className="flex flex-col w-full max-w-3xl overflow-hidden relative p-4 sm:p-5 justify-between h-auto min-h-[300px] max-h-[500px] sm:max-h-none sm:h-[600px] rounded-[24px] sm:rounded-[32px] ios-glass-card shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] transition-shadow duration-700 z-10 mx-auto mt-0 md:mt-4"
    >
      
      {/* Header */}
      <div className="flex flex-col items-center gap-2 mb-4 shrink-0 ios-3d-element">
        <div className="relative w-12 h-12 rounded-[16px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center backdrop-blur-xl">
          <Sparkles className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" />
          <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#1c1d29] shadow-[0_0_8px_rgba(52,211,153,0.8)] ${isLoading ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400'}`} />
        </div>
        <div className="flex flex-col text-center">
          <h2 className="text-lg font-semibold tracking-tighter text-white drop-shadow-md">Voyage Genie AI</h2>
          <p className="text-white/60 text-xs font-medium">Always active and ready to plan.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 flex flex-col gap-4 z-10 relative custom-scrollbar pb-2">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, mass: 0.8 }}
            className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <div className={`flex items-center gap-2 mb-1 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'user' ? (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white shadow-md">YOU</div>
              ) : (
                <div className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-md"><Sparkles className="w-3 h-3 text-white" /></div>
              )}
              <span className="text-[10px] font-semibold text-white/50 tracking-wider uppercase">
                {msg.role === 'user' ? 'You' : 'Voyage Genie AI'}
              </span>
            </div>
            <div className={`p-4 shadow-xl text-left ${
              msg.role === 'user' 
                ? 'rounded-[20px] rounded-tr-sm bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-400/30 text-white' 
                : 'rounded-[20px] rounded-tl-sm ios-glass-card border border-white/10 text-white'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap text-[14px] font-medium">{msg.content}</p>
            </div>
            
            {/* Suggestions */}
            {msg.suggestions && (
              <div className="flex flex-wrap gap-2 mt-3 justify-start">
                {msg.suggestions.map((sug, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(sug)}
                    className="px-3 py-2 rounded-[14px] bg-white/5 hover:bg-white/10 border border-white/5 text-[12px] font-medium text-white/80 hover:text-white transition-colors text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
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
              className="flex flex-col items-center justify-center py-4 text-white/50 gap-2"
            >
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="text-[10px] font-medium uppercase tracking-widest">AI is thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Chat Input */}
      <div className="shrink-0 mt-3 pt-1 ios-3d-element">
        <div className={`
          relative flex items-center w-full rounded-[16px] sm:rounded-[20px] h-[48px] sm:h-[56px]
          bg-white/5 backdrop-blur-md
          border border-white/10
          transition-all duration-700
          ${input.length > 0 ? 'bg-white/10 border-purple-400/50 shadow-[0_12px_32px_rgba(168,85,247,0.25),inset_0_1px_2px_rgba(255,255,255,0.2)] -translate-y-1' : 'hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'}
        `}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Voyage Genie AI..."
            disabled={isLoading || isExecutingAction}
            className="w-full h-full bg-transparent border-none outline-none text-white placeholder-white/40 px-5 font-medium text-[13px] disabled:opacity-50"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || isExecutingAction}
            className={`
            absolute right-2 w-9 h-9 flex items-center justify-center rounded-full
            transition-all duration-700
            ${input.length > 0 ? 'bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.6)] scale-105' : 'bg-white/10 text-white/30'}
          `}>
            <Send className={`w-3.5 h-3.5 ${input.length > 0 ? 'text-white translate-x-px -translate-y-px' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
