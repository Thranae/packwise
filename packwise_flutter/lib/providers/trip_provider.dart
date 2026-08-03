import 'package:flutter/material.dart';
import '../models/trip.dart';
import '../services/trip_service.dart';

class TripProvider with ChangeNotifier {
  List<Trip> _trips = [];
  bool _isLoading = false;
  String? _error;
  final TripService _tripService = TripService();

  List<Trip> get trips => _trips;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchTrips() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _tripService.getAllTrips();
      if (response['success'] == true) {
        final List<dynamic> data = response['data'];
        _trips = data.map((json) => Trip.fromJson(json)).toList();
        
        // Sort by start date (upcoming first)
        _trips.sort((a, b) => a.startDate.compareTo(b.startDate));
      } else {
        _error = response['message'] ?? 'Failed to load trips';
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Map<String, dynamic>> generateTrip(Map<String, dynamic> tripData) async {
    try {
      final response = await _tripService.generateTrip(tripData);
      if (response['success'] == true) {
        // We might want to refresh the trips list
        fetchTrips();
      }
      return response;
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  void clearTrips() {
    _trips = [];
    notifyListeners();
  }
}

