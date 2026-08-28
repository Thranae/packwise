import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Star } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TESTIMONIALS = [
  {
    quote: '"PackWise planned my entire Europe trip in minutes. It felt like magic! Everything was perfect."',
    name: 'Priya Sharma',
    location: 'India 🇮🇳',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    stars: 5,
  },
  {
    quote: '"The AI packing suggestions saved me from overpacking. I traveled with just a carry-on for 2 weeks!"',
    name: 'Marcus Chen',
    location: 'Singapore 🇸🇬',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    stars: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <Animated.View entering={FadeInUp.duration(700).delay(1000)} style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {TESTIMONIALS.map((t, i) => (
          <View key={i} style={styles.cardShadow}>
            <BlurView intensity={100} tint="light" style={styles.card}>
              <View style={styles.shine} />

              <View style={styles.quoteMarkContainer}>
                <Text style={styles.quoteMark}>"</Text>
              </View>

              <View style={styles.starsRow}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={16} color="#fbbf24" fill="#fbbf24" />
                ))}
              </View>

              <Text style={styles.quoteText}>{t.quote}</Text>

              <View style={styles.authorRow}>
                <Image source={{ uri: t.avatar }} style={styles.avatar} contentFit="cover" />
                <View>
                  <Text style={styles.authorName}>{t.name}</Text>
                  <Text style={styles.authorLoc}>{t.location}</Text>
                </View>
              </View>
            </BlurView>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 40, paddingHorizontal: 24 },
  scrollContent: { gap: 16 },
  cardShadow: {
    width: width - 48,
    borderRadius: 24,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: 24,
    padding: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    position: 'relative',
  },
  shine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '45%', backgroundColor: 'rgba(255,255,255,0.15)',
  },
  quoteMarkContainer: { position: 'absolute', top: 16, right: 24 },
  quoteMark: { fontSize: 64, fontWeight: '900', color: 'rgba(47,107,255,0.1)', lineHeight: 64 },
  starsRow: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  quoteText: { fontSize: 16, fontWeight: '500', color: '#334155', lineHeight: 26, marginBottom: 24 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e2e8f0' },
  authorName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  authorLoc: { fontSize: 12, fontWeight: '500', color: '#64748b', marginTop: 2 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.08)' },
  dotActive: { backgroundColor: '#2F6BFF', width: 24 },
});
