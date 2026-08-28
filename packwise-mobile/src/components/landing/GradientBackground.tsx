import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const GlowOrb = ({ x, y, size, color, delay = 0 }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(1.3, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) })
      ), -1, true)
    );
    opacity.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(0.9, { duration: 5000 }),
        withTiming(0.4, { duration: 5000 })
      ), -1, true)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{
      position: 'absolute', left: x, top: y,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color,
    }, style]} />
  );
};

export default function GradientBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f0f5ff' }]} />

      {/* Large vivid orbs that the glass will refract */}
      <GlowOrb x={-60} y={-40} size={320} color="rgba(47,107,255,0.12)" delay={0} />
      <GlowOrb x={width * 0.5} y={80} size={260} color="rgba(90,169,255,0.10)" delay={1500} />
      <GlowOrb x={width * 0.6} y={height * 0.35} size={300} color="rgba(47,107,255,0.08)" delay={3000} />
      <GlowOrb x={-80} y={height * 0.5} size={280} color="rgba(139,92,246,0.06)" delay={2000} />
      <GlowOrb x={width * 0.3} y={height * 0.7} size={340} color="rgba(47,107,255,0.10)" delay={4000} />
      <GlowOrb x={width * 0.7} y={height * 0.85} size={220} color="rgba(90,169,255,0.08)" delay={1000} />

      {/* Top gradient wash */}
      <LinearGradient
        colors={['rgba(47,107,255,0.08)', 'rgba(90,169,255,0.04)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.5 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Bottom gradient wash */}
      <LinearGradient
        colors={['transparent', 'rgba(47,107,255,0.04)', 'rgba(47,107,255,0.08)']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.4 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}
