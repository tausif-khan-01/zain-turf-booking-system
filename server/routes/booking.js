import express from "express";
import {
  createBooking,
  getAvailableSlots,
  getBookingDetails,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/booking.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/slots", getAvailableSlots);
router.post("/", createBooking);
router.get("/:id", getBookingDetails);

// Protected routes
router.get("/", protect, authorize("admin", "manager"), getAllBookings);
router.patch("/:id/status", protect, authorize("admin", "manager"), updateBookingStatus);

export default router; 