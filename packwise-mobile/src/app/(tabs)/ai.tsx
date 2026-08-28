import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Bot, Sparkles, Map, Luggage, Umbrella, Camera, Mic, Send } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Reusable Liquid Glass Card Component
const GlassCard = ({ children, style, intensity = 40 }: any) => (
  <View style={[styles.glassCardWrapper, style]}>
    <BlurView intensity={intensity} tint="dark" style={styles.glassCardInner}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </BlurView>
    <View style={styles.glassBorder} pointerEvents="none" />
  </View>
);

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#09090b', '#0f172a', '#1e1b4b']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Decorative Orbs */}
      <View style={[styles.glowOrb, { top: -50, left: -50, backgroundColor: 'rgba(99, 102, 241, 0.4)' }]} />
      <View style={[styles.glowOrb, { top: '30%', right: -100, backgroundColor: 'rgba(236, 72, 153, 0.3)' }]} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.badgeGradient} />
            <Text style={styles.badgeText}>PackWise AI ✨</Text>
          </View>
          <Text style={styles.greetingTitle}>How can I help you pack today?</Text>
        </View>

        {/* AI Insight Card */}
        <GlassCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.iconBox}>
              <Bot size={20} color="#a855f7" />
            </View>
            <Text style={styles.insightTitle}>Current Trip Insight</Text>
          </View>
          <Text style={styles.insightText}>
            You're heading to <Text style={styles.highlightText}>Tokyo</Text> in 14 days. Based on the 
            current forecast of 65°F and light rain, don't forget to pack a compact umbrella and waterproof walking shoes.
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']} style={StyleSheet.absoluteFillObject} />
            <Sparkles size={16} color="#e2e8f0" />
            <Text style={styles.actionButtonText}>Generate Packing List</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {[
            { icon: Map, color: '#3b82f6', text: 'Build Itinerary' },
            { icon: Luggage, color: '#10b981', text: 'Outfit Ideas' },
            { icon: Umbrella, color: '#f59e0b', text: 'Check Weather' },
            { icon: Camera, color: '#ec4899', text: 'Photo Spots' },
          ].map((item, i) => (
            <GlassCard key={i} style={styles.gridItem}>
              <View style={[styles.gridIconBox, { backgroundColor: `${item.color}20` }]}>
                <item.icon size={22} color={item.color} />
              </View>
              <Text style={styles.gridItemText}>{item.text}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Recommended Prompts */}
        <Text style={styles.sectionTitle}>Try Asking</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContainer}>
          {["What's the street style in Paris?", "Should I bring a jacket to Miami?", "Create a 3-day tech itinerary"].map((prompt, i) => (
            <TouchableOpacity key={i} activeOpacity={0.7}>
              <GlassCard style={styles.promptCard} intensity={20}>
                <Text style={styles.promptText}>"{prompt}"</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Floating Prompt Bar */}
      <View style={[styles.promptBarWrapper, { paddingBottom: insets.bottom + 10 }]}>
        <GlassCard style={styles.promptBar} intensity={60}>
          <TouchableOpacity style={styles.promptIconBtn}>
            <Mic size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TextInput 
            style={styles.promptInput} 
            placeholder="Ask PackWise AI..." 
            placeholderTextColor="#64748b"
            keyboardAppearance="dark"
          />
          <TouchableOpacity style={styles.promptSendBtn}>
            <LinearGradient colors={['#6366f1', '#a855f7']} style={StyleSheet.absoluteFillObject} />
            <Send size={16} color="#fff" style={{ marginLeft: -2 }} />
          </TouchableOpacity>
        </GlassCard>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  glowOrb: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // space for floating bar
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  badgeGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  badgeText: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  greetingTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  glassCardWrapper: {
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glassCardInner: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.25)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  insightCard: {
    marginBottom: 32,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    paddingBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  insightTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  insightText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  highlightText: {
    color: '#fff',
    fontWeight: '800',
  },
  actionButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  gridItem: {
    width: (width - 40 - 16) / 2,
    padding: 20,
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gridItemText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  promptsContainer: {
    gap: 12,
    paddingRight: 20,
  },
  promptCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  promptText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  promptBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  promptBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 30,
  },
  promptIconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptInput: {
    flex: 1,
    height: 44,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  promptSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
