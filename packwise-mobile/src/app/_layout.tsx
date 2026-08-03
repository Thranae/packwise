import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { TripProvider } from "../context/TripContext";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (
      // If the user is not authenticated and the initial segment is not anything in the auth group.
      !isAuthenticated &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#030712', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
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
  return (
    <AuthProvider>
      <TripProvider>
        <RootLayoutNav />
      </TripProvider>
    </AuthProvider>
  );
}
