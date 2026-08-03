import 'package:flutter/material.dart';
import '../../theme/liquid_glass.dart';
import 'dart:ui';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/trip_provider.dart';

class VoyageGenieScreen extends StatefulWidget {
  const VoyageGenieScreen({Key? key}) : super(key: key);

  @override
  State<VoyageGenieScreen> createState() => _VoyageGenieScreenState();
}

class _VoyageGenieScreenState extends State<VoyageGenieScreen> with SingleTickerProviderStateMixin {
  int _currentStep = 0;
  final TextEditingController _destinationController = TextEditingController();
  final TextEditingController _travelersController = TextEditingController();
  DateTimeRange? _selectedDates;
  bool _isLoading = false;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.2).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _destinationController.dispose();
    _travelersController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _selectDates() async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Color(0xFF3B82F6),
              onPrimary: Colors.white,
              surface: Color(0xFF0a1628),
              onSurface: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _selectedDates = picked;
      });
    }
  }

  void _nextStep() {
    if (_currentStep < 2) {
      setState(() {
        _currentStep++;
      });
    } else {
      _generateTrip();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  Future<void> _generateTrip() async {
    if (_destinationController.text.isEmpty || _selectedDates == null || _travelersController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final tripData = {
        'destination': _destinationController.text,
        'startDate': _selectedDates!.start.toIso8601String().split('T')[0],
        'endDate': _selectedDates!.end.toIso8601String().split('T')[0],
        'travelers': int.tryParse(_travelersController.text) ?? 1,
        'preferences': ['sightseeing', 'food'], // Default preferences
      };

      final tripProvider = Provider.of<TripProvider>(context, listen: false);
      final response = await tripProvider.generateTrip(tripData);
      
      if (mounted) {
        if (response['success'] == true) {
          context.go('/trips');
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(response['message'] ?? 'Failed to generate trip')));
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Widget _buildGlassInput({required Widget child}) {
    return LiquidGlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      borderRadius: 16,
      child: child,
    );
  }

  Widget _buildStepContent() {
    if (_isLoading) {
      return Center(
        child: ScaleTransition(
          scale: _pulseAnimation,
          child: Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFF3B82F6).withValues(alpha: 0.2),
              border: Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.5)),
            ),
            child: const Icon(Icons.auto_awesome, color: Color(0xFF3B82F6), size: 48),
          ),
        ),
      );
    }

    switch (_currentStep) {
      case 0:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Where to?',
              style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            _buildGlassInput(
              child: TextField(
                controller: _destinationController,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'e.g. Paris, France',
                  hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.4)),
                  icon: const Icon(Icons.location_on, color: Color(0xFF3B82F6)),
                ),
              ),
            ),
          ],
        );
      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'When are you going?',
              style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            InkWell(
              onTap: _selectDates,
              child: _buildGlassInput(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, color: Color(0xFF3B82F6)),
                      const SizedBox(width: 16),
                      Text(
                        _selectedDates != null
                            ? '${_selectedDates!.start.toString().split(' ')[0]} to ${_selectedDates!.end.toString().split(' ')[0]}'
                            : 'Select dates',
                        style: TextStyle(
                          color: _selectedDates != null ? Colors.white : Colors.white.withValues(alpha: 0.4),
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        );
      case 2:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Who is traveling?',
              style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            _buildGlassInput(
              child: TextField(
                controller: _travelersController,
                style: const TextStyle(color: Colors.white),
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'Number of travelers',
                  hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.4)),
                  icon: const Icon(Icons.people, color: Color(0xFF3B82F6)),
                ),
              ),
            ),
          ],
        );
      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.auto_awesome, color: Color(0xFF3B82F6)),
            SizedBox(width: 8),
            Text('Voyage Genie', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            if (_currentStep > 0 && !_isLoading) {
              _previousStep();
            } else {
              context.pop();
            }
          },
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
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                if (!_isLoading) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(3, (index) {
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _currentStep >= index ? const Color(0xFF3B82F6) : Colors.white.withValues(alpha: 0.2),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 32),
                ],
                Expanded(
                  child: Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.06),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                          ),
                          child: _buildStepContent(),
                        ),
                      ),
                    ),
                  ),
                ),
                if (!_isLoading) ...[
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF3B82F6), Color(0xFF2563EB)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF3B82F6).withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: _nextStep,
                        child: Center(
                          child: Text(
                            _currentStep < 2 ? 'Next' : 'Generate Trip',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}


