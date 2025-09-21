import express from "express";
import { ENV, NODE_ENV } from "../config/index.js";
import authRoutesV1 from "../routes/auth.routes.js";
import kycRoutesV1 from "../routes/kyc.routes.js";
import registrationRoutesV1 from "../routes/registration.routes.js";
import otpRoutesV1 from "../routes/otp.routes.js";
import kycAdminRoutesV1 from "../routes/kycAdmin.routes.js";

const router = express.Router();

router.get("/", (req, res) =>
  res.status(200).json({
    message: "Welcome to BOCOM Auth Service",
    version: "1.0.0",
    environment: ENV,
    nodeEnvironment: NODE_ENV,
  })
);

router.get("/health", (req, res) =>
  res.status(200).json({
    status: "OK",
  })
);

router.use("/v1/auth", authRoutesV1);
router.use("/v1/kyc", kycRoutesV1);
router.use("/v1/registration", registrationRoutesV1);
router.use("/v1/otp", otpRoutesV1);
router.use("/v1/admin/kyc", kycAdminRoutesV1);

export default router;
