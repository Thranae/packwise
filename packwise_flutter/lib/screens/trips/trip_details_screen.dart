import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/trip_provider.dart';
import '../../theme/liquid_glass.dart';
import 'tabs/timeline_tab.dart';
import 'tabs/budget_tab.dart';
import 'tabs/packing_list_tab.dart';
import 'tabs/documents_tab.dart';
import 'tabs/journal_tab.dart';

class TripDetailsScreen extends StatelessWidget {
  final String tripId;

  const TripDetailsScreen({Key? key, required this.tripId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final tripProvider = Provider.of<TripProvider>(context);
    final trip = tripProvider.trips.firstWhere(
      (t) => t.id == tripId,
      orElse: () => throw Exception('Trip not found: $tripId'),
    );

    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF030712), Color(0xFF0a1628)],
          ),
        ),
        child: DefaultTabController(
          length: 5,
          child: SafeArea(
            child: Column(
              children: [
                AppBar(
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  leading: IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => context.pop(),
                  ),
                  title: Consumer<TripProvider>(
                    builder: (context, provider, child) {
                      final trip = provider.trips.firstWhere(
                        (t) => t.id == tripId,
                      );
                      return Hero(
                        tag: 'trip_title_$tripId',
                        child: Material(
                          color: Colors.transparent,
                          child: Text(
                            trip.destination,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                  child: LiquidGlassCard(
                    padding: EdgeInsets.zero,
                    borderRadius: 20,
                    child: TabBar(
                      isScrollable: true,
                      indicatorColor: const Color(0xFF3B82F6),
                      labelColor: const Color(0xFF3B82F6),
                      unselectedLabelColor: Colors.white.withValues(alpha: 0.4),
                      tabs: const [
                        Tab(icon: Icon(Icons.calendar_today), text: 'Timeline'),
                        Tab(icon: Icon(Icons.pie_chart), text: 'Budget'),
                        Tab(icon: Icon(Icons.list_alt), text: 'Packing'),
                        Tab(icon: Icon(Icons.folder), text: 'Vault'),
                        Tab(icon: Icon(Icons.book), text: 'Journal'),
                      ],
                    ),
                  ),
                ),
                Expanded(
                  child: TabBarView(
                    children: [
                      TimelineTab(trip: trip),
                      BudgetTab(trip: trip),
                      PackingListTab(trip: trip),
                      DocumentsTab(trip: trip),
                      JournalTab(trip: trip),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

