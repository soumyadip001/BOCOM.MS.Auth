import { successResponse, errorResponse } from "../utils/response.js";
import {
  revokeSession,
  revokeAllSessions,
  getActiveSessions,
} from "../services/auth.service.js";

/**
 * Logout current device (invalidate one refresh token)
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorResponse(res, "Refresh token required", 400);

    await revokeSession(refreshToken);
    return successResponse(res, {}, "Logged out from current device");
  } catch (err) {
    return errorResponse(res, err.message || "Logout failed", 500);
  }
};

/**
 * Logout from all devices
 */
export const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id; // from requireAuth middleware
    await revokeAllSessions(userId);
    return successResponse(res, {}, "Logged out from all devices");
  } catch (err) {
    return errorResponse(res, err.message || "Logout all failed", 500);
  }
};

export const listSessions = async (req, res) => {
  try {
    const userId = req.user.id; // from requireAuth middleware
    const sessions = await getActiveSessions(userId);
    return successResponse(res, sessions, "Active sessions fetched");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch sessions", 500);
  }
};
