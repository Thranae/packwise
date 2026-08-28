import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock data matching the HeroSection and Trips tab
const MOCK_TRIP = {
  country: 'Greece',
  destination: 'Santorini',
  startDate: new Date('2025-05-24').toISOString(),
  endDate: new Date('2025-06-02').toISOString(),
};

export default function DashboardGreeting({ trip = MOCK_TRIP, userName = "Alex" }: { trip?: any, userName?: string }) {
  // Determine time of day greeting
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  // Determine trip description
  let tripDescription = "Let's plan your next adventure!";
  
  if (trip) {
    const dest = trip.destination?.split('&')[0] || trip.country || 'your destination';
    const start = new Date(trip.startDate || Date.now());
    const diffDays = Math.ceil((start.getTime() - Date.now()) / (1000 * 3600 * 24));
    
    if (diffDays > 0) {
      tripDescription = `Your trip to ${dest} is in ${diffDays} days.`;
    } else if (diffDays <= 0 && diffDays > -15) {
      tripDescription = `Enjoying your time in ${dest}!`;
    } else {
      tripDescription = `Your trip to ${dest} is ready.`;
    }
  }

  return (
    <Animated.View 
      entering={FadeInDown.delay(100).springify().damping(14)}
      style={styles.container}
    >
      <Text style={styles.greeting}>{greeting}, {userName} 👋</Text>
      <Text style={styles.description}>{tripDescription}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1.0,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: -0.2,
  }
});
