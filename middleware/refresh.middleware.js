import { errorResponse, successResponse } from "../utils/response.js";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "../services/auth.service.js";
import { User } from "../db/index.js";

export const handleRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorResponse(res, "Refresh token required", 401);

    const session = await verifyRefreshToken(refreshToken);
    if (!session)
      return errorResponse(res, "Invalid or expired refresh token", 401);

    const user = await User.findByPk(session.userId);
    if (!user) return errorResponse(res, "User not found", 404);

    const newAccessToken = generateAccessToken(user);

    return successResponse(
      res,
      { accessToken: newAccessToken },
      "Access token refreshed"
    );
  } catch (err) {
    return errorResponse(res, err.message || "Failed to refresh token", 500);
  }
};
