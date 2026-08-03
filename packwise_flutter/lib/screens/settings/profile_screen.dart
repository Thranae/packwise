import 'dart:ui';
import 'package:flutter/material.dart';
import '../../theme/liquid_glass.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Profile',
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
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            children: [
              const SizedBox(height: 20),
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF3B82F6).withValues(alpha: 0.3),
                            blurRadius: 20,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 50,
                        backgroundColor: Colors.white.withValues(alpha: 0.1),
                        child: const Text(
                          'U',
                          style: TextStyle(fontSize: 40, color: Colors.white),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'User Name',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'user@example.com',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white.withValues(alpha: 0.6),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              _buildGlassTile(
                icon: Icons.dark_mode_outlined,
                title: 'Dark Mode',
                trailing: Switch(
                  value: true,
                  onChanged: (val) {},
                  activeTrackColor: const Color(0xFF3B82F6),
                ),
              ),
              const SizedBox(height: 16),
              _buildGlassTile(
                icon: Icons.notifications_outlined,
                title: 'Notifications',
                trailing: Switch(
                  value: true,
                  onChanged: (val) {},
                  activeTrackColor: const Color(0xFF3B82F6),
                ),
              ),
              const SizedBox(height: 16),
              _buildGlassTile(
                icon: Icons.language_outlined,
                title: 'Language',
                trailing: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('English', style: TextStyle(color: Colors.white70)),
                    SizedBox(width: 8),
                    Icon(Icons.chevron_right, color: Colors.white54),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              GestureDetector(
                onTap: () {
                  authProvider.logout();
                  context.go('/login');
                },
                child: _buildGlassTile(
                  icon: Icons.logout,
                  iconColor: Colors.redAccent,
                  title: 'Sign Out',
                  titleColor: Colors.redAccent,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGlassTile({
    required IconData icon,
    required String title,
    Color iconColor = Colors.white,
    Color titleColor = Colors.white,
    Widget? trailing,
  }) {
    return LiquidTilt(
      child: LiquidGlassCard(
        child: Row(
          children: [
            Icon(icon, color: iconColor),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: titleColor,
                ),
              ),
            ),
            if (trailing != null) trailing,
          ],
        ),
      ),
    );
  }
}

