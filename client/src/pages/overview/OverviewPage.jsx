import React from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTripContext } from '@/context/TripContext';

import { HeroSection } from '@/components/overview-v2/HeroSection';
import { WeatherWidget } from '@/components/overview-v2/WeatherWidget';
import { CurrencyWidget } from '@/components/overview-v2/CurrencyWidget';
import { BudgetWidget } from '@/components/overview-v2/BudgetWidget';
import { PackingWidget } from '@/components/overview-v2/PackingWidget';
import { CommandCenterWidget } from '@/components/overview-v2/CommandCenterWidget';
import { ExploreNearbyWidget } from '@/components/overview-v2/ExploreNearbyWidget';
import { AIAssistantWidget } from '@/components/overview-v2/AIAssistantWidget';
import { InteractiveGlobeWidget } from '@/components/overview-v2/InteractiveGlobeWidget';

const staggerContainer = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function OverviewPage() {
  // Use currentTrip if it exists, otherwise provide a fallback mock trip so the UI doesn't break
  const { currentTrip: realCurrentTrip } = useTripContext();
  
  const currentTrip = realCurrentTrip || {
    _id: "mock-1",
    destination: "Tokyo & Kyoto Explorer",
    country: "Japan",
    startDate: "2026-10-12T00:00:00Z",
    endDate: "2026-10-26T00:00:00Z",
    budget: 4500,
    currency: "INR",
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      exit="exit"
      className="col-span-12 grid grid-cols-12 gap-6"
    >
      <div className="col-span-12 lg:col-span-8">
        <HeroSection />
      </div>
      <CommandCenterWidget className="col-span-12 lg:col-span-4" />

      <WeatherWidget className="col-span-12 sm:col-span-6 lg:col-span-3 lg:col-start-1" />
      <CurrencyWidget className="col-span-12 sm:col-span-6 lg:col-span-3" />
      <BudgetWidget className="col-span-12 sm:col-span-6 lg:col-span-3" />
      <PackingWidget className="col-span-12 sm:col-span-6 lg:col-span-3" />

      <InteractiveGlobeWidget className="col-span-12 lg:col-span-8 lg:col-start-1" />
      <AIAssistantWidget className="col-span-12 lg:col-span-4" />

      <ExploreNearbyWidget className="col-span-12" />
    </motion.div>
  );
}
