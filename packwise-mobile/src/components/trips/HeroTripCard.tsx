import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Heart, Sun, Wallet, Users, Clock, CalendarDays, ChevronUp, ChevronDown, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown, FadeInUp, FadeOutUp, LinearTransition, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing, withSpring, interpolate, ZoomOut } from 'react-native-reanimated';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 420;

const StatItem = ({ icon: Icon, value, label }: any) => (
  <Animated.View 
    entering={FadeInUp.delay(120).springify().damping(34).stiffness(240)} 
    style={{ flex: 1 }}
  >
    <BlurView intensity={100} tint="light" style={styles.statItem}>
      <View style={styles.iconCircle}>
        <Icon size={14} color="#2F6BFF" />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
      </View>
    </BlurView>
  </Animated.View>
);

const SuckIntoIsland = (values: any) => {
  'worklet';
  const targetX = (width - 32) / 2; // Center of the card horizontally
  const targetY = 40; // Approx top Y inside the card
  
  const dX = targetX - (values.currentOriginX + values.currentWidth / 2);
  const dY = targetY - (values.currentOriginY + values.currentHeight / 2);

  const springConfig = { damping: 16, stiffness: 180, mass: 0.8 };

  return {
    initialValues: {
      transform: [
        { translateX: 0 },
        { translateY: 0 },
        { scaleX: 1 },
        { scaleY: 1 },
      ],
      opacity: 1,
      borderRadius: values.currentHeight / 2,
    },
    animations: {
      transform: [
        { translateX: withSpring(dX, springConfig) },
        { translateY: withSpring(dY, springConfig) },
        { scaleX: withSpring(0, springConfig) },
        { scaleY: withSpring(0, { damping: 16, stiffness: 150, mass: 0.8 }) }, // Subtle vertical drag
      ],
      // Extremely fast fade out
      opacity: withTiming(0, { duration: 77, easing: Easing.out(Easing.exp) }),
    },
  };
};

const GulpPillEntrance = () => {
  'worklet';
  return {
    initialValues: {
      transform: [
        { scaleX: 1.3 }, // Starts wide because it just swallowed the components
        { scaleY: 1.1 },
      ],
      opacity: 0,
    },
    animations: {
      transform: [
        { scaleX: withSpring(1, { damping: 10, stiffness: 200 }) },
        { scaleY: withSpring(1, { damping: 10, stiffness: 200 }) },
      ],
      opacity: withTiming(1, { duration: 150 }),
    }
  };
};

