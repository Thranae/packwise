import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import api from '@/services/api';

export const GenieSlideOut = ({ isOpen, onClose, initialQuery = '' }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I am Voyage Genie. How can I help you plan your next adventure?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && initialQuery) {
      setInput(initialQuery);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    const newMsg = { id: Date.now(), type: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter(m => m.id !== 1) // skip the initial greeting
        .map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text }));
      history.push({ role: 'user', content: userText });

      const res = await api.post('/ai/chat', {
        message: userText,
        history,
      });

      const reply = res.data?.reply || res.data?.message || res.data?.response || 'I received your message but couldn\'t generate a response. Please try again!';

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: reply,
      }]);
    } catch (err) {
      console.error('Genie AI error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I\'m having trouble connecting right now. Please check your connection and try again!',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl h-[80vh] max-h-[800px] flex flex-col bg-[#0A101C]/60 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white leading-tight">Voyage Genie AI</h2>
                    <p className="text-xs text-white/60 font-medium flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Online & Ready
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.type === 'user' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'}`}>
                    {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm font-medium shadow-md ${
                    msg.type === 'user' 
                      ? 'bg-blue-600/90 text-white rounded-tr-sm backdrop-blur-md border border-blue-500/50' 
                      : 'bg-white/10 text-white/90 rounded-tl-sm backdrop-blur-md border border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl p-4 text-sm font-medium shadow-md bg-white/10 text-white/90 rounded-tl-sm backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span className="text-white/60">Genie is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/20 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  autoFocus
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner font-medium text-sm disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center text-white transition-colors shadow-lg disabled:opacity-50 disabled:hover:bg-blue-500"
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-white/40 mt-3 font-medium">
                Genie AI can make mistakes. Verify important info.
              </p>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
