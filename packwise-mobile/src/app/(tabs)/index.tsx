import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeIn, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { tripService } from '../../services/trip.service';
import { LogoIcon } from '../../components/ui/LogoIcon';

import TripsHeader from '../../components/trips/TripsHeader';
import TripsSearchBar from '../../components/trips/TripsSearchBar';
import TripsFilterTabs from '../../components/trips/TripsFilterTabs';
import HeroTripCard from '../../components/trips/HeroTripCard';
import RecentTripsList from '../../components/trips/RecentTripsList';
import HolographicBoardingPass from '../../components/trips/HolographicBoardingPass';

const MOCK_TRIPS = [
  {
    _id: 'mock-1',
    destination: 'Santorini',
    country: 'Greece',
    startDate: new Date('2025-05-24').toISOString(),
    endDate: new Date('2025-06-02').toISOString(),
    status: 'upcoming',
    heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=100&w=1600&auto=format&fit=crop',
    budget: 1500,
    travelers: 2,
    weather: { current: { temp: 24 } }
  },
  {
    _id: 'mock-2',
    destination: 'Kyoto',
    country: 'Japan',
    startDate: new Date('2024-10-10').toISOString(),
    endDate: new Date('2024-10-24').toISOString(),
    status: 'completed',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=100&w=1600&auto=format&fit=crop',
    budget: 2000,
    travelers: 1,
    weather: { current: { temp: 18 } }
  },
  {
    _id: 'mock-3',
    destination: 'Reykjavik',
    country: 'Iceland',
    startDate: new Date('2025-12-05').toISOString(),
    endDate: new Date('2025-12-15').toISOString(),
    status: 'planning',
    heroImage: 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?q=100&w=1600&auto=format&fit=crop',
    budget: 3500,
    travelers: 2,
    weather: { current: { temp: -2 } }
  },
  {
    _id: 'mock-4',
    destination: 'Kerala',
    country: 'India',
    startDate: new Date('2024-04-10').toISOString(),
    endDate: new Date('2024-04-16').toISOString(),
    status: 'completed',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=100&w=1600&auto=format&fit=crop',
    budget: 1200,
    travelers: 2,
    weather: { current: { temp: 28 } }
  },
  {
    _id: 'mock-5',
    destination: 'Zermatt',
    country: 'Switzerland',
    startDate: new Date('2025-02-14').toISOString(),
    endDate: new Date('2025-02-21').toISOString(),
    status: 'ongoing',
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=100&w=1600&auto=format&fit=crop',
    budget: 4500,
    travelers: 4,
    weather: { current: { temp: -5 } }
  },
  {
    _id: 'mock-6',
    destination: 'Cappadocia',
    country: 'Turkey',
    startDate: new Date('2024-06-15').toISOString(),
    endDate: new Date('2024-06-21').toISOString(),
    status: 'completed',
    heroImage: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=100&w=1600&auto=format&fit=crop',
    budget: 1800,
    travelers: 2,
    weather: { current: { temp: 22 } }
  },
  {
    _id: 'mock-7',
    destination: 'Bali',
    country: 'Indonesia',
    startDate: new Date('2025-08-10').toISOString(),
    endDate: new Date('2025-08-24').toISOString(),
    status: 'planning',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=100&w=1600&auto=format&fit=crop',
    budget: 2200,
    travelers: 2,
    weather: { current: { temp: 31 } }
  },
  {
    _id: 'mock-8',
    destination: 'Amalfi Coast',
    country: 'Italy',
    startDate: new Date('2023-07-10').toISOString(),
    endDate: new Date('2023-07-20').toISOString(),
    status: 'completed',
    heroImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=100&w=1600&auto=format&fit=crop',
    budget: 3200,
    travelers: 2,
    weather: { current: { temp: 27 } }
  },
  {
    _id: 'mock-9',
    destination: 'Petra',
    country: 'Jordan',
    startDate: new Date('2025-11-05').toISOString(),
    endDate: new Date('2025-11-12').toISOString(),
    status: 'planning',
    heroImage: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=100&w=1600&auto=format&fit=crop',
    budget: 1900,
    travelers: 1,
    weather: { current: { temp: 20 } }
  },
  {
    _id: 'mock-10',
    destination: 'Queenstown',
    country: 'New Zealand',
    startDate: new Date('2024-01-10').toISOString(),
    endDate: new Date('2024-01-25').toISOString(),
    status: 'completed',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=100&w=1600&auto=format&fit=crop',
    budget: 5500,
    travelers: 4,
    weather: { current: { temp: 19 } }
  },
  {
    _id: 'mock-11',
    destination: 'Banff',
    country: 'Canada',
    startDate: new Date('2025-07-01').toISOString(),
    endDate: new Date('2025-07-15').toISOString(),
    status: 'upcoming',
    heroImage: 'https://images.unsplash.com/photo-1498855926480-d98e83099315?q=100&w=1600&auto=format&fit=crop',
    budget: 3100,
    travelers: 2,
    weather: { current: { temp: 22 } }
  }
];

