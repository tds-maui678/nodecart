import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    address: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    },
    image: String
  },
  { timestamps: true }
);

restaurantSchema.index({ location: "2dsphere" });
export const Restaurant = mongoose.model("Restaurant", restaurantSchema);