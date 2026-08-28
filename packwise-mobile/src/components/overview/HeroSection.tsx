import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Wallet, CloudSun, Map, ArrowRight, MapPin, Calendar } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');

const LiquidPill = ({ icon: Icon, text, color = "#2F6BFF" }: { icon: any, text: string, color?: string }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.pillShadow}>
    <BlurView intensity={80} tint="default" style={styles.pillGlass}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
        locations={[0, 0.2, 0.5]}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['transparent', 'rgba(47, 107, 255, 0.03)', 'rgba(0, 0, 0, 0.06)']}
        locations={[0.5, 0.8, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.pillInnerStroke} pointerEvents="none" />
      <View style={styles.pillIconShadow}>
        <BlurView intensity={60} tint="light" style={styles.pillIconWrapper}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.3)', 'transparent']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.pillIconInnerStroke} pointerEvents="none" />
          <Icon size={16} color={color} strokeWidth={2.5} />
        </BlurView>
      </View>
      <Text style={styles.pillText} numberOfLines={1} adjustsFontSizeToFit>{text}</Text>
    </BlurView>
  </TouchableOpacity>
);

const MiniFrostedPill = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <View style={styles.miniPillShadow}>
    <BlurView intensity={60} tint="light" style={styles.miniPillGlass}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.6)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.miniPillInnerStroke} pointerEvents="none" />
      <Icon size={12} color="#0f172a" strokeWidth={3} />
      <Text style={styles.miniPillText}>{text}</Text>
    </BlurView>
  </View>
);

export default function HeroSection({ trip: tripProp }: { trip?: any }) {
  const { currentTrip } = useTrips();
  const trip = tripProp || currentTrip;

  const destName = trip?.destination || 'Hawaii';
  const heroImage = trip?.heroImage || 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=100&w=1200';
  const budget = trip?.budget ? `$${trip.budget.toLocaleString()}` : '$2,400';
  const temp = trip?.weather?.current?.temp ? `${trip.weather.current.temp}° Sunny` : '78° Sunny';

  const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
  const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
  const formatDate = (d: Date) => {
    const m = d.toLocaleString('default', { month: 'short' });
    return `${m} ${d.getDate()}`;
  };
  const dateRange = trip?.startDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'Oct 24 - Oct 28';

  const enterAnim = useSharedValue(0);

  useEffect(() => {
    enterAnim.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 100 }));
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: enterAnim.value,
      transform: [
        { translateY: interpolate(enterAnim.value, [0, 1], [30, 0]) },
        { scale: interpolate(enterAnim.value, [0, 1], [0.95, 1]) }
      ]
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.shadowWrapper}>
        <BlurView intensity={100} tint="light" style={styles.cardInner}>
          
          <LinearGradient
            colors={['rgba(240, 248, 255, 0.9)', 'rgba(240, 248, 255, 0.3)', 'rgba(240, 248, 255, 0)']}
            locations={[0, 0.4, 1]}
            style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}
          />

          <LinearGradient
            colors={['rgba(240, 248, 255, 0.8)', 'transparent', 'rgba(0,0,0,0.05)']}
            locations={[0, 0.5, 1]}
            style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}
          />
          
          <View style={styles.contentContainer}>
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: heroImage }}
                style={styles.heroImage}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.imageInnerStroke} pointerEvents="none" />
              
              {/* Image Overlay: Location & Dates */}
              <View style={styles.imageOverlayBottomLeft}>
                <View style={styles.overlayRow}>
                  <View style={styles.iconGlow}>
                    <MapPin size={18} color="#38BDF8" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.imageOverlayTitle}>{destName}</Text>
                </View>
                
                <MiniFrostedPill icon={Calendar} text={dateRange} />
              </View>
            </View>

            {/* Liquid Glass Pills Grid */}
            <View style={styles.statsContainer}>
              <View style={styles.statsColumn}>
                <LiquidPill icon={Wallet} text={budget} color="#10B981" />
                <LiquidPill icon={CloudSun} text={temp} color="#F59E0B" />
              </View>
              <View style={styles.statsColumn}>
                <LiquidPill icon={Map} text="View Map" color="#2F6BFF" />
                <LiquidPill icon={ArrowRight} text="Continue" />
              </View>
            </View>
          </View>

        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  shadowWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 8,
  },
  cardInner: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.85)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  imageInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imageOverlayBottomLeft: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    gap: 8,
  },
  overlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconGlow: {
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  imageOverlayTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  miniPillShadow: {
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  miniPillGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  miniPillInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  miniPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  statsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 16,
  },
  statsColumn: {
    flex: 1,
    gap: 12,
  },
  pillShadow: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  pillGlass: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    paddingLeft: 4,
    paddingRight: 16,
    gap: 8,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.85)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  pillInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0,0,0,0.02)',
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  pillIconShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  pillIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
  },
  pillIconInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  pillText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  }
});
