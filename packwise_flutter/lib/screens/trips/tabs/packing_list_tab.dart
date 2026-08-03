import 'package:flutter/material.dart';
import 'dart:ui';
import '../../../models/trip.dart';

class PackingListTab extends StatefulWidget {
  final Trip trip;
  const PackingListTab({super.key, required this.trip});

  @override
  State<PackingListTab> createState() => _PackingListTabState();
}

class _PackingListTabState extends State<PackingListTab> {
  final Map<String, List<Map<String, dynamic>>> packingData = {
    'Essentials': [
      {'name': 'Passport', 'packed': true},
      {'name': 'Tickets', 'packed': false},
      {'name': 'Wallet', 'packed': true},
    ],
    'Clothing': [
      {'name': 'T-Shirts', 'packed': false},
      {'name': 'Pants', 'packed': false},
      {'name': 'Jacket', 'packed': false},
    ],
    'Toiletries': [
      {'name': 'Toothbrush', 'packed': true},
      {'name': 'Toothpaste', 'packed': false},
      {'name': 'Deodorant', 'packed': false},
    ],
    'Electronics': [
      {'name': 'Phone Charger', 'packed': false},
      {'name': 'Power Bank', 'packed': false},
      {'name': 'Headphones', 'packed': true},
    ],
  };

  int get totalItems {
    int count = 0;
    for (var category in packingData.values) {
      count += category.length;
    }
    return count;
  }

  int get packedItems {
    int count = 0;
    for (var category in packingData.values) {
      count += category.where((item) => item['packed'] == true).length;
    }
    return count;
  }

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
            _buildProgressCard(),
            const SizedBox(height: 24),
            ...packingData.keys.map((category) => _buildCategorySection(category)).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressCard() {
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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Packing Progress',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '$packedItems / $totalItems',
                    style: const TextStyle(
                      color: Color(0xFF3B82F6),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: totalItems > 0 ? packedItems / totalItems : 0,
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

  Widget _buildCategorySection(String category) {
    final items = packingData[category]!;
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    category,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                ...items.map((item) {
                  return CheckboxListTile(
                    title: Text(
                      item['name'],
                      style: TextStyle(
                        color: item['packed'] ? Colors.white.withValues(alpha: 0.5) : Colors.white,
                        decoration: item['packed'] ? TextDecoration.lineThrough : null,
                      ),
                    ),
                    value: item['packed'],
                    onChanged: (bool? value) {
                      setState(() {
                        item['packed'] = value ?? false;
                      });
                    },
                    checkColor: Colors.white,
                    activeColor: const Color(0xFF3B82F6),
                    side: BorderSide(color: Colors.white.withValues(alpha: 0.5)),
                  );
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
