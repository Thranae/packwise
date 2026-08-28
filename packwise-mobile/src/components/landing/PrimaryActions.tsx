import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Play, Sparkles } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';

const GlassButton = ({ label, icon: Icon, primary, delay = 0 }) => {
  const scale = useSharedValue(1);
  const pressIn = () => { scale.value = withSpring(0.95); };
  const pressOut = () => { scale.value = withSpring(1); };
  const a = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (primary) {
    return (
      <Animated.View entering={FadeInDown.duration(600).delay(delay)} style={styles.btnShadowPrimary}>
        <TouchableOpacity activeOpacity={1} onPressIn={pressIn} onPressOut={pressOut}>
          <Animated.View style={a}>
            <View style={styles.btnGlow} />
            <LinearGradient
              colors={['#5AA9FF', '#2F6BFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnPrimary}
            >
              <View style={styles.btnShine} />
              <Sparkles size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.btnPrimaryText}>{label}</Text>
              <ArrowRight size={16} color="#fff" style={{ marginLeft: 4 }} />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(delay)} style={styles.btnShadowSecondary}>
      <TouchableOpacity activeOpacity={1} onPressIn={pressIn} onPressOut={pressOut}>
        <Animated.View style={a}>
          <BlurView intensity={50} tint="light" style={styles.btnSecondary}>
            <View style={styles.btnShine} />
            <Icon size={14} color="#0f172a" style={{ marginRight: 6 }} />
            <Text style={styles.btnSecondaryText}>{label}</Text>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PrimaryActions() {
  return (
    <View style={styles.container}>
      <GlassButton label="Start Planning" icon={ArrowRight} primary delay={450} />
      <GlassButton label="Watch Demo" icon={Play} delay={550} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  btnShadowPrimary: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  btnGlow: {
    position: 'absolute',
    bottom: -6, left: 8, right: 8, height: 36,
    backgroundColor: '#2F6BFF',
    opacity: 0.35,
    borderRadius: 24,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  btnShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  btnShadowSecondary: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
});
