import { v2 as cloudinary } from "cloudinary";
import crypto from "node:crypto";
import { asyncHandler } from "../utils/asyncHandler.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Client asks for a signature; then uploads directly to Cloudinary.
export const getUploadSignature = asyncHandler(async (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = (req.query.folder || "nodecart").toString();
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign)
    .digest("hex");

  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
});