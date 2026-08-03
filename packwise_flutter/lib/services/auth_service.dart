import 'api_client.dart';


class AuthService {
  final ApiClient _api = ApiClient();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _api.post('/auth/login', {
      'email': email,
      'password': password,
    });
    return response;
  }

  Future<Map<String, dynamic>> signup(String name, String email, String password) async {
    final response = await _api.post('/auth/signup', {
      'name': name,
      'email': email,
      'password': password,
    });
    return response;
  }

  Future<Map<String, dynamic>> getMe() async {
    final response = await _api.get('/auth/me');
    return response;
  }

  Future<Map<String, dynamic>> googleLogin(String tokenId) async {
    final response = await _api.post('/auth/google', {
      'tokenId': tokenId,
    });
    return response;
  }

  Future<Map<String, dynamic>> forgotPassword(String email) async {
    final response = await _api.post('/auth/forgot-password', {
      'email': email,
    });
    return response;
  }

  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    final response = await _api.post('/auth/verify-otp', {
      'email': email,
      'otp': otp,
    });
    return response;
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout', {});
    } catch (e) {
      // Ignore if server logout fails (e.g., token already invalid)
    }
  }
}

