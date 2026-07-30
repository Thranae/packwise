import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Sparkles, X, Compass, ChevronRight } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    title: "Welcome to Voyage Genie",
    desc: "Your AI-powered travel companion. Let's take a quick look at how to navigate.",
  },
  {
    icon: <Hand className="w-8 h-8 text-blue-400" />,
    title: "Swipe to Navigate",
    desc: "Many cards and menus in Voyage Genie can be swiped left or right for quick actions or exploration.",
  },
  {
    icon: <Compass className="w-8 h-8 text-emerald-400" />,
    title: "Explore the World",
    desc: "Use the interactive 3D globe to discover new destinations, or tap the Create Trip button to get started right away.",
  }
];

export const OnboardingTutorial = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if the user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem('packwise_tutorial_seen');
    if (!hasSeenTutorial) {
      // Delay slightly so the UI loads first
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('packwise_tutorial_seen', 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-[32px] ios-glass-card shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />

            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-white/5 rounded-full animate-ping" />
                    {TUTORIAL_STEPS[currentStep].icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {TUTORIAL_STEPS[currentStep].title}
                  </h3>
                  
                  <p className="text-white/70 text-sm leading-relaxed mb-8">
                    {TUTORIAL_STEPS[currentStep].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress Dots & Button */}
              <div className="flex items-center justify-between w-full mt-auto">
                <div className="flex gap-2">
                  {TUTORIAL_STEPS.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentStep ? 'w-6 bg-blue-400' : 'w-2 bg-white/20'
                      }`} 
                    />
                  ))}
                </div>
                
                <button 
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-full ios-liquid-button text-white font-bold flex items-center gap-2 group"
                >
                  {currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next'}
                  {currentStep !== TUTORIAL_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
