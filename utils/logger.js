import { UserActionLog } from "../db/index.js";

export const logAction = async (
  userId,
  actionType,
  details = {},
  ip = null,
  device = null
) => {
  try {
    await UserActionLog.create({
      userId,
      actionType,
      actionDetails: details,
      ipAddress: ip,
      device,
    });
  } catch (err) {
    console.error("Failed to log action", err);
  }
};
