import express from "express";
import {
  getDashboardStats,
  getRecentBookings,
  getTodaySchedule,
} from "../controllers/dashboard.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Main dashboard statistics
router.get("/stats", protect, getDashboardStats);

// Recent bookings
router.get("/recent-bookings", protect, getRecentBookings);

// Today's schedule
router.get("/schedule", protect, getTodaySchedule);

export default router; 