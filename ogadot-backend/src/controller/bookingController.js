import express from "express";
import { Booking } from "../models/Booking.js";
import createPaymentIntent from "../services/payrexService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newBookings = await Booking.create(req.body);
    res.status(201).json(newBookings);
  } catch (err) {
    res.status(500).json({ message: "Invalid data" });
  }
});

router.post("/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (!Number.isFinite(booking.fareAmount)) {
      return res.status(400).json({ message: "Booking has no valid fare" });
    }

    const paymentData = await createPaymentIntent(booking.fareAmount);

    booking.payrexPaymentId = paymentData.id;
    await booking.save();

    res.json({ checkoutUrl: paymentData.url });
  } catch (err) {
    console.error("Payment error:", err.message);
    if (err.idempotencyKey) {
      console.error("Payrex idempotencyKey:", err.idempotencyKey);
    }
    res.status(502).json({
      message: err.message || "Payment error",
      idempotencyKey: err.idempotencyKey,
    });
  }
});

export default router;
