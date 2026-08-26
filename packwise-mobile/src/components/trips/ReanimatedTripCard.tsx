import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 460;

export const ReanimatedTripCard = ({ trip }) => {
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin((e) => {
      // Calculate rotation based on where user touched
      tiltX.value = withSpring(
        interpolate(e.y, [0, CARD_HEIGHT], [10, -10], Extrapolation.CLAMP)
      );
      tiltY.value = withSpring(
        interpolate(e.x, [0, CARD_WIDTH], [-10, 10], Extrapolation.CLAMP)
      );
    })
    .onUpdate((e) => {
      tiltX.value = interpolate(e.y, [0, CARD_HEIGHT], [10, -10], Extrapolation.CLAMP);
      tiltY.value = interpolate(e.x, [0, CARD_WIDTH], [-10, 10], Extrapolation.CLAMP);
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

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.cardContainer, rStyle]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: trip?.heroImage || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000' }}
            style={styles.image}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.gradientOverlay} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{trip?.status || 'UPCOMING'}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.destination} numberOfLines={1}>
            {trip?.destination?.split(',')[0] || 'Maldives'}
          </Text>
          <Text style={styles.date}>Aug 15 - Aug 22, 2026</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    overflow: 'hidden',
    marginVertical: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 15,
  },
  imageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  badge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 24,
  },
  destination: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
});
