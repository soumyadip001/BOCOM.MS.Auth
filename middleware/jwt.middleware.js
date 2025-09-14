import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

export default function validateJWTToken(req, res, next) {
  if (
    req.headers?.authorization &&
    req.headers?.authorization?.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: "HS256",
      });
      // console.log("jwt decoded::", decoded);
      const { _id, email, firstname, lastname, gender, isActive } = decoded;
      req.user = { _id, email, firstname, lastname, gender, isActive };
      return next();
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token",
        error,
      });
    }
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
    success: false,
    message: "Invalid Token",
    error: "Invalid token",
  });
}
