import { Product } from "../models/Product.js";
import { Restaurant } from "../models/Restaurant.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import createError from "http-errors";


export const updateProduct = asyncHandler(async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) throw createError(404, "Product not found");

  // seller must own the restaurant the product belongs to
  const rest = await Restaurant.findById(prod.restaurant);
  if (!rest) throw createError(404, "Restaurant missing");
  if (String(rest.owner) !== String(req.user.id) && req.user.role !== "admin") {
    throw createError(403, "Not allowed");
  }

  const fields = ["title","description","price","category","images","addOns"];
  fields.forEach(f => {
    if (f in req.body) prod[f] = req.body[f];
  });

  await prod.save();
  res.json(prod);
});
export const listProducts = asyncHandler(async (req, res) => {
  const { q, restaurantId, page = 1, limit = 12 } = req.query;
  const f = {};
  if (q) f.title = { $regex: q, $options: "i" };
  if (restaurantId) f.restaurant = restaurantId;
  const [items, total] = await Promise.all([
    Product.find(f).skip((page - 1) * limit).limit(+limit).sort({ createdAt: -1 }),
    Product.countDocuments(f)
  ]);
  res.json({ items, total });
});

export const getProduct = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  if (req.user.role !== "seller" && req.user.role !== "admin") throw createError(403, "Not allowed");

  let restaurantId = body.restaurant;
  if (req.user.role === "seller") {
    const r = await Restaurant.findOne({ owner: req.user.id });
    if (!r) throw createError(400, "Create a restaurant first");
    restaurantId = r._id;
  }

  const created = await Product.create({
    title: body.title,
    description: body.description,
    price: body.price,
    images: body.images || [],
    category: body.category || "",
    addOns: body.addOns || [],
    seller: req.user.id,
    restaurant: restaurantId
  });
  res.status(201).json(created);
});

export const myMenu = asyncHandler(async (req, res) => {
  const items = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});