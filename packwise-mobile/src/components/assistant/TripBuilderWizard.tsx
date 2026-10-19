import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeIn } from 'react-native-reanimated';
import { MapPin, Wallet, Compass, ArrowRight, Sparkles, Plus, Minus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTripContext } from '../../context/TripContext';

// --- Simplified Location Input for React Native ---
const LocationInput = ({ label, value, onChange, placeholder, autoFocus }: any) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (text: string) => {
    onChange(text);
    if (text.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    
    setIsSearching(true);
    setShowDropdown(true);
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5&addressdetails=1`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      const parsed = data.map((item: any) => {
        const addr = item.address || {};
        const mainName = addr.city || addr.town || addr.village || addr.state || item.name;
        const country = addr.country || '';
        return { city: mainName, country: country };
      });
      const unique = parsed.filter((v: any, i: number, a: any[]) => a.findIndex(t => (t.city === v.city && t.country === v.country)) === i);
      setSuggestions(unique);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={s.locContainer}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={s.locInputWrapper}>
        <TextInput
          value={value}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          autoFocus={autoFocus}
          style={s.locInput}
        />
        {isSearching && (
          <View style={s.locSpinner}>
            <ActivityIndicator size="small" color="#60a5fa" />
          </View>
        )}
      </View>
      
      {showDropdown && suggestions.length > 0 && (
        <View style={s.dropdownCard}>
          {suggestions.map((loc, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                onChange(`${loc.city}, ${loc.country}`);
                setShowDropdown(false);
              }}
              style={s.dropdownRow}
            >
              <MapPin size={16} color="#60a5fa" />
              <View style={{ flex: 1 }}>
                <Text style={s.dropdownCity}>{loc.city}</Text>
                {loc.country ? <Text style={s.dropdownCountry}>{loc.country}</Text> : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const TripBuilderWizard = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { generateTrip, isGenerating, loadingStep } = useTripContext();
  
  const [prompt, setPrompt] = useState("");
  const [startCity, setStartCity] = useState("");
  const [duration, setDuration] = useState("7");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [budget, setBudget] = useState("Moderate");
  const [styles, setStyles] = useState<string[]>([]);
  const [males, setMales] = useState(1);
  const [females, setFemales] = useState(0);

  const toggleStyle = (style: string) => {
    setStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const handleGenerate = async () => {
    const flightContext = startCity ? ` Flying from ${startCity}.` : "";
    const genderContext = (males > 0 || females > 0) ? ` Travelers: ${males + females} total (${males} male, ${females} female).` : "";
    const fullPrompt = `Destination: ${prompt}.${flightContext} Start Date: ${startDate}. Duration: ${duration} days. Budget: ${budget}. Style: ${styles.join(', ')}.${genderContext}`;
    
    await generateTrip(fullPrompt, { startDate, duration }); 
    router.push('/(tabs)');
  };

  if (isGenerating) {
    return (
      <View style={s.loadingContainer}>
        <Animated.View entering={FadeIn} style={s.loadingBox}>
          <View style={s.loadingIconWrapper}>
            <Sparkles size={40} color="#60a5fa" />
          </View>
          <Text style={s.loadingStepText}>
            {loadingStep || 'Crafting Journey...'}
          </Text>
        </Animated.View>
      </View>
    );
  }

  const steps = [
    { id: 1, title: 'Destination', icon: MapPin },
    { id: 2, title: 'Duration & Budget', icon: Wallet },
    { id: 3, title: 'Interests & Style', icon: Compass },
  ];

  return (
    <View style={s.container}>
      {/* Progress Bar */}
      <View style={s.progressRow}>
        <View style={s.progressLineBg} />
        <View 
          style={[s.progressLineFill, { width: `${((step - 1) / 2) * 100}%` }]} 
        />
        {steps.map((stepItem) => (
          <View key={stepItem.id} style={s.stepCircleWrapper}>
            <View style={[s.stepCircle, step >= stepItem.id ? s.stepCircleActive : s.stepCircleInactive]}>
              <stepItem.icon size={18} color={step >= stepItem.id ? '#ffffff' : '#64748b'} />
            </View>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {step === 1 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <LocationInput 
              label="Where do you want to go?"
              value={prompt}
              onChange={setPrompt}
              placeholder="e.g. Tokyo, Japan"
              autoFocus
            />
            <LocationInput 
              label="Starting City (Optional)"
              value={startCity}
              onChange={setStartCity}
              placeholder="Where are you flying from?"
            />
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <Text style={s.fieldLabel}>How long is your trip?</Text>
            <View style={s.counterBox}>
              <TouchableOpacity 
                onPress={() => setDuration(String(Math.max(1, parseInt(duration) - 1)))} 
                style={s.counterBtn}
                activeOpacity={0.7}
              >
                <Minus size={20} color="#ffffff" />
              </TouchableOpacity>
              <View style={s.counterTextWrapper}>
                <Text style={s.counterNumber}>{duration}</Text>
                <Text style={s.counterSub}>Days</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setDuration(String(parseInt(duration) + 1))} 
                style={s.counterBtn}
                activeOpacity={0.7}
              >
                <Plus size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text style={[s.fieldLabel, { marginTop: 16 }]}>Estimated Budget Level</Text>
            <View style={s.budgetRow}>
              {['Budget', 'Moderate', 'Luxury'].map((b) => (
                <TouchableOpacity 
                  key={b}
                  onPress={() => setBudget(b)}
                  style={[s.budgetBtn, budget === b && s.budgetBtnActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[s.budgetBtnText, budget === b && s.budgetBtnTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            <Text style={s.fieldLabel}>Travel Style</Text>
            <View style={s.stylesWrap}>
              {['Fast-paced', 'Relaxed', 'Culture', 'Nature', 'Foodie', 'Luxury'].map((styleItem) => (
                <TouchableOpacity 
                  key={styleItem}
                  onPress={() => toggleStyle(styleItem)}
                  style={[s.styleChip, styles.includes(styleItem) && s.styleChipActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[s.styleChipText, styles.includes(styleItem) && s.styleChipTextActive]}>
                    {styleItem}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.fieldLabel, { marginTop: 12 }]}>Who is traveling?</Text>
            <View style={s.travelersRow}>
              <View style={s.travelerCard}>
                <Text style={s.travelerLabel}>Male</Text>
                <View style={s.travelerCounter}>
                  <TouchableOpacity onPress={() => setMales(Math.max(0, males - 1))} style={s.miniCounterBtn}>
                    <Minus size={14} color="#ffffff" />
                  </TouchableOpacity>
                  <Text style={s.travelerNum}>{males}</Text>
                  <TouchableOpacity onPress={() => setMales(males + 1)} style={s.miniCounterBtn}>
                    <Plus size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={s.travelerCard}>
                <Text style={s.travelerLabel}>Female</Text>
                <View style={s.travelerCounter}>
                  <TouchableOpacity onPress={() => setFemales(Math.max(0, females - 1))} style={s.miniCounterBtn}>
                    <Minus size={14} color="#ffffff" />
                  </TouchableOpacity>
                  <Text style={s.travelerNum}>{females}</Text>
                  <TouchableOpacity onPress={() => setFemales(females + 1)} style={s.miniCounterBtn}>
                    <Plus size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        <TouchableOpacity 
          onPress={() => setStep(step - 1)}
          disabled={step === 1}
          style={[s.backBtn, step === 1 && { opacity: 0 }]}
          activeOpacity={0.7}
        >
          <Text style={s.backBtnText}>Back</Text>
        </TouchableOpacity>

        {step < 3 ? (
          <TouchableOpacity 
            onPress={() => setStep(step + 1)}
            disabled={step === 1 && !prompt.trim()}
            style={[s.nextBtn, step === 1 && !prompt.trim() && s.nextBtnDisabled]}
            activeOpacity={0.8}
          >
            <Text style={s.nextBtnText}>Next Step</Text>
            <ArrowRight size={16} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleGenerate}
            style={s.generateBtn}
            activeOpacity={0.8}
          >
            <Sparkles size={16} color="#ffffff" />
            <Text style={s.generateBtnText}>Generate Itinerary</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030712',
    padding: 24,
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingStepText: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ffffff',
    textAlign: 'center',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 12,
    position: 'relative',
  },
  progressLineBg: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    zIndex: -1,
  },
  progressLineFill: {
    position: 'absolute',
    top: '50%',
    left: 20,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    zIndex: -1,
  },
  stepCircleWrapper: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  stepCircleInactive: {
    backgroundColor: '#1e293b',
  },

  locContainer: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 50,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Outfit_700Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  locInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  locInput: {
    width: '100%',
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
  },
  locSpinner: {
    position: 'absolute',
    right: 16,
  },
  dropdownCard: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    overflow: 'hidden',
    zIndex: 100,
    elevation: 10,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  dropdownCity: {
    color: '#ffffff',
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
  },
  dropdownCountry: {
    color: '#94a3b8',
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
  },

  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 18,
    gap: 24,
    marginBottom: 20,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterTextWrapper: {
    alignItems: 'center',
  },
  counterNumber: {
    fontSize: 36,
    fontFamily: 'Outfit_900Black',
    color: '#ffffff',
  },
  counterSub: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },

  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  budgetBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  budgetBtnActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: '#3b82f6',
  },
  budgetBtnText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#94a3b8',
  },
  budgetBtnTextActive: {
    color: '#60a5fa',
    fontFamily: 'Outfit_700Bold',
  },

  stylesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  styleChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  styleChipActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.25)',
    borderColor: '#a855f7',
  },
  styleChipText: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: '#94a3b8',
  },
  styleChipTextActive: {
    color: '#ffffff',
  },

  travelersRow: {
    flexDirection: 'row',
    gap: 14,
  },
  travelerCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  travelerLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  travelerCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  miniCounterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelerNum: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#ffffff',
    width: 24,
    textAlign: 'center',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(3, 7, 18, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#ffffff',
  },
  nextBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextBtnDisabled: {
    backgroundColor: 'rgba(37, 99, 235, 0.4)',
  },
  nextBtnText: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#ffffff',
  },
  generateBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generateBtnText: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#ffffff',
  },
});

export default TripBuilderWizard;
