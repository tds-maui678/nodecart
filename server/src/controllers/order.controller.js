import { Order } from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v4 as uuidv4 } from "uuid";
import createError from "http-errors";

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, subtotal, total, stripePaymentIntentId, restaurant } = req.body;
  if (!items?.length) throw createError(400, "Items required");
  if (!restaurant) throw createError(400, "restaurant id required");
  const order = await Order.create({
    user: req.user.id,
    restaurant,
    items,
    shippingAddress,
    subtotal,
    total,
    stripePaymentIntentId,
    paymentStatus: "pending"
  });
  res.status(201).json(order);
});

export const markPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  order.paymentStatus = "paid";
  order.receipt = { number: uuidv4().slice(-8).toUpperCase(), issuedAt: new Date() };
  await order.save();
  res.json(order);
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const sellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ paymentStatus: "paid" })
    .populate("restaurant", "owner")
    .sort({ createdAt: -1 });

  const mine = orders.filter((o) => String(o.restaurant.owner) === req.user.id);
  res.json(mine);
});