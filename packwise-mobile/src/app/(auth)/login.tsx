import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundAtmosphere from '../../components/auth/BackgroundAtmosphere';
import HeroBranding from '../../components/auth/HeroBranding';
import GlassLoginCard from '../../components/auth/GlassLoginCard';
import AuthFooter from '../../components/auth/AuthFooter';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Deep Background Layer */}
      <BackgroundAtmosphere />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Scrollable Content Layer */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 2. Top Branding & Floating Particles */}
          <HeroBranding />

          {/* 3. The Interactive Glass Form */}
          <GlassLoginCard />

          {/* 4. Social & Footer Links */}
          <AuthFooter />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // Extra padding at very bottom for small screens
  }
});
