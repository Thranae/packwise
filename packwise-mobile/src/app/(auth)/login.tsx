import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({ email, password });
      
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', res.message || 'Login failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#030712' }}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View entering={FadeInDown.duration(600)} className="flex-1 px-6 justify-center">
        {/* Logo */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-2xl bg-blue-500/10 items-center justify-center border border-blue-500/20 mb-4">
            <Text className="text-blue-500 text-3xl font-black">V</Text>
          </View>
          <Text className="text-3xl font-extrabold text-white mb-2">Welcome Back</Text>
          <Text className="text-white/60 text-base">Sign in to Voyage Genie</Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <View className="relative">
            <View className="absolute left-4 top-4 z-10">
              <Mail size={20} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 font-medium"
            />
          </View>

          <View className="relative">
            <View className="absolute left-4 top-4 z-10">
              <Lock size={20} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-12 py-4 font-medium"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 z-10"
            >
              {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 py-4 rounded-2xl mt-4 shadow-lg shadow-blue-600/20"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-white/60">Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text className="text-blue-400 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