export default function HeroTripCard({ trip }: { trip: any }) {
  const router = useRouter();
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { setCurrentTrip } = useTrips();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentTrip(trip);
    router.navigate('/(tabs)/home');
  };

  const toggleDock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsDockExpanded(!isDockExpanded);
  };

  const heartScale = useSharedValue(1);
  const toggleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(!isLiked);
    heartScale.value = withSequence(
      withSpring(0.7, { damping: 10, stiffness: 400 }),
      withSpring(1.2, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
  };
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }]
  }));

  const breathScale = useSharedValue(1);
  useEffect(() => {
    if (!isDockExpanded) {
      breathScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      breathScale.value = withTiming(1, { duration: 300 });
    }
  }, [isDockExpanded]);
  const breathAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }]
  }));

  if (!trip) return null;

  const destName = trip.destination ? trip.destination.toUpperCase() : 'UNKNOWN';
  const countryName = trip.country ? trip.country.toUpperCase() : 'GREECE';
  const heroImage = trip.heroImage || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800';

  const start = new Date(trip.startDate || Date.now());
  const end = new Date(trip.endDate || Date.now());
  const isValidDate = (d: Date) => !isNaN(d.getTime());
  const travelers = trip.travelers || 1;
  const budget = trip.budget ? `₹${trip.budget}` : '₹0';
  const duration = (isValidDate(start) && isValidDate(end)) 
    ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))) + 'd'
    : '?d';
  const temp = trip.weather?.current?.temp ? `${trip.weather.current.temp}°C` : '24°C';

  const formatDateRange = (d1: Date, d2: Date) => {
    if (!isValidDate(d1) || !isValidDate(d2)) return 'Unknown Dates';
    const m1 = d1.toLocaleString('default', { month: 'short' }).toUpperCase();
    const d1Num = d1.getDate().toString().padStart(2, '0');
    const m2 = d2.toLocaleString('default', { month: 'short' }).toUpperCase();
    const d2Num = d2.getDate().toString().padStart(2, '0');
    const year = d2.getFullYear();
    return `${m1} ${d1Num} - ${m2} ${d2Num}, ${year}`;
  };

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.container}>
      <View style={styles.cardShadow}>
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.card}>
          <Image source={{ uri: heroImage }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          {isDockExpanded && (
            <Animated.View entering={FadeInDown.duration(400)} exiting={FadeOutDown.duration(300)} pointerEvents="none" style={StyleSheet.absoluteFill}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomGradient}
              />
            </Animated.View>
          )}

          {!isDockExpanded && (
            <Animated.View entering={GulpPillEntrance} exiting={FadeOutUp.duration(150)} style={styles.topDockContainer}>
              <Animated.View style={breathAnimatedStyle}>
                <TouchableOpacity activeOpacity={0.9} onPress={toggleDock}>
                  <BlurView intensity={100} tint="light" style={styles.collapsedPill}>
                    <MapPin size={16} color="#2F6BFF" />
                    <Text style={styles.dockToggleText}>{destName}</Text>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          )}

          {isDockExpanded && (
            <>
              <Animated.View entering={FadeInUp.springify().damping(18).stiffness(200)} exiting={SuckIntoIsland} style={styles.calendarContainer}>
                <BlurView intensity={100} tint="light" style={styles.frostedPill}>
                  <CalendarDays size={16} color="#2F6BFF" />
                  <Text style={styles.calendarText}>In {parseInt(duration)} days</Text>
                </BlurView>
              </Animated.View>
              
              <Animated.View entering={FadeInUp.delay(30).springify().damping(18).stiffness(200)} exiting={SuckIntoIsland} style={styles.heartContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={toggleLike}>
                  <Animated.View style={heartAnimatedStyle}>
                    <BlurView intensity={100} tint="light" style={styles.heartPill}>
                      <Heart size={20} color={isLiked ? "#ef4444" : "#2F6BFF"} fill={isLiked ? "#ef4444" : "transparent"} />
                    </BlurView>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(60).springify().damping(18).stiffness(200)} exiting={SuckIntoIsland} style={styles.centerTitles} pointerEvents="none">
                <Text style={styles.heroTitle}>{destName}</Text>
                <Text style={styles.heroSubtitle}>{countryName} • {formatDateRange(start, end)}</Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(90).springify().damping(18).stiffness(200)} exiting={SuckIntoIsland} style={styles.bottomDockContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={toggleDock}>
                  <BlurView intensity={100} tint="light" style={styles.chevronPill}>
                    <ChevronDown size={20} color="#2F6BFF" />
                  </BlurView>
                </TouchableOpacity>

                <View style={styles.statsRow}>
                  <StatItem icon={Sun} value={temp} label="SUNNY" />
                  <StatItem icon={Wallet} value={budget} label="BUDGET" />
                  <StatItem icon={Users} value={travelers} label="TRAVELERS" />
                  <StatItem icon={Clock} value={duration} label="DURATION" />
                </View>
              </Animated.View>
            </>
          )}

        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  cardShadow: {
    width: width - 32,
    height: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderRadius: 36,
  },
  card: {
    flex: 1,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#cbd5e1',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  centerTitles: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginTop: -20,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  topDockContainer: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    zIndex: 20,
  },
  collapsedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  dockToggleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  calendarContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  frostedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
  },
  calendarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  heartContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  heartPill: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomDockContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  chevronPill: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 6,
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
  },
  iconCircle: {
    width: 18, // Smaller to fit row
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: -2,
  },
  statLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  }
});
