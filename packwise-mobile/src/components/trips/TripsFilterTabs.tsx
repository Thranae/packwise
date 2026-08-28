import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays, PlaneTakeoff, CheckCircle2, LayoutGrid, Edit3, Archive } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
// Fit exactly 3 chips: width - 48 (padding left & right) - 24 (two 12px gaps)
const CHIP_WIDTH = (width - 72) / 3;

const TABS = [
  { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
  { id: 'active', label: 'Active', icon: PlaneTakeoff },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'drafts', label: 'Drafts', icon: Edit3 },
  { id: 'archived', label: 'Archived', icon: Archive },
  { id: 'all', label: 'All', icon: LayoutGrid },
];

function FilterChip({ tab, isActive, onPress }) {
  const Icon = tab.icon;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isActive ? 1.05 : 1, { damping: 20, stiffness: 200 }) }
      ]
    };
  });

  return (
    <View style={isActive ? styles.activeShadow : styles.inactiveShadow}>
      <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={[styles.pillWrapper, isActive && styles.pillWrapperActive, { width: CHIP_WIDTH, position: 'relative' }]}
        >
          {/* Underneath Drop Shadow & 3D Extrusion illusion */}
          <View style={[
            StyleSheet.absoluteFillObject, 
            { 
              backgroundColor: isActive ? '#2F6BFF' : '#94a3b8', 
              borderRadius: 24, 
              top: 2, 
              opacity: isActive ? 0.08 : 0.05, 
              shadowColor: isActive ? '#2F6BFF' : '#94a3b8', 
              shadowOffset: {width: 0, height: 4}, 
              shadowOpacity: isActive ? 0.15 : 0.05, 
              shadowRadius: 8, 
              elevation: 4 
            }
          ]} />

          <BlurView intensity={40} tint="light" style={[styles.glass, isActive && styles.glassActive]}>
            {isActive ? (
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.3)', 'rgba(224, 236, 255, 0.1)']}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
              />
            )}
            
            {isActive && (
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'transparent', 'rgba(0,0,0,0.05)']}
                locations={[0, 0.3, 1]}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View style={styles.tabInner}>
              <Icon
                size={16}
                color={isActive ? "#3478F6" : "#56647D"}
                strokeWidth={2.5}
                style={isActive && styles.iconActiveShadow}
              />
              <Text
                style={[styles.tabText, isActive ? styles.textActive : styles.textInactive]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {tab.label}
              </Text>
            </View>
          </BlurView>
        </TouchableOpacity>
        
        {isActive && (
          <Animated.View
            entering={FadeInDown.duration(300).springify().damping(24).stiffness(200)}
            style={styles.activeIndicator}
          />
        )}
      </Animated.View>
    </View>
  );
}

export default function TripsFilterTabs() {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Chunk TABS into groups of 3
  const tabGroups = [];
  for (let i = 0; i < TABS.length; i += 3) {
    tabGroups.push(TABS.slice(i, i + 3));
  }

  return (
    <Animated.View entering={FadeInDown.duration(800).delay(150).springify().damping(24).stiffness(200)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 24} // Width of group (width-48) + gap (24)
        snapToAlignment="start"
        decelerationRate={0.992}
        disableIntervalMomentum={false}
        overScrollMode="never"
        bounces={true}
        contentContainerStyle={styles.container}
      >
        {tabGroups.map((group, groupIndex) => (
          <View key={`group-${groupIndex}`} style={styles.tabGroup}>
            {group.map((tab) => (
              <FilterChip 
                key={tab.id} 
                tab={tab} 
                isActive={activeTab === tab.id} 
                onPress={() => setActiveTab(tab.id)} 
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 24, // Gap between groups
    marginBottom: 24,
  },
  tabGroup: {
    flexDirection: 'row',
    gap: 12, // Gap between individual chips
    width: width - 48,
  },
  activeShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, // Reduced shadow
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveShadow: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pillWrapper: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  pillWrapperActive: {
    backgroundColor: 'rgba(200, 224, 255, 0.95)',
  },
  glass: {
    borderRadius: 24,
    overflow: 'hidden',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.7)',
    borderLeftColor: 'rgba(255,255,255,0.5)',
    borderBottomColor: 'rgba(0,0,0,0.03)',
    borderRightColor: 'rgba(0,0,0,0.03)',
  },
  glassActive: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255,255,255,1)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderBottomColor: 'rgba(0,0,0,0.06)',
    borderRightColor: 'rgba(0,0,0,0.06)',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  iconActiveShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },

  tabText: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  textActive: {
    color: '#3478F6',
  },
  textInactive: {
    color: '#56647D',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3478F6',
    marginTop: 8,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  }
});
