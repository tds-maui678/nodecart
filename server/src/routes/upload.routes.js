import { Router } from "express";
import { getUploadSignature } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.js"; // only signed-in sellers/customers can get a signature

const router = Router();
router.get("/sign", protect, getUploadSignature);
export default router;