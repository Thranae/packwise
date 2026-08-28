import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Bot, Wifi, RefreshCcw, Globe2, PiggyBank, Zap } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.62;

const REASONS = [
  { icon: Bot,        label: 'Personalized AI',   desc: 'Tailored recommendations powered by deep learning.',   image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400', color: '#2F6BFF' },
  { icon: Wifi,       label: 'Offline Ready',      desc: 'Download everything. Travel without internet.',         image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400', color: '#8b5cf6' },
  { icon: RefreshCcw, label: 'Multi-device Sync',  desc: 'Seamless sync across all your devices.',                 image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400', color: '#06b6d4' },
  { icon: Globe2,     label: '120+ Countries',     desc: 'Plans, tips & insights for destinations worldwide.',     image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=400', color: '#10b981' },
  { icon: PiggyBank,  label: 'Budget Tracking',    desc: 'Real-time expense tracking with smart alerts.',          image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400', color: '#f97316' },
  { icon: Zap,        label: 'Instant Recs',       desc: 'Get AI recommendations in under 3 seconds.',             image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400', color: '#f43f5e' },
];

const ReasonCard = ({ item, index }) => {
  const Icon = item.icon;
  return (
    <Animated.View entering={FadeInRight.duration(600).delay(index * 100)}>
      <TouchableOpacity activeOpacity={0.9} style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" transition={300} />
        <View style={styles.cardOverlay} />

        {/* Glass content overlay at the bottom */}
        <View style={styles.cardContentArea}>
          <BlurView intensity={100} tint="dark" style={styles.cardGlass}>
            <View style={styles.shine} />
            <View style={[styles.iconBadge, { backgroundColor: `${item.color}25` }]}>
              <Icon size={20} color={item.color} />
            </View>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </BlurView>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function WhyPackWiseSection() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600).delay(950)}>
        <Text style={styles.heading}>Why PackWise?</Text>
      </Animated.View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_W + 16}
        decelerationRate="fast"
      >
        {REASONS.map((item, i) => <ReasonCard key={item.label} item={item} index={i} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 40 },
  heading: {
    fontSize: 20, fontWeight: '800', color: '#0f172a',
    paddingHorizontal: 24, marginBottom: 16,
  },
  scrollContent: { paddingHorizontal: 24, gap: 16 },
  card: {
    width: CARD_W, height: 200, borderRadius: 24, overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  cardContentArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  cardGlass: {
    padding: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  shine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '35%', backgroundColor: 'rgba(255,255,255,0.06)',
  },
  iconBadge: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  cardLabel: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  cardDesc: { fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.85)', lineHeight: 16 },
});
