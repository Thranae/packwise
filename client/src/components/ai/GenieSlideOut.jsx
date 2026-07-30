import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, User, Loader2 } from 'lucide-react';
import { LogoIcon } from '@/components/ui/Logo';
import api from '@/services/api';
import ReactMarkdown from 'react-markdown';

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

      // Intentional fake delay to simulate 'thinking' per user request
      await new Promise(resolve => setTimeout(resolve, 4000));

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
                    {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <LogoIcon size="sm" className="text-white drop-shadow-sm scale-90" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`p-4 shadow-xl text-left overflow-hidden ${
                          msg.type === 'user' 
                            ? 'rounded-[20px] rounded-tr-sm bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-400/30 text-white' 
                            : 'rounded-[20px] rounded-tl-sm ios-glass-card border border-white/10 text-white'
                        }`}>
                          {msg.type === 'user' ? (
                            <p className="leading-relaxed whitespace-pre-wrap text-[14px] font-medium">{msg.text}</p>
                          ) : (
                            <ReactMarkdown
                              components={{
                                p: ({node, ...props}) => <p className="leading-relaxed text-[14px] font-medium mb-2 last:mb-0" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-black text-emerald-400 drop-shadow-sm" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="text-[14px] font-medium marker:text-blue-400" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 text-blue-400" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2 text-white/90" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1 text-white/80" {...props} />,
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          )}
                        </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <LogoIcon size="sm" className="text-white drop-shadow-sm scale-90" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="flex flex-col max-w-[90%] self-start items-start"
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <div className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-md"><Sparkles className="w-3 h-3 text-white animate-pulse" /></div>
                      <span className="text-[10px] font-semibold text-white/50 tracking-wider uppercase">Voyage Genie AI</span>
                    </div>
                    <div className="p-4 shadow-xl text-left rounded-[20px] rounded-tl-sm ios-glass-card border border-white/10 text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
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
