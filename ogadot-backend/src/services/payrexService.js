import axios from "axios";

const createPaymentIntent = async (amount) => {
  try {
    const amountInCents = Math.round(amount * 100);

    const response = await axios.post(
      `${process.env.PAYREX_API_URL}/payment_intents`,
      {
        amount: amountInCents,
        currency: "PHP",
        payment_methods: ["qrph", "gcash", "maya"],
        description: "Ogadot Booking Payment",
      },
      {
        auth: {
          username: process.env.SECRET_KEY,
          password: "",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(`Payrex Error: ${err.response?.data || err.message} `);
    throw new Error(`Payment generation failed`);
  }
};

export default createPaymentIntent;
