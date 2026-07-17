import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { AnimatedBackground } from '../common/AnimatedBackground';
import { ROUTES } from '@/constants/routes';
import { AnimatePresence, motion } from 'framer-motion';

export function AppLayout({ children }) {
  const location = useLocation();
  const hideTopHeader = location.pathname === ROUTES.TRIPS || location.pathname === ROUTES.ASSISTANT || location.pathname === ROUTES.PACKING;
  return (
    <>
      <AnimatedBackground />
      <Sidebar />
      <div className="relative z-10 flex flex-col min-h-screen pl-[288px] pr-8 pb-8">
        {!hideTopHeader && <TopHeader />}
        <main className={`flex-1 ${hideTopHeader ? 'mt-0' : 'mt-6'}`}>
          <div className="grid grid-cols-12 gap-6 h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)', scale: 0.98 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)', scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="col-span-12 w-full h-full grid grid-cols-12 gap-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
