import { Tabs } from "expo-router";
import { Compass, Bot, Calculator } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#030712', // Match dark theme
          borderTopWidth: 1,
          borderTopColor: '#1f2937', // border-gray-800
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#3b82f6', // blue-500
        tabBarInactiveTintColor: '#9ca3af', // gray-400
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, size }) => (
            <Compass size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ color, size }) => (
            <Calculator size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="genie"
        options={{
          title: "Genie",
          tabBarIcon: ({ color, size }) => (
            <Bot size={size} color={color} />
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
  );
}
