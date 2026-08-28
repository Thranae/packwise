import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldCheck, Smartphone } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Using simple textual representations or generic icons for Apple/Google 
// since @expo/vector-icons / lucide might not have exact brand SVGs by default.
// In a production app, we'd use raw SVGs.
const GoogleIcon = () => (
  <View style={styles.googleIconPlaceholder}>
    <Text style={styles.googleG}>G</Text>
  </View>
);

const AppleIcon = () => (
  <View style={styles.appleIconPlaceholder}>
    <Text style={styles.appleA}></Text>
  </View>
);

export default function AuthFooter() {
  return (
    <Animated.View entering={FadeInUp.duration(800).delay(700)} style={styles.container}>
      
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButtonWrapper} activeOpacity={0.8}>
          <BlurView intensity={40} tint="light" style={styles.socialButton}>
            <GoogleIcon />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButtonWrapper} activeOpacity={0.8}>
          <BlurView intensity={40} tint="light" style={styles.socialButton}>
            <AppleIcon />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButtonWrapper} activeOpacity={0.8}>
          <BlurView intensity={40} tint="light" style={styles.socialButton}>
            <Smartphone size={18} color="#0f172a" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continue with Phone</Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Create Account Link */}
      <View style={styles.createAccountRow}>
        <Text style={styles.createAccountText}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.createAccountLink}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Trust & Legal */}
      <View style={styles.legalContainer}>
        <View style={styles.trustRow}>
          <ShieldCheck size={12} color="#64748b" />
          <Text style={styles.trustText}>Your data is safe and encrypted</Text>
        </View>

        <View style={styles.legalLinksRow}>
          <TouchableOpacity><Text style={styles.legalLink}>Privacy Policy</Text></TouchableOpacity>
          <Text style={styles.legalDot}>•</Text>
          <TouchableOpacity><Text style={styles.legalLink}>Terms of Service</Text></TouchableOpacity>
          <Text style={styles.legalDot}>•</Text>
          <Text style={styles.legalLink}>v1.0.0</Text>
        </View>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 24,
    zIndex: 10,
    paddingBottom: 40,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  socialContainer: {
    gap: 12,
    marginBottom: 32,
  },
  socialButtonWrapper: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: 'transparent',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  socialIcon: {
    position: 'absolute',
    left: 20,
  },
  googleIconPlaceholder: {
    position: 'absolute',
    left: 20,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DB4437', // Google Red just for a pop
  },
  appleIconPlaceholder: {
    position: 'absolute',
    left: 20,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleA: {
    fontSize: 20,
    color: '#000',
  },
  createAccountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  createAccountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: -0.1,
  },
  createAccountLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2F6BFF',
    letterSpacing: -0.1,
  },
  legalContainer: {
    alignItems: 'center',
    gap: 8,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legalLink: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  legalDot: {
    fontSize: 11,
    color: '#cbd5e1',
  }
});
