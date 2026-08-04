import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Sparkles, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function QuickLaunchModal({ isOpen, onClose, destination }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!startDate || !duration) return;
    
    setIsGenerating(true);
    
    // In a real flow, this would call TripContext.generateTrip() or pass data to the TripBuilderWizard
    // For now, we simulate generation and redirect to assistant with preset mode
    setTimeout(() => {
      setIsGenerating(false);
      onClose();
      // Redirect to builder mode with prefilled parameters via state/query
      navigate(`${ROUTES.ASSISTANT}?mode=builder&destination=${encodeURIComponent(destination)}&days=${duration}&date=${startDate}`);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020617]/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] shadow-[0_32px_64px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] rounded-[32px] overflow-hidden p-6 sm:p-8"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          <div className="mb-6">
            <h3 className="text-2xl font-light text-white mb-2">Let's go to <br/><span className="font-medium text-emerald-400">{destination}</span></h3>
            <p className="text-sm text-slate-400">We'll use your default profile settings for the rest.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <label className="text-xs text-white/50 font-medium uppercase tracking-wider mb-2 block">Start Date</label>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <label className="text-xs text-white/50 font-medium uppercase tracking-wider mb-2 block">Duration</label>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">{duration} Days</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white">-</button>
                <button onClick={() => setDuration(duration + 1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white">+</button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-[11px] text-white/40 text-center mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" />
              Using Profile: {user?.travelPreferences?.budget || 'Medium'} • {((user?.travelPreferences?.males || 0) + (user?.travelPreferences?.females || 0)) || 2} Travelers
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!startDate || isGenerating}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {isGenerating ? (
                <>Generating with AI...</>
              ) : (
                <>Generate Itinerary <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
