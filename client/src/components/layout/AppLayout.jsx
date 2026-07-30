import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { AnimatedBackground } from '../common/AnimatedBackground';
import { PullToRefresh } from '../common/PullToRefresh';
import { ROUTES } from '@/constants/routes';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { GenieCommandPalette } from '../ai/GenieCommandPalette';
import { BottomNav } from './BottomNav';

export function AppLayout({ children }) {
  const location = useLocation();
  const hideTopHeader = location.pathname === ROUTES.TRIPS || location.pathname === ROUTES.ASSISTANT || location.pathname === ROUTES.PACKING || location.pathname === ROUTES.JOURNAL || location.pathname === ROUTES.EXPLORE;
  
  return (
    <>
      <AnimatedBackground />
      <GenieCommandPalette />
      
      {/* Native-feeling static frosted glass edges */}
      <div className="fixed top-0 left-0 right-0 h-[calc(10px+env(safe-area-inset-top))] z-[60] backdrop-blur-md bg-gradient-to-b from-[#030712]/90 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-[calc(10px+env(safe-area-inset-bottom))] z-[60] backdrop-blur-md bg-gradient-to-t from-[#030712]/90 to-transparent pointer-events-none" />

      <Sidebar />
      <BottomNav />
      <PullToRefresh>
        <LayoutGroup>
          <div className="relative z-10 flex flex-col min-h-screen px-4 pb-28 pt-2 lg:pl-[288px] lg:pr-8 lg:pb-8 lg:pt-0 w-full overflow-x-hidden">
            {!hideTopHeader && <TopHeader />}
            <main className={`flex-1 flex flex-col min-h-0 w-full ${hideTopHeader ? 'mt-0' : 'mt-4 lg:mt-6'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 relative">
                <AnimatePresence>
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="col-span-1 lg:col-span-12 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
        </LayoutGroup>
      </PullToRefresh>
    </>
  );
}
