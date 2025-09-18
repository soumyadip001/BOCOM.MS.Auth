// src/services/auth.service.js
import jwt from "jsonwebtoken";
import { RefreshSession } from "../db/index.js";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = async (userId, ip, device) => {
  const refreshToken = uuidv4();
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  await RefreshSession.create({
    userId,
    refreshToken,
    ipAddress: ip,
    device,
    expiresAt,
  });

  return refreshToken;
};

export const verifyRefreshToken = async (token) => {
  const session = await RefreshSession.findOne({
    where: { refreshToken: token },
  });
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;
  return session;
};

export const revokeRefreshToken = async (token) => {
  await RefreshSession.destroy({ where: { refreshToken: token } });
};

export const revokeSession = async (refreshToken) => {
  return await RefreshSession.destroy({ where: { refreshToken } });
};

// Revoke all sessions for a user (logout all devices)
export const revokeAllSessions = async (userId) => {
  return await RefreshSession.destroy({ where: { userId } });
};

export const getActiveSessions = async (userId) => {
  return await RefreshSession.findAll({
    where: { userId },
    attributes: [
      "id",
      "ipAddress",
      "device",
      "createdAt",
      "lastUsedAt",
      "expiresAt",
    ],
    order: [["createdAt", "DESC"]],
  });
};