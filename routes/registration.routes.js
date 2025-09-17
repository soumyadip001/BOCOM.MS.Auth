import express from "express";
import * as registrationController from "../controllers/registration.controller.js";

const router = express.Router();

router.post("/start", registrationController.startRegistration);
router.post("/verify-otp", registrationController.verifyOtp);
router.post("/address", registrationController.saveAddress);
router.post("/submit", registrationController.finalizeRegistration);

export default router;
