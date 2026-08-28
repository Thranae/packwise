import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Mic, Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// A single animated bar for the audio waveform
const WaveformBar = ({ delay }: { delay: number }) => {
  const height = useSharedValue(6);

  useEffect(() => {
    height.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(14 + Math.random() * 10, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(6, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View style={[styles.waveBar, animatedStyle]} />
  );
};

export default function AuthHeroSection({ userName = "Alex" }) {
  const enterAnim = useSharedValue(0);
  const breathScale = useSharedValue(1);

  useEffect(() => {
    enterAnim.value = withDelay(100, withSpring(1, { damping: 15, stiffness: 100 }));
    
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGreetingStyle = useAnimatedStyle(() => ({
    opacity: enterAnim.value,
    transform: [{ translateY: interpolate(enterAnim.value, [0, 1], [20, 0]) }]
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    opacity: enterAnim.value,
    transform: [
      { translateY: interpolate(enterAnim.value, [0, 1], [30, 0]) },
      { scale: interpolate(enterAnim.value, [0, 1], [0.95, 1]) }
    ]
  }));

  const animatedMicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }]
  }));

  return (
    <View style={styles.container}>
      {/* Greeting Section */}
      <Animated.View style={[styles.greetingContainer, animatedGreetingStyle]}>
        <Text style={styles.greetingSub}>Good Morning,</Text>
        <View style={styles.nameRow}>
          <Text style={styles.greetingTitle}>Welcome back, </Text>
          <Text style={styles.greetingName}>{userName}</Text>
        </View>
      </Animated.View>

      {/* AI Voice Input Pill */}
      <Animated.View style={[styles.inputWrapper, animatedInputStyle]}>
        <View style={styles.inputShadow} />
        
        <TouchableOpacity activeOpacity={0.9} style={styles.inputTouchable}>
          <BlurView intensity={80} tint="light" style={styles.inputPill}>
            {/* Left side: AI Icon & Placeholder Text */}
            <View style={styles.inputTextGroup}>
              <Sparkles size={16} color="#60a5fa" strokeWidth={2.5} />
              <Text style={styles.placeholderText}>Where to next, {userName}?</Text>
            </View>

            {/* Right side: Waveform & Mic Button */}
            <View style={styles.inputRightGroup}>
              {/* Fake Audio Waveform */}
              <View style={styles.waveformContainer}>
                <WaveformBar delay={0} />
                <WaveformBar delay={150} />
                <WaveformBar delay={300} />
                <WaveformBar delay={450} />
                <WaveformBar delay={600} />
              </View>

              {/* Glowing Mic Button */}
              <Animated.View style={animatedMicStyle}>
                <LinearGradient
                  colors={['#3b82f6', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.micButton}
                >
                  <Mic size={18} color="#fff" strokeWidth={2.5} />
                </LinearGradient>
              </Animated.View>
            </View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greetingContainer: {
    marginBottom: 24,
  },
  greetingSub: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b', // slate-500
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a', // slate-900
    letterSpacing: -0.5,
  },
  greetingName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3b82f6', // blue-500
    letterSpacing: -0.5,
  },
  inputWrapper: {
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  inputShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3b82f6',
    borderRadius: 32,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    transform: [{ translateY: 6 }, { scaleX: 0.95 }],
  },
  inputTouchable: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
    height: 64,
  },
  inputTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b', // slate-500
  },
  inputRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
  },
  waveBar: {
    width: 3,
    backgroundColor: '#8b5cf6', // purple-500
    borderRadius: 1.5,
    opacity: 0.7,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  }
});
