import React from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Cloud, Wind, Droplets } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withSpring, 
  interpolate,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');

export default function LiveWeatherCard({ trip: tripProp }: { trip?: any }) {
  const { currentTrip } = useTrips();
  const trip = tripProp || currentTrip;
  
  const destName = trip?.destination?.split('&')[0] || 'Cuzco';
  const temp = trip?.weather?.current?.temp || 15;
  const condition = trip?.weather?.current?.condition || 'Scattered Clouds';
  
  // 1. Entrance & Press Animations
  const enterAnim = useSharedValue(0);
  const scale = useSharedValue(1);

  // 2. Swaying Icon Animation
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    // Trigger entrance
    enterAnim.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 100 }));
    
    // Start continuous swaying loop
    rotation.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-6, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      opacity: enterAnim.value,
      transform: [
        { translateY: interpolate(enterAnim.value, [0, 1], [30, 0]) },
        { scale: scale.value }
      ]
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    };
  });

  return (
    <Animated.View style={[styles.container, animatedCardStyle]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.shadowWrapper}>
        <BlurView intensity={100} tint="light" style={styles.cardInner}>
          
          {/* Glass/Lighting Gradients (From HeroSection) */}
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
            {/* Top Section */}
            <View style={styles.topRow}>
              
              {/* Left Column: Text Pill, Temp, Location */}
              <View style={styles.leftColumn}>
                <View style={styles.textPillShadow}>
                  <BlurView intensity={80} tint="default" style={styles.textPillGlass}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                      locations={[0, 0.2, 0.5]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(47, 107, 255, 0.05)', 'rgba(0, 0, 0, 0.1)']}
                      locations={[0.5, 0.8, 1]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.textPillInnerStroke} pointerEvents="none" />
                    <Text style={styles.liveWeatherText}>LIVE WEATHER</Text>
                  </BlurView>
                </View>

                <Text style={styles.temperature}>{temp}°</Text>
                <Text style={styles.location}>{destName}</Text>
              </View>
              
              {/* Right Column: Plumpy Liquid Pill for Icon */}
              <Animated.View style={[styles.plumpyIconShadow, animatedIconStyle]}>
                <BlurView intensity={80} tint="default" style={styles.plumpyIconGlass}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                    locations={[0, 0.2, 0.5]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(47, 107, 255, 0.05)', 'rgba(0, 0, 0, 0.1)']}
                    locations={[0.5, 0.8, 1]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View style={styles.plumpyIconOuterStroke} pointerEvents="none" />
                  <Cloud size={26} color="#2F6BFF" strokeWidth={2.5} />
                </BlurView>
              </Animated.View>
            </View>



            {/* Middle Section */}
            <View style={styles.middleRow}>
              <Text style={styles.conditionText}>{condition}</Text>
              <Text style={styles.highLowText}>H:14° L:7°</Text>
            </View>
            
            {/* Bottom Section */}
            <View style={styles.bottomRow}>
              <View style={styles.statItem}>
                <Wind size={16} color="#64748b" />
                <Text style={styles.statText}>1.54 m/s</Text>
              </View>
              <View style={styles.statItem}>
                <Droplets size={16} color="#64748b" />
                <Text style={styles.statText}>36%</Text>
              </View>
              <View style={styles.statItemRight}>
                <Text style={styles.feelsLikeText}>Feels like 14°</Text>
              </View>
            </View>
          </View>
          
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    alignSelf: 'center',
    marginBottom: 24,
  },
  shadowWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 8,
  },
  cardInner: {
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftColumn: {
    flex: 1,
  },
  textPillShadow: {
    alignSelf: 'flex-start',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  textPillGlass: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  textPillInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0,0,0,0.02)',
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  liveWeatherText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3b82f6',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  temperature: {
    fontSize: 52,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -2,
    lineHeight: 56,
  },
  location: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    marginTop: -4,
  },
  plumpyIconShadow: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  plumpyIconGlass: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.9)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  plumpyIconOuterStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0,0,0,0.02)',
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  plumpyIconInnerShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  plumpyIconInnerGlass: {
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
  },
  plumpyIconInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },


  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  conditionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  highLowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  statItemRight: {
    alignItems: 'flex-end',
  },
  feelsLikeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  }
});
