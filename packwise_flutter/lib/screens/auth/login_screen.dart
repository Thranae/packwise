import 'dart:ui';
import 'package:flutter/material.dart';
import '../../theme/liquid_glass.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    setState(() => _isLoading = true);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final response = await authProvider.login(
      _emailController.text.trim(),
      _passwordController.text,
    );
    setState(() => _isLoading = false);
    if (mounted) {
      if (response['success'] == true) {
        context.go('/dashboard');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Login failed')),
        );
      }
    }
  }

  Future<void> _handleGoogleLogin() async {
    try {
      final account = await GoogleSignIn.instance.authenticate(scopeHint: ['email', 'profile']);
      
      if (account != null) {
        final googleAuth = account.authentication;
        final String? idToken = googleAuth.idToken;
        
        if (idToken != null) {
          final authProvider = Provider.of<AuthProvider>(context, listen: false);
          final response = await authProvider.googleLogin(idToken);
          if (mounted && response['success'] == true) {
            context.go('/dashboard');
          } else if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(response['message'] ?? 'Google login failed')),
            );
          }
        } else {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to get ID token from Google.')));
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Google Sign-In Error: $e')),
        );
      }
    }
  }

  Widget _buildGlassTextField({
    required TextEditingController controller,
    required String hint,
    required IconData prefixIcon,
    bool obscure = false,
    Widget? suffixIcon,
    TextInputType? keyboardType,
    TextAlign textAlign = TextAlign.start,
    int? maxLength,
    TextStyle? style,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: TextField(
            controller: controller,
            style: style ?? const TextStyle(color: Colors.white),
            obscureText: obscure,
            keyboardType: keyboardType,
            textAlign: textAlign,
            maxLength: maxLength,
            decoration: InputDecoration(
              counterText: '',
              hintText: hint,
              hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.3)),
              prefixIcon: Icon(prefixIcon, color: Colors.white.withValues(alpha: 0.5)),
              suffixIcon: suffixIcon,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGradientButton({required String label, required VoidCallback? onPressed, bool isLoading = false}) {
    return LiquidGlassButton(
      onPressed: onPressed ?? () {},
      child: isLoading
          ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
          : Text(label, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF030712), Color(0xFF0a1628)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.explore, size: 64, color: Color(0xFF3B82F6)),
                  const SizedBox(height: 24),
                  const Text(
                    'Welcome Back',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to Voyage Genie',
                    style: TextStyle(fontSize: 16, color: Colors.white.withValues(alpha: 0.7)),
                  ),
                  const SizedBox(height: 48),
                  _buildGlassTextField(
                    controller: _emailController,
                    hint: 'Email',
                    prefixIcon: Icons.email,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),
                  _buildGlassTextField(
                    controller: _passwordController,
                    hint: 'Password',
                    prefixIcon: Icons.lock,
                    obscure: _obscurePassword,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                        color: Colors.white.withValues(alpha: 0.5),
                      ),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () => context.push('/forgot-password'),
                      child: const Text('Forgot Password?', style: TextStyle(color: Color(0xFF3B82F6))),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildGradientButton(
                    label: 'Sign In',
                    onPressed: _isLoading ? null : _handleLogin,
                    isLoading: _isLoading,
                  ),
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.2))),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'Or continue with',
                          style: TextStyle(color: Colors.white.withValues(alpha: 0.5)),
                        ),
                      ),
                      Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.2))),
                    ],
                  ),
                  const SizedBox(height: 32),
                  LiquidGlassButton(
                    onPressed: _handleGoogleLogin,
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('G  ', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                        Text('Continue with Google', style: TextStyle(fontSize: 16, color: Colors.white)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Don\'t have an account?',
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.7)),
                      ),
                      TextButton(
                        onPressed: () => context.push('/signup'),
                        child: const Text('Sign Up', style: TextStyle(color: Color(0xFF3B82F6))),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}



