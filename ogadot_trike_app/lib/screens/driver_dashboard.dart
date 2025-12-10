import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart'; // To open the QR link
import '../models/booking.dart';
import '../services/api_service.dart';

class DriverDashboard extends StatefulWidget {
  const DriverDashboard({super.key});

  @override
  State<DriverDashboard> createState() => _DriverDashboardState();
}

class _DriverDashboardState extends State<DriverDashboard> {
  List<Booking> bookings = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  // Fetch data from backend
  Future<void> _loadBookings() async {
    try {
      final data = await ApiService.getBookings();
      setState(() {
        bookings = data;
        isLoading = false;
      });
    } catch (e) {
      print(e);
      setState(() => isLoading = false);
    }
  }

  // Handle "Generate QR" button tap
  Future<void> _handlePayment(String id) async {
    // Show loading indicator...
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Generating QR Code...')),
    );

    final url = await ApiService.payBooking(id);

    if (url != null) {
      // Open the PayRex link in the browser
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        print('Could not launch $url');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to generate payment link')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ogadot Driver'),
        backgroundColor: Colors.amber, // Tricycle color!
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() => isLoading = true);
              _loadBookings();
            },
          )
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: bookings.length,
              itemBuilder: (context, index) {
                final booking = bookings[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  child: ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Colors.amber,
                      child: Icon(Icons.person, color: Colors.black),
                    ),
                    title: Text(booking.passengerName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("From: ${booking.pickupLocation}"),
                        Text("To: ${booking.dropoffLocation}"),
                        Text("Fare: ₱${booking.fareAmount}", style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                      ],
                    ),
                    trailing: ElevatedButton(
                      onPressed: () => _handlePayment(booking.id),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                      child: const Text("PAY", style: TextStyle(color: Colors.white)),
                    ),
                  ),
                );
              },
            ),
    );
  }
}