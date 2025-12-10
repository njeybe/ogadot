import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import bookingController from "./controller/bookingController.js";

dotenv.config();
connectDB();
const port = process.env.port;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/bookings", bookingController);

app.get("/", (req, res) => {
  res.send("Ogadot backend is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
