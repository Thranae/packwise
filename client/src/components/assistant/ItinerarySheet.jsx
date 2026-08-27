import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Plane, Hotel, CheckCircle, Navigation } from 'lucide-react';
import { useAssistant } from '@/context/AssistantContext';
import { useHaptics } from '@/hooks/useHaptics';

export default function ItinerarySheet() {
  const { itinerary, setItinerary, currentRecommendation } = useAssistant();
  const { heavyTap } = useHaptics();
  if (!itinerary) return null;

  const handleClose = () => {
    heavyTap();
    setItinerary(null);
  };

  const days = Array.isArray(itinerary) ? itinerary : (itinerary.days || []);
  const destName = Array.isArray(itinerary) ? currentRecommendation?.city : (itinerary.destination || 'Your Trip');
  const duration = Array.isArray(itinerary) ? `${itinerary.length} Days` : (itinerary.duration || '7 Days');
  const budget = Array.isArray(itinerary) ? (currentRecommendation?.budget || '$$$') : (itinerary.estimatedBudget || '$$$');
  const tips = Array.isArray(itinerary) ? [] : (itinerary.tips || []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full h-[85vh] bg-[#0A0F1C] rounded-t-[32px] border-t border-white/[0.1] shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.05]">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
                Generated Itinerary
              </span>
              <h2 className="text-[20px] font-extrabold text-white leading-tight">
                {destName}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center active:bg-white/[0.1] transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 pb-safe flex flex-col gap-6" style={{ WebkitOverflowScrolling: 'touch' }}>
            
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-[16px] bg-white/[0.03] border border-white/[0.05] flex flex-col">
                <Calendar className="w-4 h-4 text-blue-400 mb-2" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-0.5">Duration</span>
                <span className="text-[14px] font-bold text-white">{duration}</span>
              </div>
              <div className="p-3 rounded-[16px] bg-white/[0.03] border border-white/[0.05] flex flex-col">
                <Plane className="w-4 h-4 text-purple-400 mb-2" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-0.5">Estimated Budget</span>
                <span className="text-[14px] font-bold text-white">{budget}</span>
              </div>
            </div>

            {/* Travel Tips */}
            {tips.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Travel Tips
                </h3>
                <ul className="flex flex-col gap-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="text-[13px] text-white/75 leading-relaxed bg-white/[0.02] p-3 rounded-[12px]">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Daily Plan */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-rose-400" />
                Daily Plan
              </h3>
              
              <div className="flex flex-col gap-5">
                {days.map((day, i) => (
                  <div key={i} className="flex flex-col gap-2 relative">
                    {/* Timeline line */}
                    {i !== days.length - 1 && (
                      <div className="absolute left-[13px] top-8 bottom-[-20px] w-[2px] bg-white/[0.05]" />
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 z-10">
                        <span className="text-[11px] font-bold text-white">{i + 1}</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-white/90">{day.title || `Day ${i + 1}`}</h4>
                    </div>

                    <div className="pl-10 flex flex-col gap-2">
                      <p className="text-[13px] text-white/60 leading-relaxed">{day.description || 'Enjoy a wonderful day exploring.'}</p>
                      
                      {day.activities && day.activities.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-1">
                          {day.activities.map((act, actI) => (
                            <div key={actI} className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.05] rounded-[10px]">
                              <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span className="text-[12px] font-medium text-white/80">{typeof act === 'string' ? act : act.description || act.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
