import { Router } from "express";
import { body } from "express-validator";
import { register, login, logout, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const passwordRule = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;
const phoneRule = /^\+?[0-9]{7,15}$/;

const router = Router();
router.post(
  "/register",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("phone").matches(phoneRule).withMessage("Enter a valid phone number"),
    body("password").matches(passwordRule).withMessage("Password must be 8+ chars incl. a special"),
    body("role").optional().isIn(["customer", "seller"])
  ],
  register
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], login);
router.get("/me", protect, me);
router.post("/logout", logout);
export default router;