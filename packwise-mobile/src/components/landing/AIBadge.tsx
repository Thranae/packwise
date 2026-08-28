import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Bot, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AIBadge() {
  return (
    <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.container}>
      <View style={styles.shadow}>
        <BlurView intensity={100} tint="light" style={styles.badge}>
          <View style={styles.shine} />
          <Bot size={14} color="#2F6BFF" />
          <Text style={styles.text}>AI Powered Travel</Text>
          <Sparkles size={10} color="#5AA9FF" />
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  shadow: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  shine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
});
