import bcrypt from "bcrypt";
import { User } from "../db/index.js";
import { logAction } from "../utils/logger.js";

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

export const verifyOtp = async (userId, success, ip, device) => {
  if (!success) {
    await logAction(userId, "REG_OTP_FAILED", {}, ip, device);
    return false;
  }

  await User.update({ registrationStep: 2 }, { where: { id: userId } });
  await logAction(userId, "REG_OTP_SUCCESS", {}, ip, device);
  return true;
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
