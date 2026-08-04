import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Configure native status bar on Capacitor platforms
if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#060B14' }).catch(() => {});
  StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
  // Set a CSS class so we can apply native-specific padding
  document.documentElement.classList.add('native-app');
  if (Capacitor.getPlatform() === 'android') {
    document.documentElement.classList.add('native-android');
  } else if (Capacitor.getPlatform() === 'ios') {
    document.documentElement.classList.add('native-ios');
  }
}

// Force unregister any old PWA service workers that might be caching the native app
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
    <SpeedInsights />
  </StrictMode>,
);
