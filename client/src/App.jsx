import { lazy, Suspense, useState, useEffect } from 'react';
import { InstallPromptWidget } from '@/components/pwa/InstallPromptWidget';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { TripProvider } from '@/context/TripContext';
import { PremiumProvider } from './context/PremiumContext';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { ROUTES } from './constants/routes';
import { cn } from './utils/cn';
import { Loader2, Compass } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OnboardingTutorial } from './components/common/OnboardingTutorial';


import { WifiOff } from 'lucide-react';
// ---------------------------------------------------------------------------
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/authentication/LoginPage'));
const SignupPage = lazy(() => import('./pages/authentication/SignupPage'));

const OverviewPage = lazy(() => import('./pages/overview/OverviewPage'));
const CostIntelligencePage = lazy(() => import('./pages/budget/CostIntelligencePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const OnboardingPage = lazy(() => import('./pages/authentication/OnboardingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// New Modules
const TripsPage = lazy(() => import('./pages/trips/TripsPage'));
const PackingPage = lazy(() => import('./pages/packing/PackingPage'));
const DocumentsPage = lazy(() => import('./pages/documents/DocumentsPage'));
const AssistantPage = lazy(() => import('./pages/assistant/AssistantPage'));
const ExplorePage = lazy(() => import('./pages/explore/ExplorePage'));
const CalendarPage = lazy(() => import('./pages/calendar/CalendarPage'));
const JournalPage = lazy(() => import('./pages/journal/JournalPage'));
const FlightsPage = lazy(() => import('./pages/flights/FlightsPage'));

// ---------------------------------------------------------------------------
// Full-page loading spinner (Liquid Shimmer)
// ---------------------------------------------------------------------------
function Spinner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[1000] flex min-h-[100dvh] w-full items-center justify-center bg-[#060B14]"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative w-24 h-24 rounded-[32px] overflow-hidden ios-glass-card flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)]"
        >
          {/* Liquid Shimmer Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          
          <Compass className="w-10 h-10 text-white drop-shadow-lg z-10" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex items-center gap-2"
        >
          <span className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/50 animate-pulse">Loading Workspace</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Route guards
// ---------------------------------------------------------------------------

/** Redirects authenticated users away from guest-only pages (login/signup). */
function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (isAuthenticated) return <Navigate to={ROUTES.OVERVIEW} replace />;

  return children;
}

/** Redirects unauthenticated users to the login page. */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  return children;
}

import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';

// ---------------------------------------------------------------------------
// Toast container — renders active toasts in a fixed overlay
// ---------------------------------------------------------------------------
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const typeStyles = {
    success:
      'border-success-500/30 bg-success-500/10 text-success-500',
    error:
      'border-error-500/30 bg-error-500/10 text-error-500',
    warning:
      'border-warning-500/30 bg-warning-500/10 text-warning-500',
    info:
      'border-info-500/30 bg-info-500/10 text-info-500',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg backdrop-blur-sm',
              'text-sm font-medium transition-all',
              typeStyles[toast.type] || typeStyles.info,
            )}
            role="alert"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App routes (wrapped in AnimatePresence for page transitions)
// ---------------------------------------------------------------------------
function AppRoutes() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.HOME} element={<HomePage />} />

          <Route
            path={ROUTES.LOGIN}
            element={
              <GuestRoute>
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              </GuestRoute>
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              <GuestRoute>
                <AuthLayout>
                  <SignupPage />
                </AuthLayout>
              </GuestRoute>
            }
          />

          <Route
            path={ROUTES.ONBOARDING}
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.OVERVIEW}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OverviewPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.BUDGET}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CostIntelligencePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />


          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TRIPS}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TripsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TRIPS_NEW}
            element={
              <ProtectedRoute>
                <Navigate to={`${ROUTES.ASSISTANT}?mode=builder`} replace />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PACKING}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PackingPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.DOCUMENTS}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DocumentsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ASSISTANT}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AssistantPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EXPLORE}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ExplorePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CALENDAR}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CalendarPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.JOURNAL}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <JournalPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FLIGHTS}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FlightsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// Root App component — context providers & global overlays
// ---------------------------------------------------------------------------
import { GlobalSpotlight } from './components/common/GlobalSpotlight';
import { SplashScreen } from './components/common/SplashScreen';

function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100000] flex justify-center pt-[calc(12px+env(safe-area-inset-top))] pointer-events-none"
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-3xl border border-white/20 shadow-[0_16px_32px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] ios-3d-element">
            <WifiOff className="w-4 h-4 text-rose-400" />
            <span className="text-[12px] font-bold text-white tracking-wide">You're offline — viewing saved trips</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const [splashComplete, setSplashComplete] = useState(false);
  
  return (
    <>
      <GlobalSpotlight />
      <OfflineIndicator />
      <AnimatePresence mode="wait">
        {!splashComplete && <SplashScreen onComplete={() => setSplashComplete(true)} />}
      </AnimatePresence>
      <AppRoutes />
      <InstallPromptWidget />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <TripProvider>
            <ToastProvider>
              <ErrorBoundary>
                <AppContent />
                <OnboardingTutorial />
              </ErrorBoundary>
            </ToastProvider>
          </TripProvider>
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
