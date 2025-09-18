import { successResponse, errorResponse } from "../utils/response.js";
import * as registrationService from "../services/registration.service.js";

export const startRegistration = async (req, res) => {
  try {
    const user = await registrationService.startRegistration(
      req.body,
      req.ip,
      req.headers["user-agent"]
    );
    return successResponse(res, { userId: user.id }, "Registration started");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to start registration");
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { userId, phone } = req.body;
    const result = await registrationService.sendOtpForRegistration(
      userId,
      phone,
      req.ip,
      req.headers["user-agent"]
    );
    return successResponse(res, result, "OTP sent for registration");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to send OTP");
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, phone, otp } = req.body;
    const result = await registrationService.verifyRegistrationOtp(
      userId,
      phone,
      otp,
      req.ip,
      req.headers["user-agent"]
    );
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, {}, "Phone verified successfully");
  } catch (err) {
    return errorResponse(res, err.message || "OTP verification failed");
  }
};

export const saveAddress = async (req, res) => {
  try {
    const { userId, ...address } = req.body;
    await registrationService.saveAddress(
      userId,
      address,
      req.ip,
      req.headers["user-agent"]
    );
    return successResponse(res, {}, "Address saved");
  } catch (err) {
    return errorResponse(res, "Failed to save address");
  }
};

export const finalizeRegistration = async (req, res) => {
  try {
    const { userId } = req.body;
    await registrationService.finalizeRegistration(
      userId,
      req.ip,
      req.headers["user-agent"]
    );
    return successResponse(
      res,
      {},
      "Registration submitted. Verification pending"
    );
  } catch (err) {
    return errorResponse(res, "Finalization failed");
  }
};
