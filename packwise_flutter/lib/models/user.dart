class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final bool isVerified;
  final String theme;
  final String defaultCurrency;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.isVerified,
    required this.theme,
    required this.defaultCurrency,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      isVerified: json['isVerified'] ?? false,
      theme: json['theme'] ?? 'dark',
      defaultCurrency: json['defaultCurrency'] ?? 'USD',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'email': email,
      'role': role,
      'isVerified': isVerified,
      'theme': theme,
      'defaultCurrency': defaultCurrency,
    };
  }
}

