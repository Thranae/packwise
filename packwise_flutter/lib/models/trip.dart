class Trip {
  final String id;
  final String destination;
  final String startCity;
  final DateTime startDate;
  final DateTime endDate;
  final String status;
  final List<String> collaborators;
  final List<dynamic> timeline;
  final Map<String, dynamic> budget;
  final String coverImage;

  Trip({
    required this.id,
    required this.destination,
    this.startCity = '',
    required this.startDate,
    required this.endDate,
    required this.status,
    required this.collaborators,
    this.timeline = const [],
    this.budget = const {},
    this.coverImage = '',
  });

  factory Trip.fromJson(Map<String, dynamic> json) {
    return Trip(
      id: json['_id'] ?? '',
      destination: json['destination'] ?? 'Unknown',
      startCity: json['startCity'] ?? '',
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : DateTime.now(),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : DateTime.now().add(const Duration(days: 1)),
      status: json['status'] ?? 'planned',
      collaborators: json['collaborators'] != null ? List<String>.from(json['collaborators']) : [],
      timeline: json['timeline'] ?? [],
      budget: json['budget'] ?? {},
      coverImage: json['coverImage'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'destination': destination,
      'startCity': startCity,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'status': status,
      'collaborators': collaborators,
      'timeline': timeline,
      'budget': budget,
      'coverImage': coverImage,
    };
  }
}

