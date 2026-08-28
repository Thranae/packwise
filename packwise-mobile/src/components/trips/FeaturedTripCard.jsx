import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  FadeInDown
} from 'react-native-reanimated';
import { Plane, Heart, Sun, Wallet, Users, Clock } from 'lucide-react-native';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 380;

export default function FeaturedTripCard() {
  const { currentTrip } = useTrips();

  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin((e) => {
      tiltX.value = withSpring(
        interpolate(e.y, [0, CARD_HEIGHT], [5, -5], Extrapolation.CLAMP)
      );
      tiltY.value = withSpring(
        interpolate(e.x, [0, CARD_WIDTH], [-5, 5], Extrapolation.CLAMP)
      );
    })
    .onUpdate((e) => {
      tiltX.value = interpolate(e.y, [0, CARD_HEIGHT], [5, -5], Extrapolation.CLAMP);
      tiltY.value = interpolate(e.x, [0, CARD_WIDTH], [-5, 5], Extrapolation.CLAMP);
    })
    .onFinalize(() => {
      tiltX.value = withSpring(0);
      tiltY.value = withSpring(0);
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${tiltX.value}deg` },
        { rotateY: `${tiltY.value}deg` },
      ],
    };
  });

  // Fallback if no real trips exist yet
  const displayTrip = currentTrip || {
    destination: 'Santorini, Greece',
    country: 'Greece',
    startDate: '2025-05-24T00:00:00Z',
    endDate: '2025-06-02T00:00:00Z',
    budget: 1500,
    currency: 'USD',
    travelers: 2,
    duration: '10 Days',
    status: 'upcoming'
  };

  const imageUri = currentTrip?.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000';

  // Helper to format dates
  const formatDateRange = (start, end) => {
    if (!start || !end) return 'Dates pending';
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <Animated.View entering={FadeInDown.duration(800).delay(600)} style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.cardContainer, rStyle]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.gradientOverlay} />

          {/* Top Badges */}
          <View style={styles.topRow}>
            <BlurView intensity={40} tint="dark" style={styles.daysBadge}>
              <Plane size={14} color="#fff" style={{ transform: [{ rotate: '-45deg' }] }} />
              <Text style={styles.daysText}>{displayTrip.status === 'upcoming' ? 'Upcoming' : 'Planned'}</Text>
            </BlurView>
            <BlurView intensity={40} tint="light" style={styles.heartBadge}>
              <Heart size={20} color="#1f2937" />
            </BlurView>
          </View>

          {/* Bottom Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.destination}>{displayTrip.destination}</Text>
            <View style={styles.dateRow}>
              <Clock size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.date}>{formatDateRange(displayTrip.startDate, displayTrip.endDate)}</Text>
            </View>

            {/* Glass Chips */}
            <View style={styles.chipsRow}>
              <BlurView intensity={40} tint="dark" style={styles.chip}>
                <Sun size={20} color="#fff" />
                <View>
                  <Text style={styles.chipTitle}>24°C</Text>
                  <Text style={styles.chipDesc}>Avg</Text>
                </View>
              </BlurView>

              <BlurView intensity={40} tint="dark" style={[styles.chip, { flex: 1.2 }]}>
                <Wallet size={20} color="#fff" />
                <View>
                  <Text style={styles.chipTitle}>{displayTrip.budget ? `${displayTrip.budget} ${displayTrip.currency || ''}` : 'TBD'}</Text>
                  <Text style={styles.chipDesc}>Budget</Text>
                </View>
              </BlurView>

              <BlurView intensity={40} tint="dark" style={styles.chip}>
                <Users size={20} color="#fff" />
                <View>
                  <Text style={styles.chipTitle}>{displayTrip.travelers || 1}</Text>
                  <Text style={styles.chipDesc}>People</Text>
                </View>
              </BlurView>

              <BlurView intensity={40} tint="dark" style={styles.chip}>
                <Clock size={20} color="#fff" />
                <View>
                  <Text style={styles.chipTitle}>{displayTrip.duration || 'N/A'}</Text>
                  <Text style={styles.chipDesc}>Duration</Text>
                </View>
              </BlurView>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  daysText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  heartBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  destination: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chipTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  chipDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  }
});
