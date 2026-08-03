import 'package:flutter/material.dart';
import 'dart:ui';
import '../../../models/trip.dart';

class JournalTab extends StatefulWidget {
  final Trip trip;
  const JournalTab({super.key, required this.trip});

  @override
  State<JournalTab> createState() => _JournalTabState();
}

class _JournalTabState extends State<JournalTab> {
  final TextEditingController _entryController = TextEditingController();
  final List<String> _entries = [];

  void _addEntry() {
    if (_entryController.text.trim().isNotEmpty) {
      setState(() {
        _entries.insert(0, _entryController.text.trim());
        _entryController.clear();
      });
    }
  }

  @override
  void dispose() {
    _entryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF030712), Color(0xFF0a1628)],
          ),
        ),
        child: Column(
          children: [
            Expanded(
              child: _entries.isEmpty ? _buildEmptyState() : _buildEntriesList(),
            ),
            _buildInputArea(),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.06),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF3B82F6).withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.book,
                      color: Color(0xFF3B82F6),
                      size: 32,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Journal',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Start writing your travel story',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.5),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEntriesList() {
    return ListView.builder(
      padding: const EdgeInsets.all(24),
      itemCount: _entries.length,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16.0),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                ),
                child: Text(
                  _entries[index],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    height: 1.5,
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildInputArea() {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
        child: Container(
          padding: const EdgeInsets.all(16).copyWith(bottom: 32),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.04),
            border: Border(
              top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                  ),
                  child: TextField(
                    controller: _entryController,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Write a new entry...',
                      hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.5)),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    ),
                    maxLines: null,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _addEntry(),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Container(
                decoration: const BoxDecoration(
                  color: Color(0xFF3B82F6),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.send, color: Colors.white),
                  onPressed: _addEntry,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
