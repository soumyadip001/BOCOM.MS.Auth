import express from "express";
import { handleRefreshToken } from "../middleware/refresh.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { logout, logoutAll, listSessions } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/refresh", handleRefreshToken);
router.post("/logout", logout); // logout current device
router.post("/logout-all", requireAuth, logoutAll); // logout all
router.get("/sessions", requireAuth, listSessions);

export default router;
