import express from "express";
import * as kycController from "../controllers/kyc.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/presign", kycController.getPresignedUrl);
router.post("/confirm", kycController.confirmUpload);
router.post("/resubmit", kycController.resubmitDoc);
router.get("/status", requireAuth, kycController.getMyKycStatus);

export default router;