export default function TripsTab() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Extract top 3 upcoming/planning trips for the hero carousel
  const sortedTrips = [...(trips.length > 0 ? trips : MOCK_TRIPS)].sort((a, b) => new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime());
  const upcomingTrips = sortedTrips.filter(t => t.status === 'upcoming' || t.status === 'planning').slice(0, 3);
  const heroTrips = upcomingTrips.length > 0 ? upcomingTrips : [sortedTrips[0]];
  const recentTrips = sortedTrips.filter(t => !heroTrips.some(ht => ht._id === t._id));

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveHeroIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setAnimationKey(prev => prev + 1);

      const fetchTrips = async () => {
        try {
          if (isActive) setIsLoading(true);
          const startTime = Date.now();
          const res = await tripService.getTrips();
          
          if (isActive) {
            if (res.data && res.data.length > 0) {
              setTrips(res.data);
            } else {
              setTrips(MOCK_TRIPS);
            }
          }
          
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 3000 - elapsed);
          
          setTimeout(() => {
            if (isActive) {
              setIsLoading(false);
            }
          }, remaining);

        } catch (error) {
          console.log('Falling back to mock trips. (Server error:', error.message || error, ')');
          if (isActive) setTrips(MOCK_TRIPS);
          setTimeout(() => {
            if (isActive) setIsLoading(false);
          }, 3000);
        }
      };

      fetchTrips();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
        <Animated.View exiting={ZoomOut.duration(400)} style={{ alignItems: 'center' }}>
          
          {/* Small Transparent Glass Pill with Fluid Glide */}
          <Animated.View 
            entering={FadeInDown.duration(1000)}
            style={{ marginBottom: 24 }}
          >
            <View
              style={{
                width: 64, height: 64, borderRadius: 20,
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                borderTopWidth: 2,
                borderLeftWidth: 1.5,
                borderBottomWidth: 1.5,
                borderRightWidth: 1,
                borderTopColor: 'rgba(255, 255, 255, 1)',
                borderLeftColor: 'rgba(255, 255, 255, 0.8)',
                borderBottomColor: 'rgba(0, 0, 0, 0.15)',
                borderRightColor: 'rgba(0, 0, 0, 0.1)',
                shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.2, shadowRadius: 32,
                elevation: 24,
              }}
            >
              {/* Convex 3D Base */}
              <LinearGradient
                colors={['#f8fafc', '#cbd5e1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              
              <LogoIcon size={64} />
              
              {/* Thick Glass Lens Overlay */}
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)']}
                locations={[0, 0.4, 1]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
              />
            </View>
          </Animated.View>
          
          {/* Clean Solid Navy Blue Typography */}
          <Animated.View entering={FadeInDown.duration(1000).delay(300)}>
            <Text style={{ fontSize: 38, fontWeight: '900', letterSpacing: -1.5, textAlign: 'center', color: '#0f172a' }}>
              PackWise.
            </Text>
          </Animated.View>

        </Animated.View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <Animated.ScrollView
        key={`trips-scroll-${animationKey}`}
        entering={FadeInDown.duration(600).damping(20)}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        overScrollMode="never"
      >
        <TripsHeader />
        <TripsSearchBar />
        <TripsFilterTabs />

        {/* 4. Hero Cards Carousel */}
        {heroTrips.length > 0 && (
          <View>
            <Animated.FlatList
              data={heroTrips}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => <HeroTripCard trip={item} />}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              snapToAlignment="center"
              decelerationRate="fast"
            />
            
            {/* Dynamic Pagination Dots */}
            {heroTrips.length > 1 && (
              <View style={styles.pagination}>
                {heroTrips.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeHeroIndex && styles.dotActive]} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* 5. Horizontal List of Recent Trips */}
        {recentTrips.length > 0 && <RecentTripsList trips={recentTrips} />}

        {/* 6. Holographic Boarding Pass (Using the first hero trip) */}
        {heroTrips[0] ? <HolographicBoardingPass trip={heroTrips[0]} /> : null}

      </Animated.ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 0,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  dotActive: {
    width: 20,
    height: 6,
    backgroundColor: '#2F6BFF',
  }
});
