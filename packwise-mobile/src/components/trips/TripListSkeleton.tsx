import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReanimatedTripCard } from './ReanimatedTripCard';

const dummyTrips = [
  {
    _id: '1',
    destination: 'Kyoto, Japan',
    status: 'UPCOMING',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000',
  },
  {
    _id: '2',
    destination: 'Santorini, Greece',
    status: 'PLANNING',
    heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000',
  }
];

export default function TripListSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Trips</Text>
      </View>
      
      {dummyTrips.map((trip) => (
        <ReanimatedTripCard key={trip._id} trip={trip} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  }
});
