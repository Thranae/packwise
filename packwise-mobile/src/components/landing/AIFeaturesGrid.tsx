import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Route, Package, Wallet, CloudSun, ArrowLeftRight, WifiOff, Phone, Languages, ChevronRight,
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GAP = 12;
const COL_W = (width - 48 - GAP) / 2;

const FEATURES = [
  { icon: Route,          label: 'Smart Itinerary',    desc: 'AI-crafted plans just for you',  color: '#2F6BFF', tall: true },
  { icon: Package,        label: 'Packing AI',         desc: 'Never forget essentials again',  color: '#f97316', tall: false },
  { icon: Wallet,         label: 'Budget Planner',     desc: 'Track, optimize and save more',  color: '#10b981', tall: false },
  { icon: CloudSun,       label: 'Weather Intel',      desc: 'Real-time alerts for your trip', color: '#8b5cf6', tall: true },
  { icon: ArrowLeftRight, label: 'Currency Converter',  desc: 'Live exchange rates',           color: '#f43f5e', tall: false },
  { icon: WifiOff,        label: 'Offline Travel Kit',  desc: 'Access everything offline',     color: '#06b6d4', tall: true },
  { icon: Phone,          label: 'Emergency Contacts',  desc: 'Stay safe anywhere',            color: '#ef4444', tall: false },
  { icon: Languages,      label: 'Language Assistant',   desc: 'Talk like a local anywhere',   color: '#2F6BFF', tall: false },
];

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <Animated.View entering={FadeInUp.duration(600).delay(800 + index * 80)}>
      <TouchableOpacity activeOpacity={0.85} style={[styles.cardShadow, feature.tall && styles.cardTall]}>
        <BlurView intensity={100} tint="light" style={styles.card}>
          <View style={styles.cardShine} />
          <View style={[styles.iconWrap, { backgroundColor: `${feature.color}12` }]}>
            <Icon size={24} color={feature.color} />
          </View>
          <Text style={styles.cardLabel}>{feature.label}</Text>
          <Text style={styles.cardDesc}>{feature.desc}</Text>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function AIFeaturesGrid() {
  const left = FEATURES.filter((_, i) => i % 2 === 0);
  const right = FEATURES.filter((_, i) => i % 2 === 1);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600).delay(750)} style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Everything you need.</Text>
          <Text style={styles.headingBold}>Nothing <Text style={styles.underline}>you don't.</Text></Text>
        </View>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={14} color="#2F6BFF" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.grid}>
        <View style={styles.col}>
          {left.map((f, i) => <FeatureCard key={f.label} feature={f} index={i * 2} />)}
        </View>
        <View style={[styles.col, { marginTop: 24 }]}>
          {right.map((f, i) => <FeatureCard key={f.label} feature={f} index={i * 2 + 1} />)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, marginBottom: 40 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    marginBottom: 24,
  },
  heading: { fontSize: 22, fontWeight: '700', color: '#0f172a', lineHeight: 28 },
  headingBold: { fontSize: 22, fontWeight: '900', color: '#0f172a', lineHeight: 28 },
  underline: { textDecorationLine: 'underline', textDecorationColor: '#2F6BFF' },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2F6BFF' },
  grid: { flexDirection: 'row', gap: GAP },
  col: { flex: 1, gap: GAP },
  cardShadow: {
    borderRadius: 24,
    minHeight: 140,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  cardTall: { minHeight: 170 },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cardShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardDesc: { fontSize: 12, fontWeight: '500', color: '#64748b', lineHeight: 18 },
});
