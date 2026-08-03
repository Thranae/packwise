import 'package:flutter/material.dart';
import 'dart:ui';
import '../../../models/trip.dart';

class BudgetTab extends StatelessWidget {
  final Trip trip;
  const BudgetTab({super.key, required this.trip});

  final Map<String, IconData> iconMap = const {
    'flight': Icons.flight,
    'accommodation': Icons.hotel,
    'food': Icons.restaurant,
    'activity': Icons.local_activity,
    'transport': Icons.directions_car,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF030712), Color(0xFF0a1628)],
          ),
        ),
        child: ListView(
          padding: const EdgeInsets.all(24.0),
          children: [
            _buildTotalBudgetCard(),
            const SizedBox(height: 24),
            _buildCategoryCard('Flights', 'flight', 450.0, 600.0),
            const SizedBox(height: 16),
            _buildCategoryCard('Hotels', 'accommodation', 300.0, 400.0),
            const SizedBox(height: 16),
            _buildCategoryCard('Food', 'food', 120.0, 300.0),
            const SizedBox(height: 16),
            _buildCategoryCard('Activities', 'activity', 50.0, 200.0),
            const SizedBox(height: 16),
            _buildCategoryCard('Transport', 'transport', 30.0, 100.0),
            const SizedBox(height: 80),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: const Color(0xFF3B82F6),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Expense', style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Widget _buildTotalBudgetCard() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: Column(
            children: [
              Text(
                'Total Spent',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.5),
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                '\$950.00',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'of \$1,600.00 budget',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.5),
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: 950 / 1600,
                  minHeight: 8,
                  backgroundColor: Colors.white.withValues(alpha: 0.1),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF3B82F6)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryCard(String title, String iconKey, double spent, double total) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF3B82F6).withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      iconMap[iconKey] ?? Icons.category,
                      color: const Color(0xFF3B82F6),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '\$${spent.toStringAsFixed(2)} / \$${total.toStringAsFixed(2)}',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.5),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: total > 0 ? spent / total : 0,
                  minHeight: 6,
                  backgroundColor: Colors.white.withValues(alpha: 0.1),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF3B82F6)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
