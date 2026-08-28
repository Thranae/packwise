import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Briefcase, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogoIcon } from '../ui/LogoIcon';

export default function TopHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top + 8 : 24 }]}>
      <View style={styles.shadowWrapper}>
        <BlurView intensity={100} tint="light" style={styles.capsule}>
          {/* Top-lit caustic */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'transparent']}
            locations={[0, 0.2, 0.5]}
            style={StyleSheet.absoluteFill}
          />
          {/* Bottom depth shadow */}
          <LinearGradient
            colors={['transparent', 'rgba(47, 107, 255, 0.03)', 'rgba(0, 0, 0, 0.06)']}
            locations={[0.5, 0.8, 1]}
            style={StyleSheet.absoluteFill}
          />
          {/* Inner glow rim */}
          <View style={styles.innerGlowRim} pointerEvents="none" />
          <View style={styles.innerGlass}>
            
            {/* Logo & Brand */}
            <View style={styles.left}>
              <View style={styles.logoPillWrapper}>
                <BlurView intensity={80} tint="default" style={styles.logoPillGlass}>
                  <LinearGradient
                    colors={['rgba(224, 236, 255, 0.9)', 'rgba(224, 236, 255, 0.2)', 'transparent']}
                    locations={[0, 0.5, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <LogoIcon size={44} />
                  <Text style={styles.brandText}>PackWise</Text>
                </BlurView>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.right}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <BlurView intensity={80} tint="default" style={styles.buttonGlass}>
                  <LinearGradient
                    colors={['rgba(224, 236, 255, 0.9)', 'rgba(224, 236, 255, 0.2)', 'transparent']}
                    locations={[0, 0.5, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <Bell size={20} color="#0f172a" strokeWidth={2} />
                  <View style={styles.notificationDot} />
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.7}>
                <BlurView intensity={80} tint="default" style={styles.buttonGlass}>
                  <LinearGradient
                    colors={['rgba(224, 236, 255, 0.9)', 'rgba(224, 236, 255, 0.2)', 'transparent']}
                    locations={[0, 0.5, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }} 
                    style={styles.avatar} 
                  />
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  shadowWrapper: {
    borderRadius: 36,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 8,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 32,
    backgroundColor: 'rgba(235, 245, 255, 0.92)',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  innerGlowRim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
    borderRightColor: 'rgba(0, 0, 0, 0.02)',
  },
  innerGlass: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: 30,
    overflow: 'hidden',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPillWrapper: {
    height: 48,
    borderRadius: 24,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  logoPillGlass: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    paddingLeft: 2,
    paddingRight: 16,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonGlass: {
    flex: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  }
});
