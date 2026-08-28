import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { MapPin, Heart, Plane } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 20) / 2; // gap is 20, so 3rd card starts exactly off-screen
const CARD_HEIGHT = 220;

const TripCard = ({ item, index }: { item: any; index: number }) => {
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const heroImage = item.heroImage || item.images?.[0] || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800';
  const destName = item.destination ? item.destination.split(',')[0].toUpperCase() : 'UNKNOWN';
  const countryName = item.country ? item.country.toUpperCase() : 'COUNTRY';
  const destCode = item.destination ? item.destination.slice(0, 3).toUpperCase() : 'UNK';
  const originCode = item.country ? item.country.slice(0, 3).toUpperCase() : 'ORG';

  const toggleDock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsDockExpanded(!isDockExpanded);
  };

  const toggleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(!isLiked);
  };

  return (
    <Animated.View entering={FadeInRight.duration(600).delay(index * 150).springify()} style={styles.cardContainer}>
      <View style={styles.cardShadow}>
        <View style={styles.card}>
          <Image source={{ uri: heroImage }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />

          {/* Bottom Gradient for legibility */}
          <Animated.View pointerEvents="none" style={styles.bottomGradient}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* COLLAPSED PILL: Centered, hugging, map pin */}
          {!isDockExpanded && (
            <Animated.View entering={FadeInUp.springify().damping(18).stiffness(200)} exiting={FadeOutDown.duration(200)} style={styles.dynamicDockContainer}>
              <TouchableOpacity activeOpacity={0.9} onPress={toggleDock}>
                <View style={styles.depthShadow}>
                  <BlurView intensity={100} tint="light" style={styles.dockCollapsedPill}>
                    <MapPin size={10} color="#2F6BFF" />
                    <Text style={styles.dockTitleCollapsed} numberOfLines={1}>{destName}</Text>
                  </BlurView>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* EXPANDED CARDS */}
          {isDockExpanded && (
            <>
              {/* Top Right: 3D Heart */}
              <Animated.View entering={FadeInDown.delay(30).springify().damping(18).stiffness(200)} exiting={FadeOutUp.duration(200)} style={styles.heartContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={toggleLike} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <View style={styles.heartShadow}>
                    <BlurView intensity={100} tint="light" style={styles.heartPill}>
                      <Heart size={14} color={isLiked ? "#ef4444" : "#2F6BFF"} fill={isLiked ? "#ef4444" : "transparent"} style={styles.heart3D} />
                    </BlurView>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* Bottom: Flight Detail Card with Place Name on Top */}
              <Animated.View entering={FadeInUp.delay(60).springify().damping(18).stiffness(200)} exiting={FadeOutDown.duration(200)} style={styles.bottomDockContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={toggleDock}>
                  <View style={styles.depthShadow}>
                    <BlurView intensity={100} tint="light" style={styles.airplaneStatCard}>
                      
                      {/* Top Row: Place Name and Country */}
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardDestName} numberOfLines={1}>{destName}</Text>
                        <Text style={styles.cardCountryName} numberOfLines={1}>{countryName}</Text>
                      </View>

                      {/* Divider */}
                      <View style={styles.divider} />

                      {/* Bottom Row: Airplane Detail Thing */}
                      <View style={styles.routingRow}>
                        <Text style={styles.cityCode}>{originCode}</Text>
                        <View style={styles.planeIconWrapper}>
                          <View style={styles.planeLine} />
                          <Plane size={10} color="#2F6BFF" strokeWidth={2.5} style={styles.planeIcon} />
                          <View style={styles.planeLine} />
                        </View>
                        <Text style={styles.cityCode}>{destCode}</Text>
                      </View>

                    </BlurView>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}

        </View>
      </View>
    </Animated.View>
  );
};

export default function RecentTripsList({ trips }: { trips: any[] }) {
  if (!trips || trips.length === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.header}>
        <Text style={styles.title}>Recent Trips</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all {'>'}</Text>
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => <TripCard item={item} index={index} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={(CARD_WIDTH + 20) * 2}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: -0.2,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardShadow: {
    flex: 1,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#cbd5e1',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  depthShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },
  dynamicDockContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center', // hugging content
  },
  dockCollapsedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  dockTitleCollapsed: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heartContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  heartShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  heartPill: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart3D: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  bottomDockContainer: {
    position: 'absolute',
    bottom: 12,
    left: 8,
    right: 8,
  },
  airplaneStatCard: {
    backgroundColor: 'rgba(180, 220, 255, 0.85)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 6,
  },
  cardDestName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardCountryName: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(47, 107, 255, 0.15)',
    width: '100%',
    marginBottom: 6,
  },
  routingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityCode: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.8,
  },
  planeIconWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  planeLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(47, 107, 255, 0.3)',
    borderRadius: 1,
  },
  planeIcon: {
    marginHorizontal: 4,
    transform: [{ rotate: '90deg' }],
  },
});
