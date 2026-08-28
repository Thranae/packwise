import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60; // Leave space to peek next card

const dummyDestinations = [
  {
    id: '1',
    city: 'Swiss Alps',
    country: 'Switzerland',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a458b07?q=80&w=1000'
  },
  {
    id: '2',
    city: 'Amalfi Coast',
    country: 'Italy',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=1000'
  },
  {
    id: '3',
    city: 'Kyoto',
    country: 'Japan',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000'
  }
];

export default function DestinationCarousel() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Destination of the Day</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16} // card width + gap
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {dummyDestinations.map((dest) => (
          <View key={dest.id} style={styles.card}>
            <Image
              source={{ uri: dest.image }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.gradient} />
            
            <View style={styles.ratingBadge}>
              <Star size={12} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.ratingText}>{dest.rating}</Text>
            </View>

            <View style={styles.content}>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#10b981" />
                <Text style={styles.country}>{dest.country.toUpperCase()}</Text>
              </View>
              <Text style={styles.city}>{dest.city}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb', // blue-600
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  country: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  city: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  }
});
