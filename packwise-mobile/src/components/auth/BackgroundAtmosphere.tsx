import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// A premium Santorini sunrise image that matches the requested aesthetic
const SANTORINI_BG = 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200';

export default function BackgroundAtmosphere() {
  
  // Gentle breathing scale for the background image to give it life
  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.05, { duration: 15000, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
          )
        }
      ]
    };
  });

  return (
    <View style={styles.container}>
      {/* Base Image with Parallax/Breathing */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedScaleStyle]}>
        <Image
          source={{ uri: SANTORINI_BG }}
          style={styles.image}
          contentFit="cover"
          transition={1000}
        />
        
        {/* Soft Mist/Blur Overlay to keep it atmospheric and readable */}
        <View style={styles.mistOverlay} />
      </Animated.View>

      {/* Top Gradient for Status Bar / Logo readability */}
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)', 'transparent']}
        style={styles.topGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Bottom Gradient for Footer readability */}
      <LinearGradient
        colors={['transparent', 'rgba(16, 32, 64, 0.4)', 'rgba(16, 32, 64, 0.7)']}
        style={styles.bottomGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: '#fff',
  },
  image: {
    width: width * 1.1, // Oversized slightly for the breathing scale
    height: height * 1.1,
    left: -width * 0.05,
    top: -height * 0.05,
  },
  mistOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.25,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  }
});
