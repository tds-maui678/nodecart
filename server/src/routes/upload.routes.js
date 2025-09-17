import { Router } from "express";
import { getUploadSignature } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.js"; 

const router = Router();
router.get("/sign", protect, getUploadSignature);
export default router;