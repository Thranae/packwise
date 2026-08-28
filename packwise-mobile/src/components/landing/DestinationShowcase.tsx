import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Star, Heart, Sun, Wallet, Clock, Sparkles, ChevronRight } from 'lucide-react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  FadeInUp,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_W = width - 48;
const CARD_H = 420;

const GlassChip = ({ icon: Icon, label, value, accent }) => (
  <View style={[chipS.wrapper, accent && chipS.wrapperAccent]}>
    <BlurView intensity={100} tint="light" style={[chipS.chip, accent && chipS.chipAccent]}>
      <View style={chipS.shine} />
      <Icon size={14} color={accent ? '#fff' : '#334155'} />
      <View style={{ flex: 1 }}>
        <Text style={[chipS.value, accent && { color: '#fff' }]}>{value}</Text>
        <Text style={[chipS.label, accent && { color: 'rgba(255,255,255,0.8)' }]}>{label}</Text>
      </View>
      {accent && <ChevronRight size={12} color="rgba(255,255,255,0.7)" />}
    </BlurView>
  </View>
);

export default function DestinationShowcase() {
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin((e) => {
      tiltX.value = withSpring(interpolate(e.y, [0, CARD_H], [4, -4], Extrapolation.CLAMP));
      tiltY.value = withSpring(interpolate(e.x, [0, CARD_W], [-4, 4], Extrapolation.CLAMP));
    })
    .onUpdate((e) => {
      tiltX.value = interpolate(e.y, [0, CARD_H], [4, -4], Extrapolation.CLAMP);
      tiltY.value = interpolate(e.x, [0, CARD_W], [-4, 4], Extrapolation.CLAMP);
    })
    .onFinalize(() => {
      tiltX.value = withSpring(0);
      tiltY.value = withSpring(0);
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
    ],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(800).delay(700)} style={styles.container}>
      {/* Section Label */}
      <View style={styles.sectionHeader}>
        <View style={styles.labelShadow}>
          <BlurView intensity={100} tint="light" style={styles.labelPill}>
            <View style={styles.shine} />
            <Sparkles size={12} color="#2F6BFF" />
            <Text style={styles.labelText}>Featured Destination</Text>
          </BlurView>
        </View>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, rStyle]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200' }}
            style={styles.image}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.65)']}
            style={styles.imageGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* Glass Heart Button */}
          <TouchableOpacity style={styles.heartBtn} activeOpacity={0.8}>
            <BlurView intensity={100} tint="light" style={styles.heartBlur}>
              <View style={styles.shine} />
              <Heart size={20} color="#2F6BFF" />
            </BlurView>
          </TouchableOpacity>

          {/* Bottom Content */}
          <View style={styles.content}>
            <Text style={styles.destination}>Santorini</Text>
            <View style={styles.locRow}>
              <MapPin size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.country}>Greece</Text>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.ratingText}>4.8 (2.3k)</Text>
              </View>
              <View style={styles.weatherBadge}>
                <Sun size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherText}>24°C</Text>
              </View>
            </View>

            {/* Glass Chips */}
            <View style={styles.chipsRow}>
              <GlassChip icon={Sparkles} label="AI Match" value="98%" accent />
              <GlassChip icon={Wallet} label="Budget" value="₹ 45,000" />
              <GlassChip icon={Clock} label="Duration" value="6 Days" />
              <GlassChip icon={Star} label="Best Time" value="Apr – Oct" />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.pagination}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </Animated.View>
  );
}

const chipS = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  wrapperAccent: {},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  chipAccent: {
    backgroundColor: 'rgba(47,107,255,0.55)',
    borderColor: 'rgba(90,169,255,0.4)',
  },
  shine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  value: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  label: {
    fontSize: 8,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  labelShadow: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: 'transparent',
  },
  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  shine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 20,
  },
  image: { ...StyleSheet.absoluteFillObject },
  imageGradient: { ...StyleSheet.absoluteFillObject },
  heartBtn: {
    position: 'absolute',
    top: 16, right: 16,
    zIndex: 10,
  },
  heartBlur: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  content: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
  },
  destination: {
    fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -0.8,
  },
  locRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 4, marginBottom: 12,
  },
  country: {
    fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)',
  },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  weatherBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  weatherText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  chipsRow: {
    flexDirection: 'row', gap: 6,
  },
  pagination: {
    flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.08)',
  },
  dotActive: {
    backgroundColor: '#2F6BFF', width: 24,
  },
});
