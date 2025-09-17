import { Router } from "express";
import { protect } from "../middleware/auth.js";


import {
  listProducts,
  getProduct,
  createProduct,
  myMenu,
  updateProduct,   
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", listProducts);
router.get("/my/menu", protect, myMenu);
router.get("/:id", getProduct);

router.post("/", protect /*, isSeller*/, createProduct);
router.put("/:id", protect /*, isSeller*/, updateProduct);

export default router;