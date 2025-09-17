import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import createError from "http-errors";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (u) =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

const sendAuth = (res, user, status = 200) => {
  const token = signToken(user);
  const isProd = process.env.NODE_ENV === "production";
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax", // 'lax' is best for http://localhost
      secure: isProd,                    // must be false on localhost (http)
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(status)
    .json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
};

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw createError(400, errors.array()[0].msg);

  const { name, email, phone, password, role } = req.body;
  if (await User.findOne({ email })) throw createError(400, "Email already in use");

  const safeRole = ["customer", "seller"].includes(role) ? role : "customer";
  const user = await User.create({ name, email, phone, password, role: safeRole });
  sendAuth(res, user, 201); // sets cookie + returns user
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) throw createError(401, "Invalid credentials");
  sendAuth(res, user, 200);
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    user,
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", { path: "/" }).json({ message: "Logged out" });
});