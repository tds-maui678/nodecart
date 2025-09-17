import mongoose from "mongoose";

const addOnSchema = new mongoose.Schema(
  { name: { type: String, required: true }, price: { type: Number, required: true, min: 0 } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    images: [{ url: String, publicId: String }],
    category: String,
    addOns: [addOnSchema]
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);