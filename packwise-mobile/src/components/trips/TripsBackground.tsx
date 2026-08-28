import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Circle, Blur, RadialGradient, vec } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function TripsBackground() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // Lissajous curve paths for highly organic, non-repeating movement
  const c1x = useDerivedValue(() => (width / 2) + Math.cos(progress.value) * (width * 0.4));
  const c1y = useDerivedValue(() => (height / 3) + Math.sin(progress.value * 1.5) * (height * 0.3));

  const c2x = useDerivedValue(() => (width / 2) + Math.cos(progress.value * 1.2 + Math.PI) * (width * 0.5));
  const c2y = useDerivedValue(() => (height / 2) + Math.sin(progress.value * 0.8 + Math.PI) * (height * 0.4));

  const c3x = useDerivedValue(() => (width / 2) + Math.cos(progress.value * 0.9 + Math.PI / 2) * (width * 0.45));
  const c3y = useDerivedValue(() => (height / 1.5) + Math.sin(progress.value * 1.3 + Math.PI / 2) * (height * 0.35));

  const c4x = useDerivedValue(() => (width / 2) + Math.cos(progress.value * 1.4 + Math.PI / 4) * (width * 0.35));
  const c4y = useDerivedValue(() => (height / 4) + Math.sin(progress.value * 1.1 + Math.PI / 4) * (height * 0.3));

  return (
    <View style={styles.container} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Soft, deep base */}
        <Circle cx={width / 2} cy={height / 2} r={height}>
          <RadialGradient
            c={vec(width / 2, height / 2)}
            r={height}
            colors={['#e0e7ff', '#f1f5f9']}
          />
        </Circle>

        <Blur blur={100}>
          {/* Rich Blue */}
          <Circle cx={c1x} cy={c1y} r={300} color="rgba(47, 107, 255, 0.4)" />
          
          {/* Vibrant Purple */}
          <Circle cx={c2x} cy={c2y} r={350} color="rgba(139, 92, 246, 0.35)" />
          
          {/* Cyan/Teal */}
          <Circle cx={c3x} cy={c3y} r={280} color="rgba(6, 182, 212, 0.3)" />

          {/* Soft Pink Highlight */}
          <Circle cx={c4x} cy={c4y} r={250} color="rgba(236, 72, 153, 0.25)" />
        </Blur>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  }
});
