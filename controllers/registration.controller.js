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

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    // TODO: validate OTP with OTP service
    const success = otp === "123456"; // placeholder
    const verified = await registrationService.verifyOtp(
      userId,
      success,
      req.ip,
      req.headers["user-agent"]
    );
    if (!verified) return errorResponse(res, "Invalid OTP", 400);
    return successResponse(res, {}, "OTP verified");
  } catch (err) {
    return errorResponse(res, "OTP verification failed");
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