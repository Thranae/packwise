import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'providers/auth_provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/trip_provider.dart';

import 'screens/auth/login_screen.dart';
import 'screens/auth/signup_screen.dart';
import 'screens/auth/forgot_password_screen.dart';
import 'screens/auth/otp_verification_screen.dart';
import 'screens/main_navigation.dart';
import 'screens/home/dashboard_screen.dart';
import 'screens/trips/trips_list_screen.dart';
import 'screens/trips/trip_details_screen.dart';
import 'screens/assistant/voyage_genie_screen.dart';
import 'screens/explore/explore_screen.dart';
import 'screens/settings/profile_screen.dart';
import 'package:google_sign_in/google_sign_in.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..initAuth()),
        ChangeNotifierProvider(create: (_) => TripProvider()),
      ],
      child: const VoyageGenieApp(),
    ),
  );
}

class VoyageGenieApp extends StatelessWidget {
  const VoyageGenieApp({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    final router = GoRouter(
      initialLocation: '/dashboard',
      redirect: (context, state) {
        if (authProvider.isLoading) return null; // Wait for init

        final isAuthRoute = state.matchedLocation == '/login' || state.matchedLocation == '/signup' || state.matchedLocation == '/forgot-password' || state.matchedLocation == '/otp-verification';
        final isAuth = authProvider.isAuthenticated;

        if (!isAuth && !isAuthRoute) return '/login';
        if (isAuth && isAuthRoute) return '/dashboard';

        return null;
      },
      routes: [
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/signup',
          builder: (context, state) => const SignupScreen(),
        ),
        GoRoute(
          path: '/forgot-password',
          builder: (context, state) => const ForgotPasswordScreen(),
        ),
        GoRoute(
          path: '/otp-verification',
          builder: (context, state) {
            final email = state.extra as String? ?? '';
            return OtpVerificationScreen(email: email);
          },
        ),
        ShellRoute(
          builder: (context, state, child) {
            return MainNavigation(child: child);
          },
          routes: [
            GoRoute(
              path: '/dashboard',
              builder: (context, state) => const DashboardScreen(),
            ),
            GoRoute(
              path: '/trips',
              builder: (context, state) => const TripsListScreen(),
            ),
            GoRoute(
              path: '/genie',
              builder: (context, state) => const VoyageGenieScreen(),
            ),
            GoRoute(
              path: '/explore',
              builder: (context, state) => const ExploreScreen(),
            ),
          ],
        ),
        GoRoute(
          path: '/trip/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return TripDetailsScreen(tripId: id);
          },
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    );

    if (authProvider.isLoading) {
      return MaterialApp(
        home: Scaffold(
          body: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF030712), Color(0xFF0a1628)],
              ),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFF3B82F6).withValues(alpha: 0.1),
                    ),
                    child: const Icon(Icons.explore, size: 64, color: Color(0xFF3B82F6)),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Voyage Genie',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      color: const Color(0xFF3B82F6),
                      strokeWidth: 2.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return MaterialApp.router(
      title: 'Voyage Genie',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF030712),
        primarySwatch: Colors.blue,
      ),
      routerConfig: router,
    );
  }
}




