import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bookingController from "./controller/bookingController.js";

dotenv.config();
connectDB();
const port = process.env.PORT || process.env.port || 5050;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/bookings", bookingController);

app.get("/", (req, res) => {
  res.send("Ogadot backend is running");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`  -Local: http://localhost:${port}/bookings`);
  console.log(`  -Network: http://0.0.0.0/${port}/bookings`);
});
