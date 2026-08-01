import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { TripProvider } from "../context/TripContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TripProvider>
        <Slot />
      </TripProvider>
    </AuthProvider>
  );
}
