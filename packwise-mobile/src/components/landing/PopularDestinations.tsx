import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Heart, MapPin, Star, Wallet } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.52;
const CARD_H = CARD_W * 1.25;

const DESTINATIONS = [
  { name: 'Bali',     country: 'Indonesia', match: 98, price: '₹ 32,000', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600', rating: 4.9 },
  { name: 'Paris',    country: 'France',    match: 94, price: '₹ 58,000', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600', rating: 4.8 },
  { name: 'Dubai',    country: 'UAE',       match: 95, price: '₹ 41,000', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600', rating: 4.7 },
  { name: 'Maldives', country: 'Maldives',  match: 95, price: '₹ 70,000', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600', rating: 4.9 },
];

const DestCard = ({ item, index }) => (
  <Animated.View entering={FadeInRight.duration(600).delay(index * 120)}>
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" transition={300} />
      <View style={styles.overlay} />

      {/* Top Row — glass badges */}
      <View style={styles.topRow}>
        <BlurView intensity={100} tint="light" style={styles.matchBlur}>
          <View style={styles.shine} />
          <Star size={10} color="#fff" fill="#fff" />
          <Text style={styles.matchText}>{item.rating}</Text>
        </BlurView>
        <TouchableOpacity>
          <BlurView intensity={100} tint="light" style={styles.heartBlur}>
            <View style={styles.shine} />
            <Heart size={16} color="#2F6BFF" />
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Bottom Content — glass overlay */}
      <View style={styles.bottomArea}>
        <BlurView intensity={80} tint="dark" style={styles.bottomGlass}>
          <View style={styles.shineDark} />
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.countryRow}>
            <MapPin size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.country}>{item.country}</Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.matchPill}>
              <Text style={styles.matchPercent}>{item.match}% Match</Text>
            </View>
            <View style={styles.pricePill}>
              <Wallet size={12} color="#fff" />
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </View>
        </BlurView>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

export default function PopularDestinations() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600).delay(900)} style={styles.headerRow}>
        <Text style={styles.heading}>Popular Destinations</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Explore All {'>'}</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_W + 16}
        decelerationRate="fast"
      >
        {DESTINATIONS.map((item, i) => <DestCard key={item.name} item={item} index={i} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 40 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    paddingHorizontal: 24, marginBottom: 16,
  },
  heading: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  viewAll: { fontSize: 14, fontWeight: '600', color: '#2F6BFF' },
  scrollContent: { paddingHorizontal: 24, gap: 16 },
  card: {
    width: CARD_W, height: CARD_H, borderRadius: 24, overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  image: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12,
  },
  shine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '50%', backgroundColor: 'rgba(255,255,255,0.2)',
  },
  shineDark: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '40%', backgroundColor: 'rgba(255,255,255,0.06)',
  },
  matchBlur: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(47,107,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  matchText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  heartBlur: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  bottomArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  bottomGlass: {
    padding: 14, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  name: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.3 },
  countryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, marginBottom: 10 },
  country: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchPill: {
    backgroundColor: 'rgba(16,185,129,0.7)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  matchPercent: { fontSize: 10, fontWeight: '800', color: '#fff' },
  pricePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  priceText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
