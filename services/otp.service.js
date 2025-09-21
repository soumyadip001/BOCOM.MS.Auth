import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { OtpCode, NotificationLog } from "../db/index.js";
import { logAction } from "../utils/logger.js";
import {
  AWS_REGION,
  MAX_OTPS_PER_DAY,
  MAX_FAILED_ATTEMPTS,
  MAX_VERIFY_ATTEMPTS,
} from "../config/index.js";

const snsClient = new SNSClient({ region: AWS_REGION });

/**
 * Generate and send OTP
 */
export const sendOtp = async (
  { userId = null, phone, purpose = "registration" },
  ip,
  device
) => {
  /****
   * Rate Limiting
   * Check daily OTP request count
   * MAX_OTPS_PER_DAY is configured in env
   */
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const otpCountToday = await OtpCode.count({
    where: {
      phone,
      purpose,
      createdAt: { [Op.gte]: todayStart },
    },
  });

  if (otpCountToday >= MAX_OTPS_PER_DAY) {
    throw new Error(
      "Daily OTP request limit reached. Please try again tomorrow."
    );
  }

  /****
   * Rate Limiting
   * Check failed attempts today
   * MAX_FAILED_ATTEMPTS is configured in env
   */
  const failedAttemptsToday = await NotificationLog.count({
    where: {
      phone,
      channel: "sms",
      status: "failed",
      createdAt: { [Op.gte]: todayStart },
    },
  });

  if (failedAttemptsToday >= MAX_FAILED_ATTEMPTS) {
    throw new Error(
      "Too many failed attempts today. Please try again tomorrow."
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

  const record = await OtpCode.create({
    userId,
    phone,
    otpHash,
    purpose,
    expiresAt,
  });

  const params = {
    Message: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    PhoneNumber: phone,
  };

  let snsMessageId = null;
  try {
    const response = await snsClient.send(new PublishCommand(params));
    snsMessageId = response.MessageId;

    // Log Notification
    await NotificationLog.create({
      userId,
      channel: "sms",
      message: params.Message,
      status: "sent",
      snsMessageId,
      createdAt: new Date(),
    });

    // Log user action
    if (userId) {
      await logAction(userId, "OTP_SENT", { purpose }, ip, device);
    }
  } catch (err) {
    await NotificationLog.create({
      userId,
      channel: "sms",
      message: params.Message,
      status: "failed",
      errorMessage: err.message,
      createdAt: new Date(),
    });
    throw new Error("Failed to send OTP");
  }

  return { otpId: record.id, expiresIn: 300 }; // don’t return OTP itself
};

/**
 * Verify OTP
 */
export const verifyOtp = async (
  { userId = null, phone, otp, purpose },
  ip,
  device
) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  /******
   * Rate Limiting
   * Check if phone already exceeded daily attempts
   */
  const failedAttemptsToday = await NotificationLog.count({
    where: {
      phone,
      channel: "sms",
      status: "otp_failed",
      createdAt: { [Op.gte]: todayStart },
    },
  });

  if (failedAttemptsToday >= MAX_VERIFY_ATTEMPTS) {
    if (userId)
      await logAction(
        userId,
        "OTP_VERIFY_BLOCKED",
        { reason: "too_many_attempts" },
        ip,
        device
      );
    return {
      success: false,
      message: "Too many failed OTP attempts today. Try again tomorrow.",
    };
  }

  const record = await OtpCode.findOne({
    where: { phone, purpose, used: false },
    order: [["createdAt", "DESC"]],
  });

  if (!record) {
    if (userId)
      await logAction(
        userId,
        "OTP_VERIFY_FAIL",
        { reason: "not_found" },
        ip,
        device
      );
    return { success: false, message: "OTP not found" };
  }

  if (record.expiresAt < new Date()) {
    if (userId)
      await logAction(
        userId,
        "OTP_VERIFY_FAIL",
        { reason: "expired" },
        ip,
        device
      );
    return { success: false, message: "OTP expired" };
  }

  const valid = await bcrypt.compare(otp, record.otpHash);
  if (!valid) {
    if (userId)
      await logAction(
        userId,
        "OTP_VERIFY_FAIL",
        { reason: "mismatch" },
        ip,
        device
      );

    await NotificationLog.create({
      userId,
      phone,
      channel: "sms",
      status: "otp_failed",
      message: "Invalid OTP",
      createdAt: new Date(),
    });

    // Invalidate OTP after 3 wrong attempts
    const attempts = failedAttemptsToday + 1;
    if (attempts >= 3) {
      await record.update({ used: true });
    }

    return { success: false, message: "Invalid OTP" };
  }

  // Mark OTP as used
  await record.update({ used: true });

  if (userId)
    await logAction(userId, "OTP_VERIFY_SUCCESS", { purpose }, ip, device);

  return { success: true, message: "OTP verified" };
};
