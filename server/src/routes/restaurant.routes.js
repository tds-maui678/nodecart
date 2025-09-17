import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createRestaurant, myRestaurant, nearRestaurants } from "../controllers/restaurant.controller.js";

const router = Router();
router.post("/", protect, createRestaurant);
router.get("/mine", protect, myRestaurant);
router.get("/near", nearRestaurants);
export default router;