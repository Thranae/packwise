import 'dart:ui';
import 'package:flutter/material.dart';
import '../../theme/liquid_glass.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../providers/auth_provider.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({Key? key}) : super(key: key);

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  Future<void> _handleSignup() async {
    setState(() => _isLoading = true);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final response = await authProvider.signup(
      _nameController.text.trim(),
      _emailController.text.trim(),
      _passwordController.text,
    );
    setState(() => _isLoading = false);
    if (mounted) {
      if (response['success'] == true) {
        context.go('/dashboard');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Registration failed')),
        );
      }
    }
  }

  Future<void> _handleGoogleSignup() async {
    try {
      
      final account = await GoogleSignIn.instance.authenticate(scopeHint: ['email', 'profile']);
      if (account != null) {
        final authorization = await account.authorizationClient.authorizeScopes(['email', 'profile']);
        final accessToken = authorization.accessToken;
        
        if (accessToken != null) {
          final authProvider = Provider.of<AuthProvider>(context, listen: false);
          final response = await authProvider.googleLogin(accessToken);
          if (mounted && response['success'] == true) {
            context.go('/dashboard');
          } else if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(response['message'] ?? 'Google signup failed')),
            );
          }
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
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
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(colors: [Color(0xFF3B82F6), Color(0xFF2563EB)]),
        boxShadow: [
          BoxShadow(color: const Color(0xFF3B82F6).withValues(alpha: 0.3), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        ),
        child: isLoading
            ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
            : Text(label, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
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
                  const Text(
                    'Create Account',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Start your journey with Voyage Genie',
                    style: TextStyle(fontSize: 16, color: Colors.white.withValues(alpha: 0.7)),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  _buildGlassTextField(
                    controller: _nameController,
                    hint: 'Full Name',
                    prefixIcon: Icons.person,
                  ),
                  const SizedBox(height: 16),
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
                  const SizedBox(height: 32),
                  _buildGradientButton(
                    label: 'Create Account',
                    onPressed: _isLoading ? null : _handleSignup,
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
                  OutlinedButton.icon(
                    onPressed: _handleGoogleSignup,
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      minimumSize: const Size(double.infinity, 56),
                    ),
                    icon: const Text('G', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                    label: const Text('Continue with Google', style: TextStyle(fontSize: 16, color: Colors.white)),
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



