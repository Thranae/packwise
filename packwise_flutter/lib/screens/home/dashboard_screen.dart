import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../theme/liquid_glass.dart';
import '../../components/animated_background.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with TickerProviderStateMixin {
  late AnimationController _floatController1;
  late AnimationController _floatController2;
  late AnimationController _floatController3;

  @override
  void initState() {
    super.initState();
    _floatController1 = AnimationController(duration: const Duration(seconds: 6), vsync: this)..repeat(reverse: true);
    _floatController2 = AnimationController(duration: const Duration(seconds: 4), vsync: this)..repeat(reverse: true);
    _floatController3 = AnimationController(duration: const Duration(seconds: 5), vsync: this)..repeat(reverse: true);
  }

  @override
  void dispose() {
    _floatController1.dispose();
    _floatController2.dispose();
    _floatController3.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final isAuthenticated = authProvider.isAuthenticated;
    final size = MediaQuery.of(context).size;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.flight_takeoff, color: Color(0xFF3B82F6), size: 28),
            SizedBox(width: 8),
            Text('Voyage Genie', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20)),
          ],
        ),
        actions: [
          if (isAuthenticated)
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: GestureDetector(
                onTap: () => context.push('/profile'),
                child: const CircleAvatar(
                  radius: 18,
                  backgroundColor: Color(0xFF3B82F6),
                  child: Icon(Icons.person, color: Colors.white, size: 20),
                ),
              ),
            ),
        ],
      ),
      body: Stack(
        children: [
          const AnimatedBackground(),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 100),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const LiquidGlassPill(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.auto_awesome, color: Color(0xFF3B82F6), size: 16),
                          SizedBox(width: 8),
                          Text(
                            'NEXT GENERATION PLANNING',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Travel Smarter\nwith AI.',
                      style: TextStyle(
                        fontSize: 48,
                        height: 1.1,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: -1.5,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Design the perfect journey. Automate logistics, discover hidden gems, and experience seamless travel tailored exclusively to you.',
                      style: TextStyle(
                        fontSize: 16,
                        height: 1.5,
                        color: Colors.white.withValues(alpha: 0.6),
                      ),
                    ),
                    const SizedBox(height: 32),
                    if (isAuthenticated)
                      Row(
                        children: [
                          Expanded(
                            child: LiquidGlassButton(
                              onPressed: () => context.go('/trips'),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.map, color: Colors.greenAccent, size: 20),
                                  SizedBox(width: 8),
                                  Text('My Trips', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: LiquidGlassButton(
                              onPressed: () => context.go('/genie'),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.auto_awesome, color: Colors.purpleAccent, size: 20),
                                  SizedBox(width: 8),
                                  Text('AI Planner', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      )
                    else
                      Row(
                        children: [
                          Expanded(
                            child: LiquidGlassButton(
                              onPressed: () => context.push('/signup'),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.location_on, color: Colors.white, size: 20),
                                  SizedBox(width: 8),
                                  Text('Start Exploring', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    const SizedBox(height: 64),
                    SizedBox(
                      height: size.height * 0.45,
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          // Center Map
                          AnimatedBuilder(
                            animation: _floatController1,
                            builder: (context, child) => Positioned(
                              top: -10 * _floatController1.value,
                              left: 20,
                              right: 20,
                              bottom: 10 * _floatController1.value,
                              child: child!,
                            ),
                            child: LiquidTilt(
                              child: LiquidGlassCard(
                                padding: EdgeInsets.zero,
                                child: Stack(
                                  fit: StackFit.expand,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(28),
                                      child: Image.network(
                                        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) {
                                          return Container(
                                            color: const Color(0xFF1E293B),
                                            child: const Center(
                                              child: Icon(Icons.image_not_supported, color: Colors.white54, size: 40),
                                            ),
                                          );
                                        },
                                      ),
                                    ),
                                    Container(
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(28),
                                        gradient: const LinearGradient(
                                          begin: Alignment.bottomCenter,
                                          end: Alignment.topCenter,
                                          colors: [Colors.black87, Colors.transparent],
                                        ),
                                      ),
                                    ),
                                    const Positioned(
                                      bottom: 24,
                                      left: 24,
                                      right: 24,
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text('Current Itinerary', style: TextStyle(color: Colors.white70, fontSize: 12)),
                                              Text('Kyoto, Japan', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                                            ],
                                          ),
                                          LiquidGlassPill(child: Text('Active', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))),
                                        ],
                                      ),
                                    )
                                  ],
                                ),
                              ),
                            ),
                          ),
                          // Weather Widget
                          AnimatedBuilder(
                            animation: _floatController2,
                            builder: (context, child) => Positioned(
                              top: 20 - (15 * _floatController2.value),
                              right: -10,
                              child: child!,
                            ),
                            child: Transform.rotate(
                              angle: 0.1,
                              child: LiquidTilt(
                                child: LiquidGlassCard(
                                  padding: const EdgeInsets.all(20),
                                  borderRadius: 24,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.cloud, color: Colors.yellow, size: 32),
                                          SizedBox(width: 16),
                                          Text('24°', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text('Sunny • Kyoto', style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 12, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                          // Flight Widget
                          AnimatedBuilder(
                            animation: _floatController3,
                            builder: (context, child) => Positioned(
                              bottom: 20 + (20 * _floatController3.value),
                              left: -10,
                              child: child!,
                            ),
                            child: Transform.rotate(
                              angle: -0.05,
                              child: LiquidTilt(
                                child: LiquidGlassCard(
                                  padding: const EdgeInsets.all(20),
                                  borderRadius: 24,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Text('JFK', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                                          const SizedBox(width: 12),
                                          const Icon(Icons.flight_takeoff, color: Colors.white54, size: 20),
                                          const SizedBox(width: 12),
                                          const Text('KIX', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      const LiquidGlassPill(child: Text('On Time', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold))),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}


