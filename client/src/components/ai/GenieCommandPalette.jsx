import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bot, Map, Book, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const GenieCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleAction = (route) => {
    setIsOpen(false);
    navigate(route);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 pt-[15vh] items-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#0A101C]/80 backdrop-blur-md"
          />
          
          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center p-6 border-b border-white/10 bg-white/5">
              <Bot className="w-6 h-6 text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to do?..."
                className="w-full bg-transparent border-none outline-none text-2xl text-white placeholder-white/40 ml-4 font-bold"
              />
              <div className="flex items-center gap-1 shrink-0 ml-4">
                <span className="text-[10px] font-black text-white/50 bg-white/10 px-2 py-1 rounded-md">ESC</span>
              </div>
            </div>

            {/* Quick Actions (Mocked for now) */}
            {!query && (
              <div className="p-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest px-4 mb-3">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleAction(ROUTES.TRIPS)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Map className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Plan New Trip</h4>
                      <p className="text-xs text-white/60">Generate an itinerary</p>
                    </div>
                  </button>
                  <button onClick={() => handleAction(ROUTES.JOURNAL)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Book className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">New Journal Entry</h4>
                      <p className="text-xs text-white/60">Log a memory</p>
                    </div>
                  </button>
                  <button onClick={() => handleAction(ROUTES.EXPLORE)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Search className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Explore Destinations</h4>
                      <p className="text-xs text-white/60">Find inspiration</p>
                    </div>
                  </button>
                  <button onClick={() => handleAction(ROUTES.ASSISTANT)} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Talk to Genie</h4>
                      <p className="text-xs text-white/60">Full AI assistant</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Search Results (Mocked for now) */}
            {query && (
              <div className="p-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest px-4 mb-3">AI Suggestions</div>
                <div className="flex flex-col gap-1">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                    <div className="flex items-center gap-4">
                      <Search className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Plan a 5-day trip to <span className="font-black text-blue-400">{query}</span></span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                    <div className="flex items-center gap-4">
                      <Book className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Search my journal entries for <span className="font-black text-pink-400">{query}</span></span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex items-center gap-4 text-xs font-medium text-white/40">
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70">↑</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70">↓</kbd> to navigate</span>
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70">Enter</kbd> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
