import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/booking.dart';

class ApiService {
  // ⚠️ CHANGE THIS to your PC's IP if using a real phone (e.g. http://192.168.1.5:3000)
  // If using Android Emulator, keep 10.0.2.2
  static const String baseUrl = 'http://10.0.2.2:5050/bookings';

  // 1. Fetch all bookings
  static Future<List<Booking>> getBookings() async {
    try {
      final response = await http.get(Uri.parse(baseUrl));
      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((dynamic item) => Booking.fromJson(item)).toList();
      } else {
        throw Exception('Failed to load bookings');
      }
    } catch (e) {
      throw Exception('Error fetching data: $e');
    }
  }

  // 2. Generate Payment URL (for QRPH)
  static Future<String?> payBooking(String id) async {
    try {
      final response = await http.post(Uri.parse('$baseUrl/$id/pay'));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['checkoutUrl']; // Returns the PayRex URL
      } else {
        print('Payment Error: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Connection Error: $e');
      return null;
    }
  }
}
