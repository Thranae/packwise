import 'api_client.dart';

class TripService {
  final ApiClient _api = ApiClient();

  Future<Map<String, dynamic>> getAllTrips() async {
    return await _api.get('/trips');
  }

  Future<Map<String, dynamic>> getTrip(String id) async {
    return await _api.get('/trips/$id');
  }

  Future<Map<String, dynamic>> generateTrip(Map<String, dynamic> tripData) async {
    return await _api.post('/trips/generate', tripData);
  }

  Future<Map<String, dynamic>> createTrip(Map<String, dynamic> tripData) async {
    return await _api.post('/trips', tripData);
  }

  Future<Map<String, dynamic>> updateTrip(String id, Map<String, dynamic> tripData) async {
    return await _api.put('/trips/$id', tripData);
  }

  Future<Map<String, dynamic>> deleteTrip(String id) async {
    return await _api.delete('/trips/$id');
  }
}

