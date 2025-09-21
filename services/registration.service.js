import bcrypt from "bcrypt";
import { User } from "../db/index.js";
import { logAction } from "../utils/logger.js";
import * as otpService from "./otp.service.js";

export const startRegistration = async (
  { email, phone, password, firstName, lastName, referralCode },
  ip,
  device
) => {
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    phone,
    firstName,
    lastName,
    passwordHash: hash,
    status: "incomplete",
    registrationStep: 1,
    roleId: 2, // assume 2 = Individual
  });

  await logAction(user.id, "REG_START", { referralCode }, ip, device);
  return user;
};

export const sendOtpForRegistration = async (userId, phone, ip, device) => {
  const result = await otpService.sendOtp(
    { userId, phone, purpose: "registration" },
    ip,
    device
  );
  await logAction(userId, "REG_OTP_SENT", { phone }, ip, device);
  return result;
};

export const verifyRegistrationOtp = async (userId, phone, otp, ip, device) => {
  const result = await otpService.verifyOtp(
    { userId, phone, otp, purpose: "registration" },
    ip,
    device
  );

  if (result.success) {
    await User.update({ registrationStep: 2 }, { where: { id: userId } });
    await logAction(userId, "REG_OTP_VERIFIED", { phone }, ip, device);
  }

  return result;
};

export const saveAddress = async (userId, address, ip, device) => {
  await User.update(
    {
      ...address,
      registrationStep: 4,
    },
    { where: { id: userId } }
  );

  await logAction(userId, "REG_ADDRESS", address, ip, device);
};

export const finalizeRegistration = async (userId, ip, device) => {
  await User.update(
    { status: "pending", registrationStep: 5 },
    { where: { id: userId } }
  );
  await logAction(userId, "REG_SUBMIT", {}, ip, device);
};
