import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Mic, SlidersHorizontal } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TripsSearchBar() {
  return (
    <Animated.View entering={FadeInDown.duration(800).delay(100).springify().damping(24).stiffness(200)} style={styles.container}>
      
      {/* Search Bar Capsule */}
      <View style={[styles.dropletShadow, { flex: 1 }]}>
        <View style={styles.searchWrapper}>
          <BlurView intensity={80} tint="default" style={styles.dropletGlass}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.3)', 'rgba(224, 236, 255, 0.1)']}
              locations={[0, 0.4, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.innerGlass}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.05)']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.searchInner}>
                <Search size={20} color="#2F6BFF" style={[styles.searchIcon, styles.iconShadow]} strokeWidth={2.5} />
                <TextInput
                  style={styles.input}
                  placeholder="Search trips, places or bookings..."
                  placeholderTextColor="#64748b"
                />
                <TouchableOpacity activeOpacity={0.7}>
                  <Mic size={20} color="#2F6BFF" style={[styles.micIcon, styles.iconShadow]} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </View>



    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    zIndex: 10,
  },
  dropletShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 12,
  },
  searchWrapper: {
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(200, 224, 255, 0.95)',
  },
  filterWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(200, 224, 255, 0.95)',
  },
  dropletGlass: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255,255,255,1)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderBottomColor: 'rgba(0,0,0,0.15)',
    borderRightColor: 'rgba(0,0,0,0.15)',
  },
  innerGlass: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  searchInner: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  micIcon: {
    marginLeft: 10,
  },
  iconShadow: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  }
});
