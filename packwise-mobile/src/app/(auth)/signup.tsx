import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../hooks/useAuth';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({ name, email, password });
      
      if (res.success) {
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', res.message || 'Signup failed');
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
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} className="flex-1 px-6 justify-center py-10">
          
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-extrabold text-white mb-2">Create Account</Text>
            <Text className="text-white/60 text-base">Start your journey with Voyage Genie today.</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View className="relative">
              <View className="absolute left-4 top-4 z-10">
                <User size={20} color="#9ca3af" />
              </View>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 font-medium"
              />
            </View>

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

            <View className="relative">
              <View className="absolute left-4 top-4 z-10">
                <Lock size={20} color="#9ca3af" />
              </View>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-12 py-4 font-medium"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 z-10"
              >
                {showConfirmPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleSignup}
              disabled={isLoading}
              className="w-full bg-blue-600 py-4 rounded-2xl mt-4 shadow-lg shadow-blue-600/20"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-white/60">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-400 font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
