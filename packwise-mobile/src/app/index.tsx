import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReanimatedTripCard } from '../components/trips/ReanimatedTripCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function NativeHome() {
  const dummyTrip = {
    _id: '1',
    destination: 'Kyoto, Japan',
    status: 'UPCOMING',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000',
  };

  const dummyTrip2 = {
    _id: '2',
    destination: 'Santorini, Greece',
    status: 'PLANNING',
    heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000',
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Your Trips</Text>
          <Text style={styles.subtitle}>
            Experience true 120FPS 3D-level smooth rendering! Try dragging these cards around.
          </Text>
          
          <ReanimatedTripCard trip={dummyTrip} />
          <ReanimatedTripCard trip={dummyTrip2} />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712', // Deep dark theme matching the web app
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
    lineHeight: 24,
  },
});
