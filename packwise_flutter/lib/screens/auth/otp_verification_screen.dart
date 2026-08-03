import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String email;

  const OtpVerificationScreen({Key? key, required this.email}) : super(key: key);

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final _otpController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleVerifyOtp() async {
    final otp = _otpController.text.trim();
    if (otp.isEmpty) return;

    setState(() => _isLoading = true);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final response = await authProvider.verifyOtp(widget.email, otp);
    setState(() => _isLoading = false);
    
    if (mounted) {
      if (response['success'] == true) {
        context.go('/dashboard');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Invalid OTP')),
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
                  const Icon(Icons.password, size: 64, color: Color(0xFF3B82F6)),
                  const SizedBox(height: 24),
                  const Text(
                    'Enter OTP',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sent to ${widget.email}',
                    style: TextStyle(fontSize: 16, color: Colors.white.withValues(alpha: 0.7)),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  _buildGlassTextField(
                    controller: _otpController,
                    hint: 'OTP',
                    prefixIcon: Icons.lock_clock,
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    maxLength: 6,
                    style: const TextStyle(
                      color: Colors.white,
                      letterSpacing: 8,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 32),
                  _buildGradientButton(
                    label: 'Verify & Login',
                    onPressed: _isLoading ? null : _handleVerifyOtp,
                    isLoading: _isLoading,
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
