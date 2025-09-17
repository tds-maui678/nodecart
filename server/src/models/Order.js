import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    title: String,
    qty: Number,
    price: Number,       // base price (unit)
    image: String,
    addOns: [{ name: String, price: Number }],
    lineTotal: Number    // (price + sum(addOns)) * qty
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String, address: String, city: String, state: String, postalCode: String, country: String
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    stripePaymentIntentId: String,
    subtotal: Number,
    total: Number,
    receipt: { number: String, issuedAt: Date }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);