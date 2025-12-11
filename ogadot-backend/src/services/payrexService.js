import axios from "axios";

// const PAYREX_API_URL = "https://api.payrexhq.com";

const createPaymentIntent = async (amount) => {
  try {
    const amountInCents = Math.round(amount * 100);

    const response = await axios.post(
      `https://api.payrexhq.com/payment_intents`,
      {
        amount: amountInCents,
        currency: "PHP",
        payment_methods: ["qrph", "gcash", "maya"],
        description: "Ogadot Booking Payment",
      },
      {
        auth: {
          username: process.env.PAYREX_SECRET_KEY,
          password: "",
        },
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    // PRINT THE EXACT ERROR
    if (error.response) {
      console.error(
        "🔥 PAYREX API ERROR:",
        JSON.stringify(error.response.data, null, 2)
      );
      console.error("Status Code:", error.response.status);
    } else {
      console.error("🔥 NETWORK ERROR:", error.message);
    }
    throw new Error("Payment generation failed");
  }
};

export default createPaymentIntent;
