import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withSpring,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { 
  MapPin, 
  Clock, 
  CloudSun, 
  DollarSign, 
  Wallet, 
  Box, 
  Bot,
  Share2,
  Camera,
  SquareDashed,
  Calculator,
  BookOpen,
  Download
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const LiquidDividerH = () => (
  <View style={styles.liquidDividerH}>
    <View style={styles.divHighlightH} />
    <View style={styles.divBodyH} />
    <View style={styles.divShadowH} />
  </View>
);

const LiquidDividerV = () => (
  <View style={styles.liquidDividerV}>
    <View style={styles.divHighlightV} />
    <View style={styles.divBodyV} />
    <View style={styles.divShadowV} />
  </View>
);

const MetricItem = ({ icon: Icon, title, value, color = "#2F6BFF" }: any) => {
  return (
    <View style={styles.metricItem}>
      <View style={styles.pillIconShadow}>
        <BlurView intensity={60} tint="light" style={styles.pillIconWrapper}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.3)', 'transparent']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.pillIconInnerStroke} pointerEvents="none" />
          <Icon size={16} color={color} strokeWidth={2.5} />
        </BlurView>
      </View>
      <View style={styles.metricTextGroup}>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text 
          style={[styles.metricValue, { color: title === 'Readiness' ? color : '#0f172a' }]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const ActionButton = ({ icon: Icon, text, color = "#0f172a", onPress }: any) => {
  return (
    <AnimatedTouchableOpacity activeOpacity={0.8} style={styles.actionButtonContainer} onPress={onPress}>
      <View style={styles.actionButtonShadow}>
        <BlurView intensity={80} tint="default" style={styles.actionButtonGlass}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
            locations={[0, 0.2, 0.5]}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={['transparent', 'rgba(47, 107, 255, 0.03)', 'rgba(0, 0, 0, 0.06)']}
            locations={[0.5, 0.8, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.actionButtonInnerStroke} pointerEvents="none" />
          <Icon size={16} color={color} strokeWidth={2.5} />
          <Text style={[styles.actionButtonText, { color }]}>{text}</Text>
        </BlurView>
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default function CommandCenterWidget({ trip }: { trip?: any }) {
  const enterAnim = useSharedValue(0);
  
  // Dummy data processing matching the PWA logic
  const destName = trip?.destination?.split('&')[0] || 'HAWAII';
  const displayTemp = trip?.weather?.current?.temp ? `${trip.weather.current.temp}°` : '24°';
  const displayBudget = trip?.budget ? Math.round(trip.budget / 7) : 150; // Mock 7 day trip for daily budget
  const displayCurrency = trip?.currency || 'USD';

  const [countdown, setCountdown] = useState('12d 5h');
  const [localTime, setLocalTime] = useState('14:30');

  useEffect(() => {
    enterAnim.value = withDelay(400, withSpring(1, { damping: 15, stiffness: 100 }));
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: enterAnim.value,
    transform: [
      { translateY: interpolate(enterAnim.value, [0, 1], [30, 0]) },
      { scale: interpolate(enterAnim.value, [0, 1], [0.95, 1]) }
    ]
  }));

  const handleShareStory = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Awesome!", "Sharing feature coming soon.");
  };

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.shadowWrapper}>
        <BlurView intensity={100} tint="light" style={styles.cardInner}>
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

          <View style={styles.contentPadding}>
        
            {/* Header: Destination & Countdown */}
            <View style={styles.headerRow}>
              <View style={styles.headerCol}>
                <View style={styles.badgeRow}>
                  <Text style={styles.badgeText}>Command center</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="#60a5fa" strokeWidth={2.5} />
                  <Text style={styles.destText} numberOfLines={1}>{destName}</Text>
                </View>
              </View>

              <View style={[styles.headerCol, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                <View style={styles.departsPillShadow}>
                  <BlurView intensity={80} tint="default" style={styles.departsPillGlass}>
                    <LinearGradient
                      colors={['rgba(240, 248, 255, 0.9)', 'rgba(240, 248, 255, 0.2)', 'transparent']}
                      locations={[0, 0.5, 1]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <Text style={styles.departsPillLabel}>Departs</Text>
                    <Text style={styles.departsPillValue}>{countdown}</Text>
                  </BlurView>
                </View>
              </View>
            </View>

            {/* 6 Widgets Partition with Depth & Grid */}
            <View style={styles.partitionShadow}>
              <View style={styles.partitionContainer}>
                {/* Top-lit caustic — bright white fading down */}
                <LinearGradient
                  colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                  locations={[0, 0.2, 0.5]}
                  style={StyleSheet.absoluteFillObject}
                />
                {/* Bottom shadow — dark edge for recessed look */}
                <LinearGradient
                  colors={['transparent', 'rgba(47, 107, 255, 0.03)', 'rgba(0, 0, 0, 0.08)']}
                  locations={[0.4, 0.75, 1]}
                  style={StyleSheet.absoluteFillObject}
                />
                {/* Inner glow rim */}
                <View style={styles.partitionInnerGlow} />
                <View style={styles.grid}>
                  <View style={styles.gridRow}>
                    <MetricItem icon={Clock} title="Local time" value={localTime} color="#60a5fa" />
                    <LiquidDividerV />
                    <MetricItem icon={CloudSun} title="Weather" value={`${displayTemp} Clear`} color="#fbbf24" />
                  </View>
                  <LiquidDividerH />
                  <View style={styles.gridRow}>
                    <MetricItem icon={DollarSign} title="Exchange" value={`1 ${displayCurrency} = ₹74`} color="#34d399" />
                    <LiquidDividerV />
                    <MetricItem icon={Wallet} title="Est today" value={`${displayBudget} PEN`} color="#60a5fa" />
                  </View>
                  <LiquidDividerH />
                  <View style={styles.gridRow}>
                    <MetricItem icon={Box} title="Packed" value="0%" color="#f97316" />
                    <LiquidDividerV />
                    <MetricItem icon={Bot} title="Readiness" value="100%" color="#a855f7" />
                  </View>
                </View>
              </View>
            </View>

            {/* 2x2 Action Buttons Grid */}
            <View style={styles.actionGrid}>
              <ActionButton icon={SquareDashed} text="Pack" color="#475569" onPress={() => {}} />
              <ActionButton icon={Calculator} text="Budget" color="#475569" onPress={() => {}} />
              <ActionButton icon={BookOpen} text="Itinerary / Calendar" color="#9333ea" onPress={() => {}} />
              <ActionButton icon={Download} text="Export Story" color="#2563eb" onPress={handleShareStory} />
            </View>
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  shadowWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 8,
  },
  cardInner: {
    flex: 1,
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
  contentPadding: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.8,
  },
  destText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.2,
  },
  departsPillShadow: {
    borderRadius: 16,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  departsPillGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  departsPillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  departsPillValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: -0.5,
  },
  partitionShadow: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
    marginBottom: 16,
  },
  partitionContainer: {
    backgroundColor: 'rgba(235, 245, 255, 0.85)',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  partitionInnerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.03)',
    borderRightWidth: 1.5,
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  grid: {
    flexDirection: 'column',
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liquidDividerH: {
    flexDirection: 'column',
    marginHorizontal: 6,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  divHighlightH: {
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 1,
  },
  divBodyH: {
    height: 1,
    backgroundColor: 'rgba(200, 225, 255, 0.35)',
  },
  divShadowH: {
    height: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.07)',
    borderRadius: 1,
  },
  liquidDividerV: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    shadowColor: '#0f172a',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  divHighlightV: {
    width: 1.5,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 1,
  },
  divBodyV: {
    width: 1,
    backgroundColor: 'rgba(200, 225, 255, 0.35)',
  },
  divShadowV: {
    width: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.07)',
    borderRadius: 1,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  pillIconShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  pillIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
  },
  pillIconInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  metricTextGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  metricTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  actionButtonContainer: {
    width: '48%',
    height: 40,
  },
  actionButtonShadow: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  actionButtonGlass: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(235, 245, 255, 0.85)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  actionButtonInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0,0,0,0.02)',
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  actionButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.3,
  }
});
