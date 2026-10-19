import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  User as UserIcon,
  Mail,
  Plane,
  Save,
  Edit3,
  DollarSign,
  Utensils,
  Compass,
  LogOut,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Check
} from 'lucide-react-native';
import { Image } from 'expo-image';

import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/user.service';

const { width } = Dimensions.get('window');

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Nut Allergy',
  'Dairy-Free'
];

const STYLE_OPTIONS = [
  'Adventure',
  'Relaxation',
  'Culture',
  'Nightlife',
  'Food',
  'Nature',
  'Shopping'
];

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: '$' },
  { code: 'AUD', symbol: '$' }
];

const BUDGET_TIERS = [
  { label: 'Budget', icon: '$', desc: 'Hostels & Street Food' },
  { label: 'Medium', icon: '$$', desc: 'Hotels & Casual Dining' },
  { label: 'Luxury', icon: '$$$', desc: 'Resorts & Fine Dining' }
];

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const topClearance = (insets.top > 0 ? insets.top : 20) + 76;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    displayName: user?.displayName || '',
    email: user?.email || '',
    homeAirport: user?.homeAirport || '',
    dietaryRestrictions: user?.dietaryRestrictions || [],
    travelStyles: user?.travelStyles || user?.travelStyle || [],
    budgetPreference: user?.budgetPreference || 'Medium',
    currency: user?.currency || 'USD'
  });

  // Sync state whenever context user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        displayName: user.displayName || prev.displayName,
        email: user.email || prev.email,
        homeAirport: user.homeAirport || prev.homeAirport,
        dietaryRestrictions: user.dietaryRestrictions || prev.dietaryRestrictions,
        travelStyles: user.travelStyles || user.travelStyle || prev.travelStyles,
        budgetPreference: user.budgetPreference || prev.budgetPreference,
        currency: user.currency || prev.currency
      }));
    }
  }, [user]);

  // Pull latest profile data from server
  const loadLatestProfile = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await userService.getProfile();
      if (res?.data) {
        updateUser(res.data);
      }
    } catch (e) {
      // offline fallback is silent
    } finally {
      setIsRefreshing(false);
    }
  }, [updateUser]);

  useEffect(() => {
    loadLatestProfile();
  }, []);

  const handleToggleEdit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Save changes
    try {
      setIsSaving(true);
      const payload: any = { ...formData };
      if (!payload.name) delete payload.name;
      if (!payload.email) delete payload.email;

      const res = await userService.updateProfile(payload);
      const updated = res?.data || res;
      if (updated) {
        updateUser(updated);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEditing(false);
      Alert.alert('Profile Saved', 'Your travel preferences have been updated.');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error?.message || 'Could not save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleMulti = (field: 'dietaryRestrictions' | 'travelStyles', value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormData(prev => {
      const current: string[] = (prev[field] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((item: string) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSelectBudget = (tier: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormData(prev => ({ ...prev, budgetPreference: tier }));
  };

  const handleSelectCurrency = (cur: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormData(prev => ({ ...prev, currency: cur }));
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of PackWise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await logout();
          }
        }
      ]
    );
  };

  const initials = (formData.name || user?.name || 'Traveler')
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      {/* Dark Ambient Liquid Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#030712', '#0f172a', '#1e1b4b']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.glowOrb, { top: -60, right: -60, backgroundColor: 'rgba(99, 102, 241, 0.25)' }]} />
        <View style={[styles.glowOrb, { bottom: 120, left: -60, backgroundColor: 'rgba(56, 189, 248, 0.15)' }]} />
      </View>

      <View style={styles.safeArea}>
        {/* Top Header */}
        <View style={[styles.header, { marginTop: topClearance }]}>
          <Text style={styles.headerTitle}>Profile & Preferences</Text>
          <TouchableOpacity
            style={[styles.editButton, isEditing && styles.editButtonActive]}
            onPress={handleToggleEdit}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : isEditing ? (
              <>
                <Save size={15} color="#ffffff" />
                <Text style={styles.editButtonText}>Save</Text>
              </>
            ) : (
              <>
                <Edit3 size={15} color="#ffffff" />
                <Text style={styles.editButtonText}>Edit</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Hero Card */}
          <View style={styles.heroCardWrapper}>
            <BlurView intensity={70} tint="dark" style={styles.heroCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.02)']}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.avatarRow}>
                <View style={styles.avatarContainer}>
                  {user?.profileImage ? (
                    <Image source={{ uri: user.profileImage }} style={styles.avatarImage} contentFit="cover" />
                  ) : (
                    <LinearGradient
                      colors={['#3b82f6', '#8b5cf6']}
                      style={styles.avatarPlaceholder}
                    >
                      <Text style={styles.avatarText}>{initials}</Text>
                    </LinearGradient>
                  )}
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={12} color="#ffffff" />
                  </View>
                </View>

                <View style={styles.userInfoCol}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {formData.name || 'PackWise Voyager'}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {formData.email || 'voyager@packwise.ai'}
                  </Text>
                  <View style={styles.memberBadge}>
                    <Sparkles size={11} color="#38bdf8" />
                    <Text style={styles.memberBadgeText}>Pro Globetrotter</Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </View>

          {/* Identity & Basic Info Section */}
          <Text style={styles.sectionHeader}>PERSONAL DETAILS</Text>
          <View style={styles.glassCard}>
            <BlurView intensity={50} tint="dark" style={styles.glassCardInner}>
              <View style={styles.fieldRow}>
                <View style={styles.fieldIconBox}>
                  <UserIcon size={16} color="#60a5fa" />
                </View>
                <View style={styles.fieldContent}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.fieldInput}
                      value={formData.name}
                      onChangeText={val => setFormData(p => ({ ...p, name: val }))}
                      placeholder="Your Full Name"
                      placeholderTextColor="#64748b"
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{formData.name || 'Not set'}</Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.fieldRow}>
                <View style={styles.fieldIconBox}>
                  <Plane size={16} color="#34d399" />
                </View>
                <View style={styles.fieldContent}>
                  <Text style={styles.fieldLabel}>Home Airport (IATA)</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.fieldInput}
                      value={formData.homeAirport}
                      onChangeText={val => setFormData(p => ({ ...p, homeAirport: val.toUpperCase() }))}
                      placeholder="e.g. SFO, JFK, DEL"
                      placeholderTextColor="#64748b"
                      autoCapitalize="characters"
                      maxLength={4}
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{formData.homeAirport || 'e.g. SFO'}</Text>
                  )}
                </View>
              </View>
            </BlurView>
          </View>

          {/* Budget Style Preference */}
          <Text style={styles.sectionHeader}>BUDGET ARCHETYPE</Text>
          <View style={styles.budgetRow}>
            {BUDGET_TIERS.map(tier => {
              const isSelected = formData.budgetPreference?.toLowerCase() === tier.label.toLowerCase();
              return (
                <TouchableOpacity
                  key={tier.label}
                  style={[styles.budgetTierCard, isSelected && styles.budgetTierCardSelected]}
                  onPress={() => handleSelectBudget(tier.label)}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={isSelected ? 60 : 30} tint="dark" style={styles.budgetTierInner}>
                    <Text style={[styles.budgetTierIcon, isSelected && styles.budgetTierIconSelected]}>
                      {tier.icon}
                    </Text>
                    <Text style={[styles.budgetTierLabel, isSelected && styles.budgetTierLabelSelected]}>
                      {tier.label}
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Currency Selection */}
          <Text style={styles.sectionHeader}>PRIMARY CURRENCY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyScroll}>
            {CURRENCIES.map(cur => {
              const isSelected = formData.currency === cur.code;
              return (
                <TouchableOpacity
                  key={cur.code}
                  style={[styles.currencyPill, isSelected && styles.currencyPillSelected]}
                  onPress={() => handleSelectCurrency(cur.code)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.currencySymbol, isSelected && styles.currencySymbolSelected]}>
                    {cur.symbol}
                  </Text>
                  <Text style={[styles.currencyCode, isSelected && styles.currencyCodeSelected]}>
                    {cur.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Travel Styles */}
          <Text style={styles.sectionHeader}>TRAVEL VIBES & STYLES</Text>
          <View style={styles.tagWrap}>
            {STYLE_OPTIONS.map(style => {
              const isSelected = formData.travelStyles?.includes(style);
              return (
                <TouchableOpacity
                  key={style}
                  style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                  onPress={() => handleToggleMulti('travelStyles', style)}
                  activeOpacity={0.7}
                >
                  {isSelected && <Check size={13} color="#ffffff" style={{ marginRight: 4 }} />}
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{style}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Dietary Restrictions */}
          <Text style={styles.sectionHeader}>DIETARY & ALLERGIES</Text>
          <View style={styles.tagWrap}>
            {DIETARY_OPTIONS.map(diet => {
              const isSelected = formData.dietaryRestrictions?.includes(diet);
              return (
                <TouchableOpacity
                  key={diet}
                  style={[styles.tagPill, isSelected && styles.tagPillSelectedGreen]}
                  onPress={() => handleToggleMulti('dietaryRestrictions', diet)}
                  activeOpacity={0.7}
                >
                  {isSelected && <Check size={13} color="#ffffff" style={{ marginRight: 4 }} />}
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{diet}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Cloud Sync & Preferences */}
          <Text style={styles.sectionHeader}>APP STATUS & SYNC</Text>
          <View style={styles.glassCard}>
            <BlurView intensity={50} tint="dark" style={styles.glassCardInner}>
              <TouchableOpacity
                style={styles.syncRow}
                onPress={loadLatestProfile}
                activeOpacity={0.7}
              >
                <View style={styles.fieldIconBox}>
                  <RefreshCw size={16} color="#38bdf8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.syncTitle}>Sync Cloud Profile</Text>
                  <Text style={styles.syncSubtitle}>
                    {isRefreshing ? 'Refreshing with server...' : 'AI Engine & Trips synchronized'}
                  </Text>
                </View>
                <ChevronRight size={18} color="#64748b" />
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <BlurView intensity={40} tint="dark" style={styles.logoutInner}>
              <LogOut size={16} color="#f87171" />
              <Text style={styles.logoutText}>Log Out</Text>
            </BlurView>
          </TouchableOpacity>

          <Text style={styles.footerVersion}>PackWise Native • v1.0.0 (SDK 57)</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  safeArea: {
    flex: 1,
  },
  glowOrb: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.5,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  editButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
  },
  heroCardWrapper: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroCard: {
    padding: 18,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  memberBadgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  glassCardInner: {
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  fieldIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  fieldValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  fieldInput: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#3b82f6',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  budgetTierCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  budgetTierCardSelected: {
    borderColor: '#3b82f6',
  },
  budgetTierInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  budgetTierIcon: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '800',
  },
  budgetTierIconSelected: {
    color: '#60a5fa',
  },
  budgetTierLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  budgetTierLabelSelected: {
    color: '#ffffff',
  },
  currencyScroll: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  currencyPillSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  currencySymbol: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  currencySymbolSelected: {
    color: '#60a5fa',
  },
  currencyCode: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
  currencyCodeSelected: {
    color: '#ffffff',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tagPillSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: '#3b82f6',
  },
  tagPillSelectedGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: '#10b981',
  },
  tagText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  syncSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 18,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  logoutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '700',
  },
  footerVersion: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 11,
    marginTop: 24,
    fontWeight: '500',
  },
});
