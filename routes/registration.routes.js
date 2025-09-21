import express from "express";
import * as registrationController from "../controllers/registration.controller.js";
import { validateData } from "../middleware/validation.middleware.js";
import {
  startRegistrationSchema,
  sendOtpSchema,
  verifyOtpSchema,
  addressSchema,
  finalizeSchema,
} from "../schemas/registration.schema.js";

const router = express.Router();

router.post(
  "/start",
  validateData(startRegistrationSchema),
  registrationController.startRegistration
);
router.post(
  "/send-otp",
  validateData(sendOtpSchema),
  registrationController.sendOtp
);
router.post(
  "/verify-otp",
  validateData(verifyOtpSchema),
  registrationController.verifyOtp
);
router.post(
  "/address",
  validateData(addressSchema),
  registrationController.saveAddress
);
router.post(
  "/submit",
  validateData(finalizeSchema),
  registrationController.finalizeRegistration
);

export default router;
