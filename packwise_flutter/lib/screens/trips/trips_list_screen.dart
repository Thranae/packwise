import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/trip_provider.dart';
import '../../theme/liquid_glass.dart';

class TripsListScreen extends StatefulWidget {
  const TripsListScreen({Key? key}) : super(key: key);

  @override
  State<TripsListScreen> createState() => _TripsListScreenState();
}

class _TripsListScreenState extends State<TripsListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TripProvider>().fetchTrips();
    });
  }

  Future<void> _refresh() async {
    await context.read<TripProvider>().fetchTrips();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('All Trips', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF030712), Color(0xFF0a1628)],
          ),
        ),
        child: Consumer<TripProvider>(
          builder: (context, tripProvider, child) {
            if (tripProvider.isLoading) {
              return const Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6)));
            }

            if (tripProvider.error != null) {
              return Center(child: Text('Error: ${tripProvider.error}', style: const TextStyle(color: Colors.white)));
            }

            final trips = tripProvider.trips;

            if (trips.isEmpty) {
              return const Center(
                child: Text('No trips found. Create one!', style: TextStyle(color: Colors.white70)),
              );
            }

            return RefreshIndicator(
              onRefresh: _refresh,
              color: const Color(0xFF3B82F6),
              backgroundColor: const Color(0xFF030712),
              child: ListView.builder(
                padding: const EdgeInsets.only(top: 100, bottom: 20, left: 16, right: 16),
                itemCount: trips.length,
                itemBuilder: (context, index) {
                  final trip = trips[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: LiquidTilt(
                      child: LiquidGlassCard(
                        padding: EdgeInsets.zero,
                        onTap: () {
                          context.push('/trips/${trip.id}');
                        },
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          leading: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF3B82F6).withValues(alpha: 0.2),
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.3)),
                            ),
                            child: const Icon(Icons.location_on, color: Color(0xFF3B82F6)),
                          ),
                          title: Hero(
                            tag: 'trip_title_${trip.id}',
                            child: Material(
                              color: Colors.transparent,
                              child: Text(
                                trip.destination,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              '${trip.startDate} - ${trip.endDate}',
                              style: TextStyle(color: Colors.white.withValues(alpha: 0.7)),
                            ),
                          ),
                          trailing: Icon(
                            Icons.chevron_right,
                            color: Colors.white.withValues(alpha: 0.5),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/trips/new'),
        backgroundColor: const Color(0xFF3B82F6),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

