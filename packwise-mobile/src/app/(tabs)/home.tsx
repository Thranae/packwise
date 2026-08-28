import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HeroSection from '../../components/overview/HeroSection';
import CommandCenterWidget from '../../components/overview/CommandCenterWidget';
import BudgetWidget from '../../components/overview/BudgetWidget';
import DashboardGreeting from '../../components/overview/DashboardGreeting';
import LiveWeatherCard from '../../components/overview/LiveWeatherCard';
import PackingWidget from '../../components/overview/PackingWidget';
import { useTrips } from '../../context/TripContext';

export default function NativeHome() {
  const { currentTrip } = useTrips();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Safe Area Spacer for the floating TopHeader */}
        <SafeAreaView edges={['top']} />
        <View style={{ height: 80 }} />

        {/* 0. Greeting Message */}
        <DashboardGreeting trip={currentTrip || undefined} />

        {/* 1. Trip Overview Command Center Hero */}
        <HeroSection trip={currentTrip || undefined} />



        {/* 2. Command Center Action Hub */}
        <CommandCenterWidget trip={currentTrip || undefined} />

        {/* 3. Budget Overview Widget */}
        <BudgetWidget trip={currentTrip || undefined} />

        {/* Live Weather Card */}
        <LiveWeatherCard trip={currentTrip || undefined} />

        {/* Packing Status Widget */}
        <PackingWidget trip={currentTrip || undefined} />

      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});

