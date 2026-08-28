import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring, FadeIn, Layout } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GREETINGS = ['GOOD MORNING', 'READY TO FLY?', 'ADVENTURE AWAITS', "LET'S EXPLORE", 'PACK YOUR BAGS'];

export default function TripsHeader() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isAutoReverting, setIsAutoReverting] = useState(false);
  const isPressed = useSharedValue(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const pillAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isPressed.value ? 0.92 : 1, { damping: 14, stiffness: 250 }) },
        { rotateX: withSpring(isPressed.value ? '15deg' : '0deg', { damping: 14, stiffness: 250 }) }
      ],
    };
  });

  const handlePress = () => {
    setIsAutoReverting(false);
    setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setIsAutoReverting(true);
      setGreetingIndex(0);
    }, 7000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Animated.View entering={FadeInDown.delay(0).springify().damping(16).stiffness(150)} style={styles.greetingPillWrapper}>
          <AnimatedPressable 
            onPressIn={() => isPressed.value = true}
            onPressOut={() => isPressed.value = false}
            onPress={handlePress}
            style={pillAnimStyle}
            layout={Layout.springify().damping(18).stiffness(200)}
          >
            <View style={styles.greetingPillGlow} />
            <BlurView intensity={80} tint="default" style={styles.greetingPillGlass}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.3)', 'rgba(224, 236, 255, 0.1)']}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'transparent', 'rgba(0,0,0,0.05)']}
                locations={[0, 0.3, 1]}
                style={StyleSheet.absoluteFill}
              />
              {isAutoReverting && greetingIndex === 0 ? (
                <Animated.Text key="auto-revert" entering={FadeIn.duration(500)} style={styles.greeting}>
                  {GREETINGS[greetingIndex]}
                </Animated.Text>
              ) : (
                <Text style={styles.greeting}>{GREETINGS[greetingIndex]}</Text>
              )}
            </BlurView>
          </AnimatedPressable>
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(50).springify().damping(14).stiffness(150)} style={styles.title}>My Trips</Animated.Text>
        <Animated.Text entering={FadeInDown.delay(100).springify().damping(18).stiffness(150)} style={styles.subtitle}>Every journey, beautifully organized.</Animated.Text>
      </View>

      <Animated.View entering={FadeInRight.duration(800).springify().damping(24).stiffness(200)} style={styles.right}>
        <TouchableOpacity activeOpacity={0.8} style={styles.dropletWrapper}>
          <View style={styles.dropletGlow} />
          <BlurView intensity={80} tint="default" style={styles.dropletGlass}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.3)', 'rgba(224, 236, 255, 0.1)']}
              locations={[0, 0.4, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.dropletInnerGlass}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.05)']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
              />
              <Plus size={32} color="#2F6BFF" strokeWidth={3} style={styles.dropletIcon} />
            </View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 136, // Clear the TopHeader completely
    paddingBottom: 24,
    zIndex: 10,
  },
  left: {
    flex: 1,
  },
  greetingPillWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  greetingPillGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    backgroundColor: 'rgba(200, 224, 255, 0.3)',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  greetingPillGlass: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255,255,255,1)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  greeting: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: '#2F6BFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 58,
    color: '#18233D',
    letterSpacing: -2.5,
    lineHeight: 64,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: '#56647D',
    letterSpacing: -0.3,
  },
  right: {
    paddingLeft: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  dropletWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(200, 224, 255, 0.95)',
  },
  dropletGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: -3,
    left: -3,
    borderRadius: 35,
    backgroundColor: '#eff6ff',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 32,
    elevation: 16,
  },
  dropletGlass: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255,255,255,1)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderBottomColor: 'rgba(0,0,0,0.15)',
    borderRightColor: 'rgba(0,0,0,0.15)',
  },
  dropletInnerGlass: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(200, 224, 255, 0.6)',
  },
  dropletIcon: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
});
