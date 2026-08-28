import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plane, Ticket, Hotel, Bed } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const EVENTS = [
  {
    id: '1',
    month: 'MAY',
    day: '24',
    weekday: 'Sat',
    type: 'flight',
    title: 'Boarding',
    subtitle: 'DEL  →  JTR',
    time: '3:45 PM',
    desc: 'Indira Gandhi Intl. Airport',
    icon: Plane,
    actionIcon: Ticket,
  },
  {
    id: '2',
    month: 'MAY',
    day: '25',
    weekday: 'Sun',
    type: 'hotel',
    title: 'Check-in',
    subtitle: 'Canaves Oia Epitome',
    time: '2:00 PM',
    desc: 'Oia, Santorini',
    icon: Hotel,
    actionIcon: Bed,
  }
];

export default function TimelineSection() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Upcoming Timeline</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all {'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timelineContainer}>
        {EVENTS.map((event, index) => {
          const isLast = index === EVENTS.length - 1;
          const MainIcon = event.icon;
          const ActionIcon = event.actionIcon;

          return (
            <Animated.View 
              key={event.id} 
              entering={FadeInUp.duration(600).delay(index * 150)}
              style={styles.eventRow}
            >
              {/* Left Date Column */}
              <View style={styles.dateCol}>
                <Text style={styles.month}>{event.month}</Text>
                <Text style={styles.day}>{event.day}</Text>
                <Text style={styles.weekday}>{event.weekday}</Text>
              </View>

              {/* Center Line Column */}
              <View style={styles.lineCol}>
                <View style={[styles.iconBadge, event.type === 'flight' ? styles.flightBadge : styles.hotelBadge]}>
                  <MainIcon size={12} color="#fff" style={event.type === 'flight' ? { transform: [{ rotate: '45deg' }] } : {}} />
                </View>
                {!isLast && <View style={styles.verticalLine} />}
              </View>

              {/* Right Content Column */}
              <View style={styles.contentCol}>
                <View style={styles.card}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{event.title}</Text>
                    <View style={styles.subtitleRow}>
                      <Text style={styles.cardSubtitle}>{event.subtitle}</Text>
                      <View style={styles.timeBadge}>
                        <Text style={styles.timeText}>{event.time}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardDesc}>{event.desc}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.actionBtn}>
                    <ActionIcon size={20} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 40, // extra space before bottom nav
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 24,
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
  timelineContainer: {
    flexDirection: 'column',
  },
  eventRow: {
    flexDirection: 'row',
    minHeight: 100,
  },
  dateCol: {
    width: 48,
    alignItems: 'center',
    paddingTop: 4,
  },
  month: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  day: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  weekday: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  lineCol: {
    width: 40,
    alignItems: 'center',
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 8,
  },
  flightBadge: {
    backgroundColor: '#2563eb',
  },
  hotelBadge: {
    backgroundColor: '#8b5cf6',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginTop: 4,
    borderStyle: 'dashed', // React Native doesn't support dashed borders perfectly on View directly without tricks, but we use solid light color or a dashed trick. Actually we will just use a solid thin line or try dashed.
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  contentCol: {
    flex: 1,
    paddingBottom: 24, // spacing between events
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  timeBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3b82f6',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eff6ff',
    marginLeft: 12,
  }
});
