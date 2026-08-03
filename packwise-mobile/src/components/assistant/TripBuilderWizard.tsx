import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeIn } from 'react-native-reanimated';
import { MapPin, Wallet, Compass, ArrowRight, Sparkles, Plus, Minus, Building2, Globe2 } from 'lucide-react-native';
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
      // Basic free nominatim search for demo
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5&addressdetails=1`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      const parsed = data.map((item: any) => {
        const addr = item.address || {};
        const mainName = addr.city || addr.town || addr.village || addr.state || item.name;
        const country = addr.country || '';
        return { city: mainName, country: country };
      });
      // filter unique
      const unique = parsed.filter((v: any, i: number, a: any[]) => a.findIndex(t => (t.city === v.city && t.country === v.country)) === i);
      setSuggestions(unique);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View className="mb-5 z-50">
      <Text className="text-sm font-bold text-white mb-2">{label}</Text>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.3)"
          autoFocus={autoFocus}
          className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/10 text-white text-base"
        />
        {isSearching && (
          <View className="absolute right-4 top-4">
            <ActivityIndicator size="small" color="#818cf8" />
          </View>
        )}
      </View>
      
      {showDropdown && suggestions.length > 0 && (
        <View className="absolute top-[80px] left-0 right-0 bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden z-50 shadow-lg">
          {suggestions.map((loc, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                onChange(`${loc.city}, ${loc.country}`);
                setShowDropdown(false);
              }}
              className="px-4 py-3 border-b border-white/5 flex flex-row items-center gap-3"
            >
              <MapPin size={16} color="#818cf8" />
              <View>
                <Text className="text-white font-bold">{loc.city}</Text>
                {loc.country ? <Text className="text-white/50 text-xs">{loc.country}</Text> : null}
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
    router.push('/(tabs)/'); // go to itinerary/home
  };

  if (isGenerating) {
    return (
      <View className="flex-1 items-center justify-center bg-[#030712] p-6">
        <Animated.View entering={FadeIn} className="items-center justify-center">
          <View className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/20 items-center justify-center mb-6">
            <Sparkles size={40} color="#60a5fa" />
          </View>
          <Text className="text-lg font-bold tracking-[0.2em] uppercase text-white/90 text-center animate-pulse">
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
    <View className="flex-1 bg-[#030712] p-4">
      {/* Progress Bar */}
      <View className="flex flex-row items-center justify-between mb-8 px-2 relative">
        <View className="absolute top-1/2 left-4 right-4 h-1 bg-white/5 -z-10 rounded-full" />
        <View 
          className="absolute top-1/2 left-4 h-1 bg-blue-500 -z-10 rounded-full" 
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        {steps.map((s) => (
          <View key={s.id} className="items-center gap-2">
            <View className={`w-12 h-12 rounded-full items-center justify-center ${step >= s.id ? 'bg-blue-600' : 'bg-gray-800'}`}>
              <s.icon size={20} color={step >= s.id ? 'white' : '#9ca3af'} />
            </View>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {step === 1 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="flex-1">
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
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="flex-1">
            <Text className="text-sm font-bold text-white mb-4">How long is your trip?</Text>
            <View className="flex flex-row items-center justify-center bg-white/5 border border-white/10 p-4 rounded-3xl mb-6 gap-6">
              <TouchableOpacity onPress={() => setDuration(String(Math.max(1, parseInt(duration) - 1)))} className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                <Minus size={24} color="white" />
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-4xl font-black text-white">{duration}</Text>
                <Text className="text-white/50 font-bold">Days</Text>
              </View>
              <TouchableOpacity onPress={() => setDuration(String(parseInt(duration) + 1))} className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                <Plus size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-bold text-white mb-4 mt-2">Estimated Budget Level</Text>
            <View className="flex flex-row justify-between gap-3 mb-6">
              {['Budget', 'Moderate', 'Luxury'].map((b) => (
                <TouchableOpacity 
                  key={b}
                  onPress={() => setBudget(b)}
                  className={`flex-1 py-4 items-center rounded-2xl border ${budget === b ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10'}`}
                >
                  <Text className={`font-bold ${budget === b ? 'text-blue-400' : 'text-white/60'}`}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="flex-1">
            <Text className="text-sm font-bold text-white mb-4">Travel Style</Text>
            <View className="flex flex-row flex-wrap gap-3 mb-8">
              {['Fast-paced', 'Relaxed', 'Culture', 'Nature', 'Foodie', 'Luxury'].map((style) => (
                <TouchableOpacity 
                  key={style}
                  onPress={() => toggleStyle(style)}
                  className={`px-5 py-3 rounded-full border ${styles.includes(style) ? 'bg-purple-500/40 border-purple-400' : 'bg-white/5 border-white/10'}`}
                >
                  <Text className={`font-bold ${styles.includes(style) ? 'text-white' : 'text-white/60'}`}>{style}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm font-bold text-white mb-4">Who is traveling?</Text>
            <View className="flex flex-row gap-4">
              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
                <Text className="text-white font-bold mb-3 text-center">Male</Text>
                <View className="flex flex-row items-center justify-center gap-3">
                  <TouchableOpacity onPress={() => setMales(Math.max(0, males - 1))} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"><Minus size={16} color="white" /></TouchableOpacity>
                  <Text className="text-xl font-bold text-white w-6 text-center">{males}</Text>
                  <TouchableOpacity onPress={() => setMales(males + 1)} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"><Plus size={16} color="white" /></TouchableOpacity>
                </View>
              </View>
              <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4">
                <Text className="text-white font-bold mb-3 text-center">Female</Text>
                <View className="flex flex-row items-center justify-center gap-3">
                  <TouchableOpacity onPress={() => setFemales(Math.max(0, females - 1))} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"><Minus size={16} color="white" /></TouchableOpacity>
                  <Text className="text-xl font-bold text-white w-6 text-center">{females}</Text>
                  <TouchableOpacity onPress={() => setFemales(females + 1)} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"><Plus size={16} color="white" /></TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-[#030712]/90 flex flex-row items-center justify-between border-t border-white/10">
        <TouchableOpacity 
          onPress={() => setStep(step - 1)}
          disabled={step === 1}
          className={`px-6 py-4 rounded-full ${step === 1 ? 'opacity-0' : 'bg-white/10'}`}
        >
          <Text className="text-white font-bold">Back</Text>
        </TouchableOpacity>

        {step < 3 ? (
          <TouchableOpacity 
            onPress={() => setStep(step + 1)}
            disabled={step === 1 && !prompt.trim()}
            className={`px-8 py-4 rounded-full flex flex-row items-center gap-2 ${step === 1 && !prompt.trim() ? 'bg-blue-600/50' : 'bg-blue-600'}`}
          >
            <Text className="text-white font-bold">Next Step</Text>
            <ArrowRight size={16} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleGenerate}
            className="px-6 py-4 rounded-full bg-emerald-500 flex flex-row items-center gap-2"
          >
            <Sparkles size={16} color="white" />
            <Text className="text-white font-bold">Generate Itinerary</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TripBuilderWizard;
