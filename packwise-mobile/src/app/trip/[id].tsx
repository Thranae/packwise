import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, Sparkles, MapPin, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HeroSection from '../../components/overview/HeroSection';
import CommandCenterWidget from '../../components/overview/CommandCenterWidget';
import BudgetWidget from '../../components/overview/BudgetWidget';
import LiveWeatherCard from '../../components/overview/LiveWeatherCard';
import PackingWidget from '../../components/overview/PackingWidget';
import { useTrips } from '../../context/TripContext';
import api from '../../services/api';

export default function TripOverviewPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { trips, currentTrip, setCurrentTrip } = useTrips();
  const [fetchedTrip, setFetchedTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Match the trip from context trips or currentTrip
  const trip = useMemo(() => {
    if (fetchedTrip) return fetchedTrip;
    const fromList = trips?.find((t: any) => (t._id || t.id) === id);
    if (fromList) return fromList;
    if (currentTrip && ((currentTrip._id || currentTrip.id) === id || !id)) return currentTrip;
    return trips?.[0] || currentTrip || null;
  }, [id, trips, currentTrip, fetchedTrip]);

  useEffect(() => {
    if (trip && trip !== currentTrip) {
      setCurrentTrip(trip);
    }
  }, [trip]);

  // Attempt fetch if not available in memory and id is provided
  useEffect(() => {
    let isMounted = true;
    if (id && !trip && typeof id === 'string' && !id.startsWith('mock-')) {
      setLoading(true);
      api.get(`/trips/${id}`)
        .then(res => {
          if (isMounted && res.data?.data) {
            setFetchedTrip(res.data.data);
            setCurrentTrip(res.data.data);
          }
        })
        .catch(err => {
          console.warn('Could not fetch trip by id:', err.message);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [id, trip]);

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const title = trip?.destination || 'My Trip';
      await Share.share({
        message: `Check out my trip to ${title} on PackWise!`,
      });
    } catch (e) {
      // dismissed
    }
  };

  const destTitle = trip?.destination || 'Trip Overview';
  const country = trip?.country || '';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Background Dark Theme with Ambient Glow */}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={['#020617', '#0b1329', '#151c38', '#020617']}
            locations={[0, 0.35, 0.75, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Top Header Bar */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <BlurView intensity={40} tint="light" style={styles.iconPill}>
                <ChevronLeft size={20} color="#fff" strokeWidth={2.5} />
              </BlurView>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle} numberOfLines={1}>{destTitle}</Text>
              {country ? (
                <View style={styles.countryRow}>
                  <MapPin size={10} color="#94a3b8" />
                  <Text style={styles.headerSubtitle} numberOfLines={1}>{country}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity 
              onPress={handleShare}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <BlurView intensity={40} tint="light" style={styles.iconPill}>
                <Share2 size={16} color="#fff" strokeWidth={2} />
              </BlurView>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading trip data...</Text>
            </View>
          ) : (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* 1. Command Center Hero Section */}
              <HeroSection trip={trip} />

              {/* 2. Action Hub and Quick Telemetry */}
              <CommandCenterWidget trip={trip} />

              {/* 3. Real-Time Budget Intel */}
              <BudgetWidget trip={trip} />

              {/* 4. Live Atmospheric Weather Card */}
              <LiveWeatherCard trip={trip} />

              {/* 5. Smart Luggage Packing Assistant */}
              <PackingWidget trip={trip} />
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  backText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
});
