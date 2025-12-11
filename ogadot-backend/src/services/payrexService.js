import axios from "axios";

const PAYREX_URL = "https://api.payrexhq.com/checkout_sessions";
const MIN_AMOUNT_CENTS = 2000; // Payrex requires amount >= 2000 cents

const createPaymentIntent = async (amount) => {
  const secret = process.env.PAYREX_SECRET_KEY;
  if (!secret || secret === "sk_test_or_live_actual_secret") {
    throw new Error("PAYREX_SECRET_KEY is not set or is a placeholder");
  }
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) {
    throw new Error("Invalid fare amount");
  }

  const amountInCents = Math.round(numericAmount * 100);
  console.log(`Creating checkout link for ${amountInCents} cents`);

  if (amountInCents < MIN_AMOUNT_CENTS) {
    throw new Error(
      `Amount must be at least ${MIN_AMOUNT_CENTS} cents (PHP ${(
        MIN_AMOUNT_CENTS / 100
      ).toFixed(2)})`
    );
  }

  const idempotencyKey = `checkout-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;

  try {
    const response = await axios.post(
      PAYREX_URL,
      {
        mode: "payment",
        currency: "PHP",
        payment_method_types: ["qrph", "gcash", "maya"],
        success_url: "https://google.com",
        cancel_url: "https://google.com",
        line_items: [
          {
            name: "Ogadot Ride",
            quantity: 1,
            amount: amountInCents,
            currency: "PHP",
          },
        ],
      },
      {
        auth: { username: secret, password: "" },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        timeout: 15000,
      }
    );

    if (!response.data?.url) throw new Error("Payrex response missing url");
    console.log("Checkout URL:", response.data.url);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;
    const errorBody =
      typeof data === "string" ? data : data ? JSON.stringify(data) : "no body";
    console.error("Payrex request failed", {
      status,
      statusText,
      data: errorBody,
      idempotencyKey,
    });
    const isAuthError = status === 401 || data?.code === "auth_invalid";
    const message = isAuthError
      ? "Payrex API key is invalid or not authorized"
      : (data && (data.message || data.error)) ||
        error.message ||
        "Payment generation failed";

    const wrapped = new Error(
      `Payrex error (${status || "unknown"}): ${message}`
    );
    wrapped.idempotencyKey = idempotencyKey;
    throw wrapped;
  }
};

export default createPaymentIntent;
