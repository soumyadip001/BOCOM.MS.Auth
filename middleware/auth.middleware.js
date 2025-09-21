import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // use AWS Secrets Manager in prod

/**
 * Require Authenticated User
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Authorization token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return errorResponse(res, "Invalid or expired token", 401);
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return errorResponse(res, "Unauthorized", 401, { error: err.message });
  }
};

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, "Forbidden: insufficient privileges", 403);
    }
    next();
  };
};

export const requireAdmin = () => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, "Forbidden: not allowed", 403);
    }
    next();
  }
}