import express from "express";
import * as kycAdminController from "../controllers/kycAdmin.controller.js";
import { requireAdmin, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// all routes require admin role
router.get("/pending", requireAdmin, kycAdminController.listPending);
router.post(
  "/approve",
  requireAdmin,
  requireRole(["admin"]),
  kycAdminController.approveDoc
);
router.post("/reject", requireAdmin, kycAdminController.rejectDoc);

export default router;
