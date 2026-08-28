import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Plane } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

export default function GreetingHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.Text entering={FadeInDown.duration(600).delay(100)} style={styles.greeting}>
          Good morning, Explorer 👋
        </Animated.Text>
        
        <View style={styles.titleRow}>
          <Animated.Text entering={FadeInDown.duration(600).delay(200)} style={styles.title}>
            My Trips
          </Animated.Text>
          <Animated.View entering={FadeInRight.duration(800).delay(400)} style={styles.sparkle}>
            <Text style={styles.sparkleIcon}>✦</Text>
          </Animated.View>
        </View>

        <Animated.Text entering={FadeInDown.duration(600).delay(300)} style={styles.subtitle}>
          Every journey, beautifully organized.
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInRight.duration(800).delay(500)}>
        <TouchableOpacity style={styles.addButtonContainer} activeOpacity={0.8}>
          <View style={styles.addButtonGlow} />
          <BlurView intensity={80} tint="default" style={styles.addButton}>
            <Plus size={32} color="#2563eb" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Decorative Plane animation in background */}
      <Animated.View entering={FadeInRight.duration(1200).delay(800)} style={styles.planeDecoration}>
         <Plane size={24} color="rgba(148, 163, 184, 0.4)" style={{ transform: [{ rotate: '45deg' }] }} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    zIndex: 2,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1.5,
  },
  sparkle: {
    marginLeft: 4,
    marginTop: 4,
  },
  sparkleIcon: {
    color: '#3b82f6',
    fontSize: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  addButtonContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  addButtonGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  planeDecoration: {
    position: 'absolute',
    right: 90,
    top: 40,
    zIndex: 1,
  }
});
