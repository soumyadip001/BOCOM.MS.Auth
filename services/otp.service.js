import bcrypt from "bcrypt";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { OtpCode, NotificationLog } from "../db/index.js";
import { logAction } from "../utils/logger.js";

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

/**
 * Generate and send OTP
 */
export const sendOtp = async (
  { userId = null, phone, purpose = "registration" },
  ip,
  device
) => {
  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

  // Save to DB
  const record = await OtpCode.create({
    userId,
    phone,
    otpHash,
    purpose,
    expiresAt,
  });

  // Send SMS using AWS SNS
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
    return { success: false, message: "Invalid OTP" };
  }

  // Mark OTP as used
  await record.update({ used: true });

  if (userId)
    await logAction(userId, "OTP_VERIFY_SUCCESS", { purpose }, ip, device);

  return { success: true, message: "OTP verified" };
};
