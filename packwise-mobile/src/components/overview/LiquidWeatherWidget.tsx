import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { MapPin, Sun, CloudRain, Droplets, Wind } from 'lucide-react-native';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');

export default function LiquidWeatherWidget({ trip: tripProp }: { trip?: any }) {
  const { currentTrip } = useTrips();
  const trip = tripProp || currentTrip;
  
  // Destination data
  const destName = trip?.destination || 'Santorini';
  // Use a stunning, deep image for the weather background
  const weatherImage = trip?.heroImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=100&w=800';
  
  const isRaining = false; // Mock weather condition
  const temp = trip?.weather?.current?.temp || 78;
  const condition = isRaining ? 'Rain Showers' : 'Sunny & Clear';
  const WeatherIcon = isRaining ? CloudRain : Sun;
  
  // Shared values for accelerometer data
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  
  useEffect(() => {
    let subscription: any;
    
    // Set update interval to ~60fps for smooth motion
    Accelerometer.setUpdateInterval(16);
    
    subscription = Accelerometer.addListener(({ x, y, z }) => {
      // Smooth out the sensor data using springs
      tiltX.value = withSpring(x, { damping: 20, stiffness: 90 });
      tiltY.value = withSpring(y, { damping: 20, stiffness: 90 });
    });
    
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);
  
  // Parallax style for the background image
  const parallaxBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(tiltX.value, [-1, 1], [-25, 25], Extrapolation.CLAMP) },
        { translateY: interpolate(tiltY.value, [-1, 1], [-25, 25], Extrapolation.CLAMP) },
        { scale: 1.15 } // Scale up slightly to prevent edges showing during translation
      ]
    };
  });
  
  // Dynamic light reflection that moves across the glass
  const reflectionStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(tiltX.value, [-1, 1], [-180, 180], Extrapolation.CLAMP) },
        { translateY: interpolate(tiltY.value, [-1, 1], [-180, 180], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(Math.abs(tiltX.value) + Math.abs(tiltY.value), [0, 1.5], [0.3, 0.9], Extrapolation.CLAMP)
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.shadowWrapper}>
        <View style={styles.cardInner}>
          
          {/* Parallax Background Image */}
          <Animated.View style={[StyleSheet.absoluteFillObject, parallaxBackgroundStyle]}>
            <Image 
              source={{ uri: weatherImage }} 
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={300}
            />
          </Animated.View>
          
          {/* Deep Base Gradient for Text Readability */}
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.65)']}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Dynamic Light Reflection / Lens Flare */}
          <Animated.View style={[styles.flareWrapper, reflectionStyle]} pointerEvents="none">
            <LinearGradient
              colors={isRaining ? ['rgba(255,255,255,0.2)', 'transparent'] : ['rgba(255,255,255,0.4)', 'transparent']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.flare}
            />
          </Animated.View>

          {/* Frosted Glass Content Area */}
          <BlurView intensity={30} tint="light" style={styles.contentContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.headerRow}>
              <View style={styles.locationTag}>
                <MapPin size={12} color="#fff" strokeWidth={3} />
                <Text style={styles.locationText}>{destName}</Text>
              </View>
              <WeatherIcon size={24} color="#fff" strokeWidth={2.5} style={styles.iconShadow} />
            </View>

            <View style={styles.mainInfo}>
              <Text style={styles.temperature}>{temp}°</Text>
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Droplets size={14} color="#38BDF8" strokeWidth={2.5} />
                <Text style={styles.statText}>12%</Text>
              </View>
              <View style={styles.statPill}>
                <Wind size={14} color="#A7F3D0" strokeWidth={2.5} />
                <Text style={styles.statText}>8 mph</Text>
              </View>
            </View>
            
          </BlurView>
          
          {/* Glass Border Highlight */}
          <View style={styles.glassBorder} pointerEvents="none" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    alignSelf: 'center',
    marginBottom: 16,
  },
  shadowWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 10,
  },
  cardInner: {
    height: 180,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  flareWrapper: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    transform: [{ rotate: '45deg' }],
  },
  flare: {
    flex: 1,
    borderRadius: 150,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  iconShadow: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  temperature: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 60,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  conditionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: -4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderTopWidth: 2,
    borderLeftWidth: 1.5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderBottomColor: 'rgba(0,0,0,0.2)',
  }
});
