// replace the whole file with this
export function notFound(req, res, next) {
    const err = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(err);
  }
  
  export function errorHandler(err, _req, res, _next) {
    // Map common Mongoose errors to 400
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err?.code === 11000) {
      // Duplicate key (e.g., email already exists)
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(400).json({ message: `Duplicate ${field}` });
    }
  
    const status = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(status).json({
      message: err?.message || "Server error",
      // include stack only in dev
      stack: process.env.NODE_ENV === "production" ? undefined : err?.stack
    });
  }