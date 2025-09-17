import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import createError from "http-errors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in cents (integer)
  if (!Number.isInteger(amount) || amount <= 0) {
    throw createError(400, "Amount (cents) is required");
  }
  const pi = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });
  res.json({ clientSecret: pi.client_secret });
});