import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  FadeInUp
} from 'react-native-reanimated';
import { Plane, QrCode } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PlumpyPill = ({ children, wrapperStyle, contentStyle }: any) => (
  <View style={[wrapperStyle, { position: 'relative' }]}>
    {/* Underneath Drop Shadow & 3D Extrusion illusion */}
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#2F6BFF', borderRadius: 16, top: 4, opacity: 0.1, shadowColor: '#2F6BFF', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 }]} />
    
    <BlurView intensity={80} tint="default" style={styles.plumpyPillGlass}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.4)', 'rgba(240, 248, 255, 0.8)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'transparent', 'rgba(0,0,0,0.05)']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={contentStyle}>
        {children}
      </View>
    </BlurView>
  </View>
);

export default function HolographicBoardingPass({ trip }: { trip: any }) {
  const pulseOpacity = useSharedValue(0.3);

  if (!trip) return null;

  const originCode = trip.country ? trip.country.slice(0, 3).toUpperCase() : 'UNK';
  const destCode = trip.destination ? trip.destination.slice(0, 3).toUpperCase() : 'UNK';

  useEffect(() => {
    // Start the ambient pulse animation loop
    pulseOpacity.value = withRepeat(
      withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Up Next</Text>
      
      <Animated.View entering={FadeInUp.delay(100).springify().damping(20).stiffness(150)}>
        <View style={styles.ticketWrapper}>
          
          {/* Ambient Glow */}
          <View style={styles.glow} />
          
          {/* Glass Ticket Base */}
          <BlurView intensity={90} tint="default" style={styles.ticketGlass}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.6)', 'rgba(240, 248, 255, 0.8)']}
              locations={[0, 0.4, 1]}
              style={StyleSheet.absoluteFill}
            />
            {/* Highlight Edge Gradient */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.8)', 'transparent', 'rgba(0,0,0,0.05)']}
              locations={[0, 0.2, 1]}
              style={StyleSheet.absoluteFill}
            />


            {/* Ambient Pulse Foil Layer */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedPulseStyle]}>
              <LinearGradient
                colors={[
                  'rgba(147, 197, 253, 0.4)', // Cyan
                  'transparent',
                  'rgba(244, 114, 182, 0.3)', // Pink
                  'transparent',
                  'rgba(255, 255, 255, 0.6)', // White highlight
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            {/* --- TOP SECTION (MAIN FLIGHT DETAILS) --- */}
            <View style={styles.topSection}>
              
              {/* Header */}
              <View style={styles.headerRow}>
                <Text style={styles.airlineName}>NEON AIRWAYS</Text>
                <PlumpyPill wrapperStyle={styles.flightBadgeWrapper} contentStyle={styles.flightBadgeContent}>
                  <Text style={styles.flightNumber}>NA-402</Text>
                </PlumpyPill>
              </View>

              {/* Huge Routing */}
              <View style={styles.routingRow}>
                <Text style={styles.cityCode}>{originCode}</Text>
                
                <View style={styles.planeIconWrapper}>
                  <View style={styles.planeLine} />
                  <Plane size={24} color="#2F6BFF" strokeWidth={2} style={styles.planeIcon} />
                  <View style={styles.planeLine} />
                </View>
                
                <Text style={styles.cityCode}>{destCode}</Text>
              </View>

              {/* Passenger & Detailed Info Grid */}
              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>PASSENGER</Text>
                  <Text style={styles.infoValue}>ALEX CHEN</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>DATE</Text>
                  <Text style={styles.infoValue}>OCT 12</Text>
                </View>
              </View>
              
              <PlumpyPill wrapperStyle={styles.infoGridSecondaryWrapper} contentStyle={styles.infoGridSecondaryContent}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>BOARDING</Text>
                  <Text style={styles.infoValueHighlight}>08:45</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>GATE</Text>
                  <Text style={styles.infoValueHighlight}>A24</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>SEAT</Text>
                  <Text style={styles.infoValueHighlight}>12F</Text>
                </View>
              </PlumpyPill>

            </View>

            {/* --- PERFORATION LINE --- */}
            <View style={styles.perforationWrapper}>
              {/* Cutouts */}
              <View style={[styles.cutout, styles.cutoutLeft]} />
              <View style={[styles.cutout, styles.cutoutRight]} />
              {/* Dashed Line */}
              <View style={styles.dashedLine} />
            </View>

            {/* --- BOTTOM SECTION (STUB) --- */}
            <View style={styles.bottomSection}>
              <View style={styles.stubContent}>
                <QrCode size={56} color="#0f172a" strokeWidth={1.5} />
                <View style={styles.stubTextCol}>
                  <Text style={styles.stubLabel}>BOARDING GROUP</Text>
                  <Text style={styles.stubGroup}>A</Text>
                </View>
              </View>
            </View>

          </BlurView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 48,
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#0f172a',
    letterSpacing: -0.8,
    marginBottom: 16,
  },
  ticketWrapper: {
    alignSelf: 'center',
    width: '100%',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 32,
    backgroundColor: 'rgba(200, 224, 255, 0.4)',
  },
  ticketGlass: {
    borderRadius: 28,
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
  plumpyPillGlass: {
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
  topSection: {
    padding: 24,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  airlineName: {
    fontFamily: 'Outfit_900Black',
    fontSize: 15,
    color: '#0f172a',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  flightBadgeWrapper: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  flightBadgeContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  flightNumber: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 11,
    color: '#2F6BFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  routingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  cityCode: {
    fontFamily: 'Outfit_900Black',
    fontSize: 56,
    color: '#0f172a',
    letterSpacing: -3,
    lineHeight: 64,
  },
  planeIconWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  planeLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(47, 107, 255, 0.3)',
    borderRadius: 1,
  },
  planeIcon: {
    marginHorizontal: 8,
    transform: [{ rotate: '90deg' }],
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 9.5,
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  infoGridSecondaryWrapper: {
    marginTop: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  infoGridSecondaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
  },
  infoBox: {
    flex: 1,
  },
  infoValueHighlight: {
    fontFamily: 'Outfit_900Black',
    fontSize: 24,
    color: '#2F6BFF',
    letterSpacing: -0.8,
  },
  perforationWrapper: {
    height: 32,
    justifyContent: 'center',
    overflow: 'visible',
    marginVertical: -16,
    zIndex: 10,
  },
  cutout: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  cutoutLeft: {
    left: -16,
    borderRightWidth: 1,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cutoutRight: {
    right: -16,
    borderLeftWidth: 1.5,
    borderRightWidth: 0,
    borderTopColor: 'rgba(255,255,255,0.9)',
    borderBottomColor: 'transparent',
  },
  dashedLine: {
    height: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  bottomSection: {
    padding: 24,
    paddingTop: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stubContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stubTextCol: {
    alignItems: 'flex-end',
  },
  stubLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  stubGroup: {
    fontFamily: 'Outfit_900Black',
    fontSize: 48,
    color: '#0f172a',
    lineHeight: 52,
  },
});
