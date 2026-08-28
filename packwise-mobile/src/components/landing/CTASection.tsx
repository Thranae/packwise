import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Luggage } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CTASection() {
  const scale = useSharedValue(1);
  const pressIn = () => { scale.value = withSpring(0.96); };
  const pressOut = () => { scale.value = withSpring(1); };
  const a = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInUp.duration(700).delay(1100)} style={styles.container}>
      <View style={styles.cardShadow}>
        <BlurView intensity={100} tint="light" style={styles.card}>
          <View style={styles.shine} />

          <View style={styles.iconContainer}>
            <Luggage size={48} color="rgba(47,107,255,0.15)" />
          </View>

          <Text style={styles.heading}>Ready for your next{'\n'}adventure?</Text>
          <Text style={styles.subtitle}>Let PackWise handle the rest.</Text>

          <TouchableOpacity
            activeOpacity={1}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={styles.buttonWrapper}
          >
            <Animated.View style={a}>
              <View style={styles.btnGlow} />
              <LinearGradient
                colors={['#5AA9FF', '#2F6BFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btn}
              >
                <View style={styles.btnShine} />
                <Text style={styles.btnText}>Start Exploring</Text>
                <ArrowRight size={20} color="#fff" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, marginBottom: 40 },
  cardShadow: {
    borderRadius: 28,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    position: 'relative',
  },
  shine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '45%', backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconContainer: { position: 'absolute', top: 20, right: 24 },
  heading: {
    fontSize: 24, fontWeight: '900', color: '#0f172a',
    textAlign: 'center', lineHeight: 32, letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, fontWeight: '500', color: '#64748b',
    textAlign: 'center', marginBottom: 28,
  },
  buttonWrapper: { width: '100%' },
  btnGlow: {
    position: 'absolute', bottom: -6, left: 16, right: 16, height: 36,
    backgroundColor: '#2F6BFF', opacity: 0.3, borderRadius: 28,
  },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 56, borderRadius: 28, gap: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  btnShine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '45%', backgroundColor: 'rgba(255,255,255,0.12)',
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
