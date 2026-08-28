import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Briefcase } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withSpring, 
  interpolate,
  Easing,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');

export default function PackingWidget({ trip: tripProp }: { trip?: any }) {
  const { currentTrip } = useTrips();
  const trip = tripProp || currentTrip;
  
  // Mock data for packing
  const totalItems = 42;
  const packedItems = 28;
  const progressPercent = packedItems / totalItems;
  
  // 1. Entrance & Press Animations
  const enterAnim = useSharedValue(0);
  const scale = useSharedValue(1);
  const progressAnim = useSharedValue(0);
  
  // Continuous Animations
  const floatAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    // Trigger entrance
    enterAnim.value = withDelay(400, withSpring(1, { damping: 15, stiffness: 100 }));
    // Animate progress bar fill
    progressAnim.value = withDelay(800, withTiming(progressPercent, { duration: 1200, easing: Easing.out(Easing.exp) }));
    
    // Continuous floating for the briefcase icon
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Continuous subtle rotation for the sparkle
    rotateAnim.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(12, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [progressPercent]);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      opacity: enterAnim.value,
      transform: [
        { translateY: interpolate(enterAnim.value, [0, 1], [30, 0]) },
        { scale: scale.value }
      ]
    };
  });

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value * 100}%`
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatAnim.value }]
    };
  });

  const animatedSparkleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateAnim.value}deg` }]
    };
  });

  return (
    <Animated.View style={[styles.container, animatedCardStyle]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.shadowWrapper}>
        <BlurView intensity={100} tint="light" style={styles.cardInner}>
          
          {/* Glass/Lighting Gradients */}
          <LinearGradient
            colors={['rgba(240, 248, 255, 0.9)', 'rgba(240, 248, 255, 0.3)', 'rgba(240, 248, 255, 0)']}
            locations={[0, 0.4, 1]}
            style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}
          />
          <LinearGradient
            colors={['rgba(240, 248, 255, 0.8)', 'transparent', 'rgba(0,0,0,0.05)']}
            locations={[0, 0.5, 1]}
            style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}
          />

          <View style={styles.contentContainer}>
            {/* Top Section */}
            <View style={styles.topRow}>
              
              {/* Left Column: Text Pill & Title */}
              <View style={styles.leftColumn}>
                <View style={styles.textPillShadow}>
                  <BlurView intensity={80} tint="default" style={styles.textPillGlass}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                      locations={[0, 0.2, 0.5]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(47, 107, 255, 0.05)', 'rgba(0, 0, 0, 0.1)']}
                      locations={[0.5, 0.8, 1]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.textPillInnerStroke} pointerEvents="none" />
                    <Text style={styles.pillText}>PACKING LIST</Text>
                  </BlurView>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <Text style={styles.mainTitle}>{packedItems}</Text>
                  <Text style={styles.subTitle}>of {totalItems} items</Text>
                </View>
              </View>
              
              {/* Right Column: Plumpy Liquid Pill for Icon */}
              <Animated.View style={[styles.plumpyIconShadow, animatedIconStyle]}>
                <BlurView intensity={80} tint="default" style={styles.plumpyIconGlass}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                    locations={[0, 0.2, 0.5]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(47, 107, 255, 0.05)', 'rgba(0, 0, 0, 0.1)']}
                    locations={[0.5, 0.8, 1]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View style={styles.plumpyIconOuterStroke} pointerEvents="none" />
                  <Briefcase size={24} color="#8B5CF6" strokeWidth={2.5} />
                </BlurView>
              </Animated.View>
            </View>

            {/* Progress Bar Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFill, animatedProgressStyle]}>
                  <LinearGradient
                    colors={['#A78BFA', '#8B5CF6']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={StyleSheet.absoluteFillObject}
                  />
                </Animated.View>
              </View>
            </View>

            {/* Smart Insight */}
            <View style={styles.insightShadow}>
              <BlurView intensity={80} tint="default" style={styles.insightGlass}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.4)', 'transparent']}
                  locations={[0, 0.2, 0.8]}
                  style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(139, 92, 246, 0.05)', 'rgba(0, 0, 0, 0.08)']}
                  locations={[0.5, 0.8, 1]}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.insightOuterStroke} pointerEvents="none" />
                
                <View style={styles.insightContent}>
                  <View style={styles.insightIconWrapper}>
                    <Animated.Text style={[{ fontSize: 12 }, animatedSparkleStyle]}>✨</Animated.Text>
                  </View>
                  <Text style={styles.insightText}>Smart Tip: Pack a universal adapter for your destination.</Text>
                </View>
              </BlurView>
            </View>

          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    alignSelf: 'center',
    marginBottom: 24,
  },
  shadowWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 8,
  },
  cardInner: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.85)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
  },
  contentContainer: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftColumn: {
    flex: 1,
  },
  textPillShadow: {
    alignSelf: 'flex-start',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  textPillGlass: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  textPillInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0,0,0,0.02)',
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1.5,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0,
    marginBottom: 4,
  },
  plumpyIconShadow: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  plumpyIconGlass: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.9)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  plumpyIconOuterStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0,0,0,0.02)',
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  insightShadow: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  insightGlass: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.6)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  insightOuterStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0,0,0,0.02)',
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  insightIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  }
});
