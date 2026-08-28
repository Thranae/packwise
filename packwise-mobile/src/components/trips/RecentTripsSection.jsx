import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Heart, MoreVertical, Plane, CheckCircle2, CalendarClock, PlaneTakeoff } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

const FALLBACK_TRIPS = [
  {
    _id: '1',
    destination: 'Kerala, India',
    status: 'completed',
    startDate: '2025-04-10T00:00:00Z',
    endDate: '2025-04-16T00:00:00Z',
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600'],
  },
  {
    _id: '2',
    destination: 'Switzerland',
    status: 'active',
    startDate: '2025-04-22T00:00:00Z',
    endDate: '2025-04-29T00:00:00Z',
    images: ['https://images.unsplash.com/photo-1531366936337-7c912a458b07?q=80&w=600'],
  }
];

export default function RecentTripsSection() {
  const { trips, currentTrip } = useTrips();
  
  // Exclude the currently featured trip from the recent list
  const recentTripsData = trips && trips.length > 0 
    ? trips.filter(t => t._id !== currentTrip?._id)
    : FALLBACK_TRIPS;

  const getStatusDetails = (status) => {
    switch (status) {
      case 'completed': return { icon: CheckCircle2, color: '#10b981', text: 'Completed' };
      case 'active': return { icon: PlaneTakeoff, color: '#3b82f6', text: 'Active' };
      default: return { icon: CalendarClock, color: '#8b5cf6', text: 'Upcoming' };
    }
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return 'Dates pending';
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const renderItem = ({ item, index }) => {
    const { icon: StatusIcon, color, text } = getStatusDetails(item.status);
    const imageUri = item.images?.[0] || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600';

    return (
      <Animated.View entering={FadeInRight.duration(600).delay(index * 100)} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image
            source={{ uri: imageUri }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.gradientOverlay} />
          
          <TouchableOpacity style={styles.heartBtn} activeOpacity={0.8}>
            <BlurView intensity={30} tint="light" style={styles.heartBlur}>
              <Heart size={16} color="#1f2937" />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.destination} numberOfLines={1}>{item.destination}</Text>
            
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, { backgroundColor: `${color}30`, borderColor: color }]}>
                <StatusIcon size={10} color={color} style={item.status === 'active' && { transform: [{ rotate: '-45deg' }] }} />
                <Text style={[styles.statusText, { color }]}>{text}</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.dates} numberOfLines={1}>{formatDateRange(item.startDate, item.endDate)}</Text>
              <TouchableOpacity>
                <MoreVertical size={16} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent Trips</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all {'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={recentTripsData}
          renderItem={renderItem}
          estimatedItemSize={CARD_WIDTH}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  listContainer: {
    height: CARD_HEIGHT + 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    paddingBottom: 10,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  heartBlur: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  destination: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  dates: {
    flex: 1,
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  }
});
