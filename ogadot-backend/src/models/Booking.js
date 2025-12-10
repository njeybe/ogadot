import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    passengerName: { type: String, requried: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    fareAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    paymentMethod: { type: String, default: "Cash" },
    payrexPaymentId: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
