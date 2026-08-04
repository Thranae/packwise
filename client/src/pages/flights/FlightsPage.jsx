import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import FlightTrackerPanel from '@/components/flights/FlightTrackerPanel';

export default function FlightsPage() {
  return (
    <div className="col-span-12 w-full min-h-screen flex flex-col pt-[calc(32px+var(--safe-top))] md:pt-8 pb-20">
      {/* Header - same pattern as CalendarPage/ExplorePage */}
      <div className="flex flex-col gap-2 mb-10 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sky-400"
        >
          <Plane className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Flight Tracker</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-semibold tracking-tighter text-white"
        >
          Price <span className="text-white/30">Alerts</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/50 text-lg max-w-2xl"
        >
          Track flight prices and get SMS alerts when they drop to your target.
        </motion.p>
      </div>

      <div className="px-4 md:px-8">
        <FlightTrackerPanel />
      </div>
    </div>
  );
}
