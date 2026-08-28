import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  useSharedValue,
  FadeInUp
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Custom Glass Input Component
const GlassInput = ({ icon: Icon, placeholder, secureTextEntry, rightIcon: RightIcon, onRightIconPress, value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const glowOpacity = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    glowOpacity.value = withTiming(1, { duration: 300 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    glowOpacity.value = withTiming(0, { duration: 300 });
  };

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.inputWrapper}>
      <Animated.View style={[styles.inputGlow, glowStyle]} />
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <Icon size={20} color={isFocused ? '#2F6BFF' : '#64748b'} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
        {RightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <RightIcon size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function GlassLoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { loginWithToken } = useAuth();
  const router = useRouter();

  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const handleLogin = async () => {
    // Inject a dummy token for fast testing of the UI
    await loginWithToken('dev_dummy_token_123', {
      id: '1',
      name: 'Explorer',
      email: email || 'test@packwise.com'
    });
    router.replace('/(tabs)');
  };

  return (
    <Animated.View entering={FadeInUp.duration(800).delay(500)} style={styles.container}>
      <View style={styles.cardShadow}>
        <BlurView intensity={80} tint="light" style={styles.card}>
          <View style={styles.cardReflection} />
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue your journey</Text>

          <View style={styles.form}>
            <GlassInput 
              icon={Mail} 
              placeholder="Email address" 
              value={email}
              onChangeText={setEmail}
            />
            <GlassInput 
              icon={Lock} 
              placeholder="Password" 
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? Eye : EyeOff}
              onRightIconPress={() => setShowPassword(!showPassword)}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Primary Button */}
            <TouchableOpacity 
              activeOpacity={1}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleLogin}
              style={styles.buttonWrapper}
            >
              <Animated.View style={[styles.buttonContainer, buttonStyle]}>
                <View style={styles.buttonGlow} />
                <LinearGradient
                  colors={['#5AA9FF', '#2F6BFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                  <ArrowRight size={20} color="#fff" />
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    zIndex: 20,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 20,
    backgroundColor: 'transparent',
    borderRadius: 32,
  },
  card: {
    width: '100%',
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.4)', // Base white tint before blur
  },
  cardReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: [{ skewY: '-15deg' }, { translateY: -20 }],
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 0.1,
    marginTop: 4,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputGlow: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2F6BFF',
    opacity: 0.15,
    borderRadius: 16,
    filter: 'blur(8px)', // React Native doesn't perfectly support this, but opacity handles it visually
    transform: [{ scale: 1.05 }],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#5AA9FF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.2,
    height: '100%',
  },
  rightIcon: {
    padding: 8,
    marginRight: -8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2F6BFF',
    letterSpacing: -0.2,
  },
  buttonWrapper: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    height: 56,
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2F6BFF',
    opacity: 0.4,
    borderRadius: 28,
    top: 8,
    filter: 'blur(10px)',
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  }
});
