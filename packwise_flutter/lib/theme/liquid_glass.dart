import 'dart:ui';
import 'package:flutter/material.dart';

class LiquidGlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final VoidCallback? onTap;

  const LiquidGlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16.0),
    this.borderRadius = 28.0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Widget card = ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 30.0, sigmaY: 30.0),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(borderRadius),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0x33FFFFFF),
                Color(0x1AFFFFFF),
              ],
            ),
            border: Border.all(color: Colors.white.withValues(alpha: 0.2), width: 1.0),
                  ),
                ),
              ),
              child,
            ],
          ),
        ),
      ),
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: card,
      );
    }
    return card;
  }
}

class LiquidGlassButton extends StatefulWidget {
  final Widget child;
  final VoidCallback onPressed;
  final EdgeInsetsGeometry padding;

  const LiquidGlassButton({
    super.key,
    required this.child,
    required this.onPressed,
    this.padding = const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
  });

  @override
  State<LiquidGlassButton> createState() => _LiquidGlassButtonState();
}

class _LiquidGlassButtonState extends State<LiquidGlassButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 150));
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: (_) => _controller.forward(),
        onTapUp: (_) {
          _controller.reverse();
          widget.onPressed();
        },
        onTapCancel: () => _controller.reverse(),
        child: AnimatedBuilder(
          animation: _scaleAnimation,
          builder: (context, child) => Transform.scale(
            scale: _scaleAnimation.value,
            child: child,
          ),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 500),
            curve: Curves.easeOutCubic,
            padding: widget.padding,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16.0),
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: _isHovered 
                  ? const [Color(0x4DFFFFFF), Color(0x1AFFFFFF)]
                  : const [Color(0x33FFFFFF), Color(0x0DFFFFFF)],
              ),
              border: Border.all(
                color: _isHovered ? const Color(0x80FFFFFF) : const Color(0x4DFFFFFF),
                width: 1.0,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0x4D000000),
                  blurRadius: _isHovered ? 32.0 : 16.0,
                  offset: Offset(0, _isHovered ? 16.0 : 8.0),
                ),
              ],
            ),
            child: Stack(
              children: [
                // Top glossy highlight
                Positioned(
                  top: 0, left: 0, right: 0, bottom: 20,
                  child: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0x4DFFFFFF), Colors.transparent],
                      ),
                    ),
                  ),
                ),
                Center(child: widget.child),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class LiquidGlassPill extends StatelessWidget {
  final Widget child;

  const LiquidGlassPill({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(999.0),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16.0, sigmaY: 16.0),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999.0),
            gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0x33FFFFFF), // 20% white
              Color(0x0AFFFFFF), // 4% white
            ],
          ),
          border: Border.all(color: Colors.white.withValues(alpha: 0.3), width: 1.0),
            border: Border.all(color: const Color(0x1AFFFFFF)),
          ),
          child: child,
        ),
      ),
    );
  }
}

class LiquidTilt extends StatefulWidget {
  final Widget child;

  const LiquidTilt({super.key, required this.child});

  @override
  State<LiquidTilt> createState() => _LiquidTiltState();
}

class _LiquidTiltState extends State<LiquidTilt> with SingleTickerProviderStateMixin {
  double _x = 0;
  double _y = 0;
  
  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onHover: (e) {
        final RenderBox box = context.findRenderObject() as RenderBox;
        final position = box.globalToLocal(e.position);
        final size = box.size;
        
        setState(() {
          _x = (position.dy / size.height) - 0.5;
          _y = (position.dx / size.width) - 0.5;
        });
      },
      onExit: (_) => setState(() { _x = 0; _y = 0; }),
      child: TweenAnimationBuilder(
        tween: Tween<double>(begin: 0, end: 1),
        duration: const Duration(milliseconds: 700),
        curve: Curves.easeOutCubic,
        builder: (context, val, child) {
          return Transform(
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateX(-_x * 0.3)
              ..rotateY(_y * 0.3),
            alignment: Alignment.center,
            child: widget.child,
          );
        },
      ),
    );
  }
}

