import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Briefcase, MapPin, Plane, Sparkles } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  useSharedValue,
  withDelay,
  Easing,
  FadeInDown,
  FadeIn
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Floating Particle Component
const FloatingElement = ({ children, delay = 0, yOffset = 15, duration = 3000, style }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-yOffset, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(yOffset, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View style={[animatedStyle, style, { position: 'absolute' }]}>
      {children}
    </Animated.View>
  );
};

export default function HeroBranding() {
  return (
    <View style={styles.container}>
      
      {/* Top Branding */}
      <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.brandingContainer}>
        {/* Custom Logo Composition */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoGlow} />
          <View style={styles.logoBase}>
            <Briefcase size={40} color="#2F6BFF" strokeWidth={1.5} />
            <View style={styles.logoOverlay}>
              <MapPin size={24} color="#fff" fill="#2F6BFF" strokeWidth={1.5} />
            </View>
          </View>
        </View>

        <Text style={styles.brandName}>PackWise</Text>
        <Text style={styles.brandSubtitle}>Your AI-powered travel companion.</Text>
      </Animated.View>

      {/* Hero Text */}
      <Animated.View entering={FadeInDown.duration(800).delay(300)} style={styles.heroTextContainer}>
        <Text style={styles.heroTitle}>
          Explore the World, {'\n'}
          <Text style={styles.heroHighlight}>Beautifully.</Text>
        </Text>
        <Text style={styles.heroDescription}>
          Plan smarter. Travel easier. Experience more.
        </Text>
      </Animated.View>

      {/* Floating Particles Atmosphere */}
      <Animated.View entering={FadeIn.duration(1500).delay(800)} style={StyleSheet.absoluteFill} pointerEvents="none">
        
        {/* Plane & Path */}
        <FloatingElement delay={0} yOffset={10} duration={4000} style={{ top: 220, left: width * 0.4 }}>
          <Plane size={24} color="rgba(255,255,255,0.9)" style={{ transform: [{ rotate: '45deg' }] }} />
        </FloatingElement>

        {/* Floating Map Pins */}
        <FloatingElement delay={500} yOffset={20} duration={5000} style={{ top: 180, left: 30 }}>
          <View style={styles.floatingPinGlow} />
          <MapPin size={28} color="#fff" fill="rgba(47, 107, 255, 0.8)" strokeWidth={1} />
        </FloatingElement>

        <FloatingElement delay={1200} yOffset={15} duration={4500} style={{ top: 150, right: 40 }}>
          <View style={styles.floatingPinGlow} />
          <MapPin size={32} color="#fff" fill="rgba(47, 107, 255, 0.8)" strokeWidth={1} />
        </FloatingElement>

        {/* Tiny Stars */}
        <FloatingElement delay={200} yOffset={5} duration={2000} style={{ top: 120, right: width * 0.2 }}>
          <Sparkles size={16} color="#5AA9FF" />
        </FloatingElement>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    zIndex: 10,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2F6BFF',
    opacity: 0.15,
    shadowColor: '#2F6BFF',
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  logoBase: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
  },
  logoOverlay: {
    position: 'absolute',
    top: 6,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1.0,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.2,
    marginTop: 4,
  },
  heroTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -1.5,
  },
  heroHighlight: {
    color: '#2F6BFF',
  },
  heroDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginTop: 16,
  },
  floatingPinGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F6BFF',
    opacity: 0.2,
    top: -6,
    left: -6,
    shadowColor: '#2F6BFF',
    shadowOpacity: 0.8,
    shadowRadius: 20,
  }
});
