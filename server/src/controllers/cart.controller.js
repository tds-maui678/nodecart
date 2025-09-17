import createError from "http-errors";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/Cart.js";

const sum = (items) => items.reduce((s, i) => s + (Number(i.lineTotal) || 0), 0);

export const getMyCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [], subtotal: 0 });
  res.json(cart);
});

export const replaceCart = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;
  // optional: enforce single-restaurant policy here
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items, subtotal: sum(items) },
    { new: true, upsert: true }
  );
  res.json(cart);
});

export const addItem = asyncHandler(async (req, res) => {
  const { item } = req.body; // full line item
  if (!item?.product || !item?.restaurant) throw createError(400, "Invalid item");
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [], subtotal: 0 });

  // one restaurant per cart
  if (cart.items.length && String(cart.items[0].restaurant) !== String(item.restaurant)) {
    cart.items = []; // or throw error; we clear to match client behavior
  }

  // merge by product+addons signature
  const key = JSON.stringify({ p: item.product, a: item.addOns || [] });
  const idx = cart.items.findIndex(i => JSON.stringify({ p: i.product, a: i.addOns || [] }) === key);
  if (idx >= 0) {
    cart.items[idx].qty += item.qty || 1;
    const base = Number(cart.items[idx].price || 0) + (cart.items[idx].addOns || []).reduce((s,a)=>s+Number(a.price||0),0);
    cart.items[idx].lineTotal = base * cart.items[idx].qty;
  } else {
    cart.items.push(item);
  }
  cart.subtotal = sum(cart.items);
  await cart.save();
  res.json(cart);
});

export const updateQty = asyncHandler(async (req, res) => {
  const { index, qty } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw createError(404, "Cart not found");
  if (index < 0 || index >= cart.items.length) throw createError(400, "Bad index");
  cart.items[index].qty = Math.max(1, Number(qty || 1));
  const base = Number(cart.items[index].price || 0) + (cart.items[index].addOns || []).reduce((s,a)=>s+Number(a.price||0),0);
  cart.items[index].lineTotal = base * cart.items[index].qty;
  cart.subtotal = sum(cart.items);
  await cart.save();
  res.json(cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const { index } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw createError(404, "Cart not found");
  cart.items.splice(index, 1);
  cart.subtotal = sum(cart.items);
  await cart.save();
  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], subtotal: 0 },
    { new: true, upsert: true }
  );
  res.json(cart);
});