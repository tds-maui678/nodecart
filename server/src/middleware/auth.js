import jwt from "jsonwebtoken";
import createError from "http-errors";

export function protect(req, _res, next) {
  const token = req.cookies?.token;
  if (!token) return next(createError(401, "Not authorized"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(createError(401, "Not authorized"));
  }
}

export function adminOnly(req, _res, next) {
  if (req.user?.role !== "admin") return next(createError(403, "Admins only"));
  next();
}