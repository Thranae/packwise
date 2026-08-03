import React from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTripContext } from '@/context/TripContext';
import { OverviewEmptyState } from '@/components/overview-v2/OverviewEmptyState';

const WeatherWidget = React.lazy(() => import('@/components/overview-v2/WeatherWidget').then(m => ({ default: m.WeatherWidget })));
const CurrencyWidget = React.lazy(() => import('@/components/overview-v2/CurrencyWidget').then(m => ({ default: m.CurrencyWidget })));
const BudgetWidget = React.lazy(() => import('@/components/overview-v2/BudgetWidget').then(m => ({ default: m.BudgetWidget })));
const PackingWidget = React.lazy(() => import('@/components/overview-v2/PackingWidget').then(m => ({ default: m.PackingWidget })));
const CommandCenterWidget = React.lazy(() => import('@/components/overview-v2/CommandCenterWidget').then(m => ({ default: m.CommandCenterWidget })));
const ExploreNearbyWidget = React.lazy(() => import('@/components/overview-v2/ExploreNearbyWidget').then(m => ({ default: m.ExploreNearbyWidget })));
const AIAssistantWidget = React.lazy(() => import('@/components/overview-v2/AIAssistantWidget').then(m => ({ default: m.AIAssistantWidget })));
const TripScoreWidget = React.lazy(() => import('@/components/overview-v2/TripScoreWidget').then(m => ({ default: m.TripScoreWidget })));
const DestinationOfTheDayWidget = React.lazy(() => import('@/components/overview-v2/DestinationOfTheDayWidget').then(m => ({ default: m.DestinationOfTheDayWidget })));
const TravelerStatsWidget = React.lazy(() => import('@/components/overview-v2/TravelerStatsWidget').then(m => ({ default: m.TravelerStatsWidget })));
const HeroSection = React.lazy(() => import('@/components/overview-v2/HeroSection').then(m => ({ default: m.HeroSection })));
const InteractiveGlobeWidget = React.lazy(() => import('@/components/overview-v2/InteractiveGlobeWidget').then(m => ({ default: m.InteractiveGlobeWidget })));

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
  const { currentTrip } = useTripContext();

  if (!currentTrip) {
    return (
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        exit="exit"
        className="col-span-12 grid grid-cols-12 gap-6"
      >
        <OverviewEmptyState />
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      exit="exit"
      className="col-span-12 grid grid-cols-12 gap-6"
    >
      <div className="col-span-12 lg:col-span-8">
        <React.Suspense fallback={<div className="w-full h-[400px] rounded-[32px] ios-glass-card animate-pulse" />}>
          <HeroSection />
        </React.Suspense>
      </div>
      
      <React.Suspense fallback={<div className="col-span-12 lg:col-span-4 h-[400px] rounded-[32px] ios-glass-card animate-pulse" />}>
        <CommandCenterWidget className="col-span-12 lg:col-span-4" />
      </React.Suspense>

      <React.Suspense fallback={<div className="col-span-12 h-[200px] rounded-[32px] ios-glass-card animate-pulse" />}>
        <WeatherWidget className="col-span-12 sm:col-span-6 lg:col-span-3 lg:col-start-1" />
        <CurrencyWidget className="col-span-12 sm:col-span-6 lg:col-span-3" />
        <BudgetWidget className="col-span-12 sm:col-span-6 lg:col-span-3" />
        <PackingWidget className="col-span-12 sm:col-span-6 lg:col-span-3" />
      </React.Suspense>

      <div className="col-span-12 lg:col-span-8 lg:col-start-1">
        <React.Suspense fallback={<div className="w-full h-[400px] rounded-[32px] ios-glass-card animate-pulse" />}>
          <InteractiveGlobeWidget />
        </React.Suspense>
      </div>
      
      <React.Suspense fallback={<div className="col-span-12 h-[300px] rounded-[32px] ios-glass-card animate-pulse" />}>
        <AIAssistantWidget className="col-span-12 lg:col-span-4" />
        <TripScoreWidget className="col-span-12 lg:col-span-6" />
        <DestinationOfTheDayWidget className="col-span-12 lg:col-span-6" />
        <TravelerStatsWidget className="col-span-12 lg:col-span-12" />
        <ExploreNearbyWidget className="col-span-12" />
      </React.Suspense>
    </motion.div>
  );
}
