import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isAuthenticated = false;
  bool _isLoading = true;
  final AuthService _authService = AuthService();
  final _storage = const FlutterSecureStorage();

  User? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;

  Future<void> initAuth() async {
    final token = await _storage.read(key: 'jwt_token');
    if (token == null) {
      _isLoading = false;
      notifyListeners();
      return;
    }

    try {
      final response = await _authService.getMe();
      if (response['success'] == true && response['data'] != null) {
        _user = User.fromJson(response['data']);
        _isAuthenticated = true;
      }
    } catch (e) {
      // Token invalid or expired
      await _storage.delete(key: 'jwt_token');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _authService.login(email, password);
      if (response['success'] == true) {
        await _storage.write(key: 'jwt_token', value: response['data']['token']);
        _user = User.fromJson(response['data']['user']);
        _isAuthenticated = true;
        notifyListeners();
      }
      return response;
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> signup(String name, String email, String password) async {
    try {
      final response = await _authService.signup(name, email, password);
      if (response['success'] == true) {
        await _storage.write(key: 'jwt_token', value: response['data']['token']);
        _user = User.fromJson(response['data']['user']);
        _isAuthenticated = true;
        notifyListeners();
      }
      return response;
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> googleLogin(String tokenId) async {
    try {
      final response = await _authService.googleLogin(tokenId);
      if (response['success'] == true) {
        await _storage.write(key: 'jwt_token', value: response['data']['token']);
        _user = User.fromJson(response['data']['user']);
        _isAuthenticated = true;
        notifyListeners();
      }
      return response;
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      final response = await _authService.forgotPassword(email);
      return response;
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    try {
      final response = await _authService.verifyOtp(email, otp);
      if (response['success'] == true) {
        await _storage.write(key: 'jwt_token', value: response['data']['token']);
        _user = User.fromJson(response['data']['user']);
        _isAuthenticated = true;
        notifyListeners();
      }
      return response;
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    await _storage.delete(key: 'jwt_token');
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}

