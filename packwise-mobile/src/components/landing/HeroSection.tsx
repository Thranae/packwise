import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { MapPin, Plane, Sparkles } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const Float = ({ children, delay = 0, y = 12, dur = 3500, style }) => {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(-y, { duration: dur, easing: Easing.inOut(Easing.sin) }),
        withTiming(y, { duration: dur, easing: Easing.inOut(Easing.sin) })
      ), -1, true)
    );
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  return <Animated.View style={[{ position: 'absolute' }, style, a]}>{children}</Animated.View>;
};

export default function HeroSection() {
  return (
    <View style={styles.container}>
      {/* Greeting — glass pill */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)}>
        <View style={styles.greetingWrapper}>
          <BlurView intensity={100} tint="light" style={styles.greetingPill}>
            <View style={styles.shine} />
            <Text style={styles.greetingText}>Good Morning 👋</Text>
          </BlurView>
        </View>
      </Animated.View>

      {/* Heading */}
      <Animated.View entering={FadeInDown.duration(700).delay(200)}>
        <Text style={styles.heading}>
          Travel <Text style={styles.accent}>Smarter.</Text>
        </Text>
        <Text style={styles.heading}>Explore Further.</Text>
      </Animated.View>

      {/* Description */}
      <Animated.View entering={FadeInDown.duration(700).delay(350)}>
        <Text style={styles.desc}>
          AI-powered planning, packing, budgeting{'\n'}and discovery — all personalized{'\n'}for your perfect journey.
        </Text>
      </Animated.View>

      {/* Floating ambient */}
      <Animated.View entering={FadeIn.duration(1500).delay(800)} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Float delay={0} y={10} dur={4000} style={{ top: 10, right: 60 }}>
          <View style={styles.pinGlow} />
          <MapPin size={22} color="#fff" fill="rgba(47,107,255,0.7)" strokeWidth={1.2} />
        </Float>
        <Float delay={600} y={8} dur={3200} style={{ top: 80, right: 20 }}>
          <Plane size={18} color="rgba(47,107,255,0.35)" style={{ transform: [{ rotate: '35deg' }] }} />
        </Float>
        <Float delay={1200} y={6} dur={2800} style={{ top: 50, right: 100 }}>
          <Sparkles size={14} color="#5AA9FF" />
        </Float>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    position: 'relative',
  },
  greetingWrapper: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: 'transparent',
  },
  greetingPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  shine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  heading: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  accent: {
    color: '#2F6BFF',
  },
  desc: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
    lineHeight: 24,
    marginTop: 20,
  },
  pinGlow: {
    position: 'absolute',
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#2F6BFF', opacity: 0.15,
    top: -5, left: -5,
  },
});
