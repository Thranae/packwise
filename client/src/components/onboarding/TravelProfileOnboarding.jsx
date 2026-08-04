import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Wallet, Compass, CheckCircle2, Minus, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const STYLES = [
  'Relaxed', 'Foodie', 'Adventure', 'Cultural', 'Nightlife', 'Nature', 'Shopping', 'Historical'
];

// Emil Kowalski & Apple-inspired spring
const springTransition = { type: 'spring', damping: 25, stiffness: 200, mass: 0.8 };

const stepVariants = {
  initial: { opacity: 0, x: 20, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1, transition: springTransition },
  exit: { opacity: 0, x: -20, scale: 0.98, transition: springTransition }
};

export function TravelProfileOnboarding({ onComplete }) {
  const { updateTravelPreferences } = useAuth();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    budget: 'Medium',
    males: 1,
    females: 1,
    styles: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  
  const toggleStyle = (style) => {
    setPreferences(prev => {
      if (prev.styles.includes(style)) {
        return { ...prev, styles: prev.styles.filter(s => s !== style) };
      }
      if (prev.styles.length >= 3) return prev; // Max 3 styles
      return { ...prev, styles: [...prev.styles, style] };
    });
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    await updateTravelPreferences(preferences);
    setIsSubmitting(false);
    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={springTransition}
        className="w-full max-w-lg ios-glass-card rounded-[32px] overflow-hidden relative shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/5 w-full z-20">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          />
        </div>

        <div className="p-8 sm:p-10 relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-blue-500/20">
                  <Users className="w-7 h-7 text-blue-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Who are you usually traveling with?</h2>
                <p className="text-slate-300 font-medium">Set your default group size so we don't have to ask every time.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="ios-glass-pill rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-white font-semibold tracking-wide">Males</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setPreferences(p => ({...p, males: Math.max(0, p.males - 1)}))} 
                        className="w-9 h-9 rounded-full ios-liquid-button flex items-center justify-center text-white/80 hover:text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-white font-bold text-lg">{preferences.males}</span>
                      <button 
                        onClick={() => setPreferences(p => ({...p, males: p.males + 1}))} 
                        className="w-9 h-9 rounded-full ios-liquid-button flex items-center justify-center text-white/80 hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="ios-glass-pill rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-white font-semibold tracking-wide">Females</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setPreferences(p => ({...p, females: Math.max(0, p.females - 1)}))} 
                        className="w-9 h-9 rounded-full ios-liquid-button flex items-center justify-center text-white/80 hover:text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-white font-bold text-lg">{preferences.females}</span>
                      <button 
                        onClick={() => setPreferences(p => ({...p, females: p.females + 1}))} 
                        className="w-9 h-9 rounded-full ios-liquid-button flex items-center justify-center text-white/80 hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button onClick={handleNext} className="w-full py-4 mt-8 primary-liquid-button text-white rounded-full font-bold text-lg flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-emerald-500/20">
                  <Wallet className="w-7 h-7 text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">What's your typical budget?</h2>
                <p className="text-slate-300 font-medium">This helps us tailor hotels and activities perfectly.</p>
                
                <div className="space-y-4 mt-8">
                  {['Budget', 'Medium', 'Luxury'].map(tier => (
                    <button 
                      key={tier}
                      onClick={() => setPreferences(p => ({...p, budget: tier}))}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${preferences.budget === tier ? 'ios-liquid-button bg-emerald-500/10 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'ios-glass-pill hover:bg-white/5 opacity-80 hover:opacity-100'}`}
                    >
                      <span className="text-white font-bold tracking-wide">{tier}</span>
                      {preferences.budget === tier && (
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                <button onClick={handleNext} className="w-full py-4 mt-8 primary-liquid-button text-white rounded-full font-bold text-lg flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-purple-500/20">
                  <Compass className="w-7 h-7 text-purple-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Your travel style?</h2>
                <p className="text-slate-300 font-medium">Pick up to 3 vibes that match how you like to explore.</p>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  {STYLES.map(style => {
                    const isSelected = preferences.styles.includes(style);
                    return (
                      <button 
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`px-5 py-3 rounded-full font-semibold tracking-wide transition-all duration-300 ${isSelected ? 'ios-liquid-button bg-purple-500/20 border-purple-400/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'ios-glass-pill opacity-70 hover:opacity-100 text-slate-200'}`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={handleComplete} 
                  disabled={isSubmitting || preferences.styles.length === 0}
                  className="w-full py-4 mt-8 primary-liquid-button text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all duration-300"
                >
                  {isSubmitting ? 'Saving...' : 'Finish Setup'} <CheckCircle2 className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
