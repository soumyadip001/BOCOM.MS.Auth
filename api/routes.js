import express from "express";
import { ENV, NODE_ENV } from "../config/index.js";

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

export default router;
