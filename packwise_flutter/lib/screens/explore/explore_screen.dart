import 'dart:ui';
import 'package:flutter/material.dart';
import '../../theme/liquid_glass.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> destinations = [
      {'name': 'Paris', 'icon': Icons.tour, 'color': Colors.pinkAccent},
      {'name': 'Tokyo', 'icon': Icons.temple_buddhist, 'color': Colors.redAccent},
      {'name': 'Bali', 'icon': Icons.beach_access, 'color': Colors.orangeAccent},
      {'name': 'New York', 'icon': Icons.location_city, 'color': Colors.blueAccent},
      {'name': 'London', 'icon': Icons.business, 'color': Colors.indigoAccent},
      {'name': 'Dubai', 'icon': Icons.apartment, 'color': Colors.amberAccent},
    ];

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Explore',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF030712),
              Color(0xFF0A1628),
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                _buildSearchBar(),
                const SizedBox(height: 32),
                const Text(
                  'Popular Destinations',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 0.85,
                    children: destinations.map((dest) {
                      return _buildDestinationCard(
                        name: dest['name'] as String,
                        icon: dest['icon'] as IconData,
                        iconColor: dest['color'] as Color,
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          height: 56,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.08),
              width: 1.5,
            ),
          ),
          child: const Row(
            children: [
              Icon(Icons.search, color: Colors.white54),
              SizedBox(width: 12),
              Expanded(
                child: TextField(
                  style: TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search destinations...',
                    hintStyle: TextStyle(color: Colors.white54),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDestinationCard({
    required String name,
    required IconData icon,
    required Color iconColor,
  }) {
    return LiquidTilt(
      child: LiquidGlassCard(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: iconColor.withValues(alpha: 0.2),
                boxShadow: [
                  BoxShadow(
                    color: iconColor.withValues(alpha: 0.3),
                    blurRadius: 15,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Icon(icon, color: iconColor, size: 32),
            ),
            const SizedBox(height: 16),
            Text(
              name,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

