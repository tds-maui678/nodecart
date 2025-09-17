import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getMyCart, replaceCart, addItem, updateQty, removeItem, clearCart } from "../controllers/cart.controller.js";

const router = Router();
router.use(protect);

router.get("/", getMyCart);
router.put("/", replaceCart);        
router.post("/add", addItem);
router.patch("/qty", updateQty);
router.patch("/remove", removeItem);
router.delete("/", clearCart);

export default router;