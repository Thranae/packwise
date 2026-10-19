import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as authService from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithToken } = useAuth();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields to create your account.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.signup({ name: name.trim(), email: email.trim(), password });
      
      if (res.success) {
        if (res.data?.token && res.data?.user) {
          await loginWithToken(res.data.token, res.data.user);
        }
        Alert.alert('Welcome to PackWise!', 'Account created successfully.');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Signup Failed', res.message || 'Could not create account');
      }
    } catch (error: any) {
      Alert.alert('Signup Error', error.response?.data?.message || error.message || 'An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#030712', '#0f172a', '#1e1b4b']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600)} style={s.formWrapper}>
            
            {/* Header */}
            <View style={s.header}>
              <View style={s.badge}>
                <Sparkles size={12} color="#60a5fa" />
                <Text style={s.badgeText}>Join PackWise</Text>
              </View>
              <Text style={s.title}>Create Account</Text>
              <Text style={s.subtitle}>Start planning smarter journeys with real-time AI.</Text>
            </View>

            {/* Inputs Card */}
            <View style={s.card}>
              <BlurView intensity={50} tint="dark" style={s.cardInner}>
                
                {/* Full Name */}
                <View style={s.inputRow}>
                  <View style={s.inputIconBox}>
                    <User size={18} color="#60a5fa" />
                  </View>
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#64748b"
                    value={name}
                    onChangeText={setName}
                    style={s.input}
                    autoCapitalize="words"
                  />
                </View>

                <View style={s.divider} />

                {/* Email Address */}
                <View style={s.inputRow}>
                  <View style={s.inputIconBox}>
                    <Mail size={18} color="#34d399" />
                  </View>
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={s.input}
                  />
                </View>

                <View style={s.divider} />

                {/* Password */}
                <View style={s.inputRow}>
                  <View style={s.inputIconBox}>
                    <Lock size={18} color="#a78bfa" />
                  </View>
                  <TextInput
                    placeholder="Password (min 6 chars)"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={s.input}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={s.eyeBtn}
                    activeOpacity={0.7}
                  >
                    {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                  </TouchableOpacity>
                </View>

                <View style={s.divider} />

                {/* Confirm Password */}
                <View style={s.inputRow}>
                  <View style={s.inputIconBox}>
                    <Lock size={18} color="#f472b6" />
                  </View>
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#64748b"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={s.input}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={s.eyeBtn}
                    activeOpacity={0.7}
                  >
                    {showConfirmPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                  </TouchableOpacity>
                </View>

              </BlurView>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleSignup}
              disabled={isLoading}
              style={s.submitButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View style={s.buttonContent}>
                  <Text style={s.submitButtonText}>Create Account</Text>
                  <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
                </View>
              )}
            </TouchableOpacity>

            {/* Footer Sign In Link */}
            <View style={s.footer}>
              <Text style={s.footerText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={s.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  formWrapper: {
    width: '100%',
  },

  header: {
    marginBottom: 28,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.25)',
  },
  badgeText: {
    color: '#60a5fa',
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#94a3b8',
    lineHeight: 22,
  },

  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: 20,
  },
  cardInner: {
    paddingVertical: 4,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
  },
  eyeBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginLeft: 58,
  },

  submitButton: {
    height: 54,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
  },
  signInLink: {
    color: '#60a5fa',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
});
