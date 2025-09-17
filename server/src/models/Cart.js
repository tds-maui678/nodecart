import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    title: String,
    price: Number,
    image: String,
    qty: { type: Number, default: 1 },
    addOns: [{ name: String, price: Number }],
    lineTotal: Number,
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, index: true },
    items: [lineSchema],
    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);