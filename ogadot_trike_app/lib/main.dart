import 'package:flutter/material.dart';

void main() {
  runApp(const OgadotApp());
}

class OgadotApp extends StatelessWidget {
  const OgadotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text("Ogadot Trike App")),
        body: const Center(
          child: Text('Rider Status: OFFLINE', style: TextStyle(fontSize: 23)),
        ),
      ),
    );
  }
}
