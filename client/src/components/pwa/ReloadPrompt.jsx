import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // If we're on a native app using Capacitor, PWA Service Worker shouldn't be active anyway,
      // but log just in case.
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[99999]",
            "w-[calc(100%-32px)] max-w-sm"
          )}
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.05] border border-white/10 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <RefreshCw className={cn("w-4 h-4 text-blue-400", needRefresh && "animate-spin")} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-[15px] font-semibold text-white tracking-tight">
                  {offlineReady ? 'App ready offline' : 'Update Available'}
                </h3>
                <p className="mt-1 text-[13px] text-white/60 leading-relaxed">
                  {offlineReady
                    ? 'PackWise is now ready to work without a connection.'
                    : 'A new version of PackWise is available. Update now for the best experience.'}
                </p>
                
                <div className="mt-4 flex items-center gap-3">
                  {needRefresh && (
                    <button
                      onClick={() => updateServiceWorker(true)}
                      className="px-4 py-2 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
                    >
                      Update Now
                    </button>
                  )}
                  <button
                    onClick={close}
                    className="px-4 py-2 text-[13px] font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              <button
                onClick={close}
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
