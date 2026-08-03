import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Plus } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

import { DestinationOfTheDayWidget } from './DestinationOfTheDayWidget';
import { TravelerStatsWidget } from './TravelerStatsWidget';

export const OverviewEmptyState = () => {
  const navigate = useNavigate();

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="col-span-12 lg:col-span-8 flex flex-col items-center justify-center min-h-[400px] rounded-[32px] md:rounded-[40px] ios-glass-card shadow-2xl relative overflow-hidden p-8 text-center"
      >
        {/* Background ambient glows */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
            <Compass className="w-12 h-12 text-white/80 drop-shadow-md" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
            Your Canvas Awaits
          </h2>
          
          <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
            Welcome to Voyage Genie! You haven't planned any trips yet. 
            Let's design your first incredible adventure using the power of AI.
          </p>
          
          <button 
            onClick={() => navigate(ROUTES.TRIPS)}
            className="h-[56px] px-8 rounded-full ios-liquid-button flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all duration-300 shadow-[0_10px_20px_rgba(59,130,246,0.3)] group"
          >
            <Plus className="w-5 h-5 text-white transition-transform group-hover:rotate-90 duration-300" />
            <span className="text-[16px] font-bold text-white tracking-wide">Create Your First Trip</span>
          </button>
        </motion.div>
      </motion.div>

      <DestinationOfTheDayWidget className="col-span-12 md:col-span-6 lg:col-span-4" />
      <TravelerStatsWidget className="col-span-12 md:col-span-6 lg:col-span-12" />
    </>
  );
};
