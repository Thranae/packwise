import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bot,
  Sparkles,
  Map,
  Luggage,
  Umbrella,
  Camera,
  Send,
  RotateCcw,
  User as UserIcon
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { aiService } from '../../services/aiService';
import { useTrips } from '../../context/TripContext';

const { width } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

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
  const { currentTrip } = useTrips();
  const scrollViewRef = useRef<ScrollView>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const destination = currentTrip?.destination || 'Tokyo';
  const weatherTemp = currentTrip?.weather?.current?.temp ? `${currentTrip.weather.current.temp}°` : '65°F';

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const tripContext = currentTrip
        ? `Destination: ${currentTrip.destination}, Country: ${currentTrip.country || ''}, Budget: ${currentTrip.budget || ''}, Duration: ${currentTrip.duration || '7 days'}`
        : `Destination: Tokyo`;

      const reply = await aiService.chatAssistant(query, tripContext);
      
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply || 'Here is what I recommend for your journey...',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMsg]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.warn('AI Chat Assistant error:', error?.message);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your trip to ${destination}, make sure to pack versatile layers, check local transit passes, and keep your essential documents handy!`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMessages([]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const quickActions = [
    { icon: Map, color: '#3b82f6', text: 'Build Itinerary', prompt: `Build a balanced daily itinerary for ${destination}` },
    { icon: Luggage, color: '#10b981', text: 'Outfit Ideas', prompt: `What outfits should I pack for the weather in ${destination}?` },
    { icon: Umbrella, color: '#f59e0b', text: 'Check Weather', prompt: `Give me a packing checklist based on current weather in ${destination}` },
    { icon: Camera, color: '#ec4899', text: 'Photo Spots', prompt: `What are the top aesthetic and scenic spots to photograph in ${destination}?` },
  ];

  const suggestedPrompts = [
    `What's the best street food in ${destination}?`,
    `Do I need a power adapter for ${destination}?`,
    `What should I carry in my airplane personal item?`,
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#09090b', '#0f172a', '#1e1b4b']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Decorative Ambient Orbs */}
      <View style={[styles.glowOrb, { top: -50, left: -50, backgroundColor: 'rgba(99, 102, 241, 0.35)' }]} />
      <View style={[styles.glowOrb, { top: '35%', right: -100, backgroundColor: 'rgba(236, 72, 153, 0.25)' }]} />

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent, 
          { 
            paddingTop: (insets.top > 0 ? insets.top : 20) + 76,
            paddingBottom: (insets.bottom || 16) + 140
          }
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.badgeContainer}>
              <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.badgeGradient} />
              <Text style={styles.badgeText}>PackWise AI ✨</Text>
            </View>
            {messages.length > 0 && (
              <TouchableOpacity onPress={handleResetChat} style={styles.resetButton}>
                <RotateCcw size={14} color="#94a3b8" />
                <Text style={styles.resetText}>New Chat</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.greetingTitle}>Your Personal Travel Concierge</Text>
        </View>

        {/* AI Insight Card for Selected Trip */}
        <GlassCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.iconBox}>
              <Bot size={20} color="#a855f7" />
            </View>
            <Text style={styles.insightTitle}>Active Trip Intelligence</Text>
          </View>
          <Text style={styles.insightText}>
            You're exploring <Text style={styles.highlightText}>{destination}</Text>. Expected conditions average{' '}
            <Text style={styles.highlightText}>{weatherTemp}</Text>. Ask me anything about luggage limits, local etiquette, currency tips, or itinerary crafting.
          </Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSend(`Create an optimal packing list for my trip to ${destination}`)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFillObject} />
            <Sparkles size={16} color="#e2e8f0" />
            <Text style={styles.actionButtonText}>Generate Smart Packing List</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Conversation Thread */}
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageBubbleWrapper,
              msg.sender === 'user' ? styles.userBubbleWrapper : styles.aiBubbleWrapper
            ]}
          >
            {msg.sender === 'assistant' ? (
              <View style={styles.avatarIcon}>
                <Bot size={15} color="#a855f7" />
              </View>
            ) : null}

            <View
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.aiBubble
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText
                ]}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageBubbleWrapper, styles.aiBubbleWrapper]}>
            <View style={styles.avatarIcon}>
              <Bot size={15} color="#a855f7" />
            </View>
            <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color="#a855f7" />
              <Text style={styles.typingText}>Consulting travel models...</Text>
            </View>
          </View>
        )}

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Instant Recommendations</Text>
        <View style={styles.grid}>
          {quickActions.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={{ width: (width - 50) / 2 }}
              onPress={() => handleSend(item.prompt)}
              activeOpacity={0.7}
            >
              <GlassCard style={styles.gridItem}>
                <View style={[styles.gridIconBox, { backgroundColor: `${item.color}20` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.gridItemText}>{item.text}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended Prompts */}
        <Text style={styles.sectionTitle}>Try Asking</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContainer}>
          {suggestedPrompts.map((prompt, i) => (
            <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => handleSend(prompt)}>
              <GlassCard style={styles.promptCard} intensity={20}>
                <Text style={styles.promptText}>"{prompt}"</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Floating Prompt Bar */}
      <View style={[styles.promptBarWrapper, { bottom: (insets.bottom || 16) + 68 }]}>
        <GlassCard style={styles.promptBar} intensity={60}>
          <TextInput 
            style={styles.promptInput} 
            placeholder={`Ask about ${destination} or anything...`} 
            placeholderTextColor="#64748b"
            keyboardAppearance="dark"
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.promptSendBtn, !inputMessage.trim() && { opacity: 0.5 }]}
            onPress={() => handleSend()}
            disabled={!inputMessage.trim() || isTyping}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#6366f1', '#a855f7']} style={StyleSheet.absoluteFillObject} />
            <Send size={15} color="#fff" style={{ marginLeft: -1 }} />
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
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 130,
  },
  header: {
    marginTop: 4,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  badgeText: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  resetText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  greetingTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  glassCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  glassCardInner: {
    padding: 16,
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  insightCard: {
    marginBottom: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '700',
  },
  insightText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  highlightText: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionButtonText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  userBubbleWrapper: {
    justifyContent: 'flex-end',
  },
  aiBubbleWrapper: {
    justifyContent: 'flex-start',
  },
  avatarIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: width * 0.76,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  aiMessageText: {
    color: '#e2e8f0',
    fontWeight: '400',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  typingText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 2,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  gridIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  promptsContainer: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
  promptCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  promptText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  promptBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
  },
  promptBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  promptInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  promptSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
