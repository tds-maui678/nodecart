import { Restaurant } from "../models/Restaurant.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import createError from "http-errors";

export const createRestaurant = asyncHandler(async (req, res) => {
  if (req.user.role !== "seller") throw createError(403, "Only sellers can create restaurants");
  const { name, description, address, lat, lng, image } = req.body;
  const r = await Restaurant.create({
    owner: req.user.id,
    name, description, address, image,
    location: { type: "Point", coordinates: [Number(lng) || 0, Number(lat) || 0] }
  });
  res.status(201).json(r);
});

export const myRestaurant = asyncHandler(async (req, res) => {
  const r = await Restaurant.findOne({ owner: req.user.id });
  res.json(r || null);
});

export const nearRestaurants = asyncHandler(async (req, res) => {
  const { lat = 0, lng = 0, radius = 8000 } = req.query;
  const docs = await Restaurant.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius)
      }
    }
  }).limit(50);
  res.json(docs);
});