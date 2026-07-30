import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Compass, Zap, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useHaptics } from '@/hooks/useHaptics';

export function InstallPromptWidget() {
  const { isInstallable, hasPrompted, markAsPrompted, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const { mediumTap, successTap } = useHaptics();

  useEffect(() => {
    // Show prompt automatically after 3 seconds if installable and not prompted before
    if (isInstallable && !hasPrompted) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, hasPrompted]);

  const handleInstall = async () => {
    mediumTap();
    const accepted = await promptInstall();
    if (accepted) {
      successTap();
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    mediumTap();
    markAsPrompted();
    setIsVisible(false);
  };

  if (!isInstallable) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-8 pointer-events-none flex justify-center"
        >
          <div className="w-full max-w-md pointer-events-auto bg-[#0A101C]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-[0_-8px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>

            <div className="flex items-start gap-4 mb-6 mt-2">
              <div className="w-14 h-14 shrink-0 rounded-[16px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Install Voyage Genie</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">
                  Add to your home screen for a faster, premium native experience.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-[14px] text-white/80 bg-white/5 rounded-2xl p-3 border border-white/5">
                <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>Instant loading and offline trip access</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-white/80 bg-white/5 rounded-2xl p-3 border border-white/5">
                <Smartphone className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Full screen mode and native app shortcuts</span>
              </div>
            </div>

            <button 
              onClick={handleInstall}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-white text-[#0A101C] font-bold text-[15px] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Download className="w-4 h-4" />
              Install App Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
