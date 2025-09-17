import { successResponse, errorResponse } from '../utils/response.js';
import * as otpService from '../services/otp.service.js';

export const sendOtp = async (req, res) => {
  try {
    const { userId, phone, purpose } = req.body;
    const result = await otpService.sendOtp({ userId, phone, purpose }, req.ip, req.headers['user-agent']);
    return successResponse(res, result, 'OTP sent successfully');
  } catch (err) {
    return errorResponse(res, err.message || 'Failed to send OTP', 500);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, phone, otp, purpose } = req.body;
    const result = await otpService.verifyOtp({ userId, phone, otp, purpose }, req.ip, req.headers['user-agent']);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, {}, 'OTP verified successfully');
  } catch (err) {
    return errorResponse(res, err.message || 'OTP verification failed', 500);
  }
};