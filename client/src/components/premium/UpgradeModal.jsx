import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, Shield, Zap } from 'lucide-react';
import { usePremium } from '../../context/PremiumContext';

const UpgradeModal = ({ isOpen, onClose }) => {
  const { purchasePackage, packages, isReady } = usePremium();

  const handleSubscribe = async (pkg) => {
    const success = await purchasePackage(pkg);
    if (success) {
      onClose(); // Automatically close on success
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Area with Gradient */}
            <div className="relative pt-12 pb-8 px-6 text-center bg-gradient-to-b from-blue-900/40 to-transparent">
              <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 border border-blue-500/30">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Voyage Genie <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Premium</span>
              </h2>
              <p className="text-slate-400">Unlock the full power of AI to plan your perfect trips.</p>
            </div>

            {/* Features List */}
            <div className="px-8 pb-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-1 rounded-full bg-blue-500/20 text-blue-400">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Unlimited AI Itineraries</h4>
                  <p className="text-sm text-slate-400">Generate endless personalized trip plans.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-1 rounded-full bg-blue-500/20 text-blue-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Smart Packing Assistant</h4>
                  <p className="text-sm text-slate-400">Context-aware packing lists based on live weather.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-1 rounded-full bg-blue-500/20 text-blue-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Offline Sync</h4>
                  <p className="text-sm text-slate-400">Access your itineraries without internet connection.</p>
                </div>
              </div>
            </div>

            {/* Pricing Action */}
            <div className="px-6 pb-6 pt-4 bg-slate-800/50 border-t border-slate-700/50">
              {!isReady ? (
                <div className="text-center text-slate-400 text-sm py-4">Loading packages...</div>
              ) : packages.length > 0 ? (
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.identifier}
                      onClick={() => handleSubscribe(pkg)}
                      className="w-full relative group overflow-hidden rounded-xl bg-blue-600 hover:bg-blue-500 transition-all p-4 text-left flex items-center justify-between"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <div>
                        <div className="font-semibold text-white">{pkg.product.title}</div>
                        <div className="text-blue-200 text-sm">{pkg.product.description}</div>
                      </div>
                      <div className="font-bold text-white text-lg">
                        {pkg.product.priceString}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => alert("No packages found. Check RevenueCat config!")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                >
                  Subscribe Now - $4.99/mo
                </button>
              )}
              
              <p className="text-center text-xs text-slate-500 mt-4">
                Auto-renews. Cancel anytime in your device settings.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
