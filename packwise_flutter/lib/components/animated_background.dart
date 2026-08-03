import 'dart:ui';
import 'package:flutter/material.dart';

class AnimatedBackground extends StatefulWidget {
  const AnimatedBackground({super.key});

  @override
  State<AnimatedBackground> createState() => _AnimatedBackgroundState();
}

class _AnimatedBackgroundState extends State<AnimatedBackground> with TickerProviderStateMixin {
  late final AnimationController _controller1;
  late final AnimationController _controller2;
  late final AnimationController _controller3;

  @override
  void initState() {
    super.initState();
    _controller1 = AnimationController(duration: const Duration(seconds: 20), vsync: this)..repeat(reverse: true);
    _controller2 = AnimationController(duration: const Duration(seconds: 25), vsync: this)..repeat(reverse: true);
    _controller3 = AnimationController(duration: const Duration(seconds: 22), vsync: this)..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller1.dispose();
    _controller2.dispose();
    _controller3.dispose();
    super.dispose();
  }

  Widget _buildBlob(Animation<double> animation, Color color, double size, Alignment begin, Alignment end) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Align(
          alignment: Alignment.lerp(begin, end, animation.value)!,
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [color, color.withValues(alpha: 0.0)],
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final blobSize = size.width * 0.8;

    return Stack(
      children: [
        Container(color: const Color(0xFF020617)), // bg-[#020617]
        _buildBlob(_controller1, const Color(0x33FFFFFF), blobSize, const Alignment(-1.5, -1.5), const Alignment(1.5, 0)),
        _buildBlob(_controller2, const Color(0x26FFFFFF), blobSize * 0.8, const Alignment(1.5, 1.5), const Alignment(-1.5, 0)),
        _buildBlob(_controller3, const Color(0x66334155), blobSize * 1.2, const Alignment(-0.5, 0.5), const Alignment(1.0, -1.0)),
        _buildBlob(_controller1, const Color(0x80312E81), blobSize * 1.4, const Alignment(1.5, -1.5), const Alignment(-1.5, 1.5)),
        
        // Dotted Texture Overlay
        Positioned.fill(
          child: IgnorePointer(
            child: Opacity(
              opacity: 0.2,
              child: CustomPaint(
                painter: DottedBackgroundPainter(),
              ),
            ),
          ),
        ),
        

          ),
        ),
      ],
    );
  }
}

class DottedBackgroundPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.4)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.fill;
      
    const double spacing = 24.0;
    
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        canvas.drawCircle(Offset(x, y), 1.0, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

