import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:go_router/go_router.dart';

class MainNavigation extends StatelessWidget {
  final Widget child;
  const MainNavigation({super.key, required this.child});

  int _calculateSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/dashboard')) return 0;
    if (location.startsWith('/trips')) return 1;
    if (location.startsWith('/genie')) return 2;
    if (location.startsWith('/explore')) return 3;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/trips');
        break;
      case 2:
        context.go('/genie');
        break;
      case 3:
        context.go('/explore');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentIndex = _calculateSelectedIndex(context);

    return Scaffold(
      extendBody: true,
      backgroundColor: const Color(0xFF030712),
      body: child,
      bottomNavigationBar: ClipRRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.06),
              border: Border(
                top: BorderSide(
                  color: Colors.white.withValues(alpha: 0.08),
                  width: 0.5,
                ),
              ),
            ),
            child: BottomNavigationBar(
              elevation: 0,
              backgroundColor: Colors.transparent,
              type: BottomNavigationBarType.fixed,
              currentIndex: currentIndex,
              selectedItemColor: const Color(0xFF3B82F6),
              unselectedItemColor: Colors.white.withValues(alpha: 0.4),
              onTap: (index) => _onItemTapped(index, context),
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.home_rounded),
                  label: 'Home',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.luggage_rounded),
                  label: 'Trips',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.auto_awesome_rounded),
                  label: 'Genie',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.public_rounded),
                  label: 'Explore',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
