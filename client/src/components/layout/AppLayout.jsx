import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { AmbientBackground } from '../common/AmbientBackground';
import { PullToRefresh } from '../common/PullToRefresh';
import { ROUTES } from '@/constants/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { GenieCommandPalette } from '../ai/GenieCommandPalette';
import { BottomNav } from './BottomNav';

export function AppLayout({ children }) {
  const location = useLocation();
  const hideTopHeader = location.pathname === ROUTES.TRIPS || location.pathname === ROUTES.ASSISTANT || location.pathname === ROUTES.PACKING || location.pathname === ROUTES.JOURNAL || location.pathname === ROUTES.EXPLORE;
  
  return (
    <>
      <AmbientBackground />
      <GenieCommandPalette />
      <Sidebar />
      <BottomNav />
      <PullToRefresh>
        <div className="relative z-10 flex flex-col min-h-screen px-4 pb-28 pt-2 lg:pl-[288px] lg:pr-8 lg:pb-8 lg:pt-0 w-full overflow-hidden">
          {!hideTopHeader && <TopHeader />}
          <main className={`flex-1 w-full ${hideTopHeader ? 'mt-0' : 'mt-4 lg:mt-6'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)', scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(8px)', scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="col-span-1 lg:col-span-12 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </PullToRefresh>
    </>
  );
}
