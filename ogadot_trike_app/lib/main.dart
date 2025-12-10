import 'package:flutter/material.dart';
import 'package:ogadot_trike_app/screens/driver_dashboard.dart';

void main() {
  runApp(const OgadotApp());
}

class OgadotApp extends StatelessWidget {
  const OgadotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Ogadot Trike App',
      theme: ThemeData(primarySwatch: Colors.amber, useMaterial3: true),
      home: const DriverDashboard(),
    );
  }
}
