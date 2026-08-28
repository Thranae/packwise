import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { CalendarClock, PlaneTakeoff, CheckCircle2, LayoutGrid } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const CATEGORIES = [
  { id: 'upcoming', label: 'Upcoming', icon: CalendarClock },
  { id: 'active', label: 'Active', icon: PlaneTakeoff },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'all', label: 'All Trips', icon: LayoutGrid },
];

export default function CategorySelector() {
  const [activeCategory, setActiveCategory] = useState('upcoming');

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;

          return (
            <View key={cat.id} style={styles.pillWrapper}>
              <TouchableOpacity
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  styles.pill,
                  isActive && styles.activePill
                ]}
                activeOpacity={0.8}
              >
                {isActive && <View style={styles.activeGlow} />}
                <Icon size={16} color={isActive ? '#2563eb' : '#64748b'} />
                <Text style={[
                  styles.pillText,
                  { color: isActive ? '#2563eb' : '#64748b', fontWeight: isActive ? '700' : '500' }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
              {isActive && (
                <Animated.View 
                  entering={FadeInDown.duration(300)}
                  style={styles.indicator} 
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  pillWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  activePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#bfdbfe',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  activeGlow: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 24,
  },
  pillText: {
    fontSize: 14,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  }
});
