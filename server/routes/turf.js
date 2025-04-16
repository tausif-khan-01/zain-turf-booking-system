import express from "express";
import {
  getTurf,
  updateTurf,
  updateTurfStatus,
} from "../controllers/turf.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public route
router.get("/", getTurf);

// Protected routes
router.patch("/", protect, authorize("admin"), updateTurf);
router.patch("/status", protect, authorize("admin"), updateTurfStatus);

export default router; 