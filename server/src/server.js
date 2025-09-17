import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

/* ---------- CORS for localhost:5173 ---------- */
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,                      // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// handle preflights explicitly (helps Safari)
app.options("*", cors({ origin: CLIENT_ORIGIN, credentials: true }));

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stripe", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));