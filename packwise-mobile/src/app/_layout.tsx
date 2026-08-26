import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { TripProvider } from "../context/TripContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold, Outfit_900Black } from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // In development, we'll bypass strict auth redirect so we can test the UI easily.
  // We'll let the user see the dummy data if they aren't authenticated, but still wrap the app in Context.

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TripProvider>
          <RootLayoutNav />
        </TripProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
