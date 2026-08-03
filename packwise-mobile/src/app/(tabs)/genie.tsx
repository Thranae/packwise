import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Map, Sparkles } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { TripBuilderWizard } from '../../components/assistant/TripBuilderWizard';

export default function GenieScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#030712' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(600).delay(100)} 
        className="px-6 pt-6 pb-2"
      >
        <View className="flex flex-row items-center justify-between">
          <View>
            <View className="flex flex-row items-center gap-2 mb-1">
              <Sparkles size={16} color="#60a5fa" />
              <Text className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">AI Assistant</Text>
            </View>
            <Text className="text-white text-3xl font-extrabold tracking-tight flex flex-row items-center gap-3">
              Voyage <Text className="text-purple-400">Genie</Text>
            </Text>
            <Text className="text-white/50 text-sm font-medium mt-1">
              Build your perfect itinerary step-by-step with AI.
            </Text>
          </View>
          <View className="w-12 h-12 bg-blue-500/10 rounded-full items-center justify-center border border-blue-500/20">
            <Map size={24} color="#60a5fa" />
          </View>
        </View>
      </Animated.View>

      {/* Wizard */}
      <Animated.View entering={FadeIn.duration(800).delay(300)} style={{ flex: 1 }}>
        <TripBuilderWizard />
      </Animated.View>
    </SafeAreaView>
  );
}
