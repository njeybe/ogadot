class Booking {
  final String id;
  final String passengerName;
  final String pickupLocation;
  final String dropoffLocation;
  final double fareAmount;
  final String status;

  Booking({
    required this.id,
    required this.passengerName,
    required this.pickupLocation,
    required this.dropoffLocation,
    required this.fareAmount,
    required this.status,
  });

  // Factory to convert JSON from server into a Booking object
  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['_id'],
      passengerName: json['passengerName'],
      pickupLocation: json['pickupLocation'],
      dropoffLocation: json['dropoffLocation'],
      fareAmount: (json['fareAmount'] as num).toDouble(),
      status: json['status'],
    );
  }
}