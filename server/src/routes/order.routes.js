import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createOrder, markPaid, myOrders, sellerOrders } from "../controllers/order.controller.js";

const router = Router();
router.post("/", protect, createOrder);
router.put("/:id/paid", protect, markPaid);
router.get("/mine", protect, myOrders);
router.get("/seller", protect, sellerOrders);
export default router;