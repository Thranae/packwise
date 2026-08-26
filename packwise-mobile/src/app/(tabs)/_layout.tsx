import { Tabs } from "expo-router";
import { Compass, Bot, Calculator, Home, Briefcase, Wallet, User } from "lucide-react-native";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomTabBar from "../../components/navigation/BottomTabBar";
import TopHeader from "../../components/navigation/TopHeader";
import GradientBackground from "../../components/landing/GradientBackground";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <GradientBackground />
      <Tabs
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' }
        }}
      >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, size }) => (
            <Briefcase size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size }} /> // Handled by custom orb in BottomTabBar
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ color, size }) => (
            <Wallet size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tabs bar
        }}
      />
    </Tabs>

    {/* Global Cloudy Header (dissolves scrolling content but sits behind TopHeader) */}
    <LinearGradient
      colors={['rgba(200, 224, 255, 1)', 'rgba(200, 224, 255, 0.8)', 'transparent']}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 140, zIndex: 10 }}
      pointerEvents="none"
    />

    {/* Global Cloudy Footer (dissolves scrolling content above the bottom tab bar) */}
    <LinearGradient
      colors={['transparent', 'rgba(200, 224, 255, 0.8)', 'rgba(200, 224, 255, 1)']}
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, zIndex: 10 }}
      pointerEvents="none"
    />
    
    {/* Global Top Header */}
    <TopHeader />
  </View>
  );
}
