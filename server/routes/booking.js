import express from "express";
import {
  // createBooking,
  createOrder,
  getAvailableSlots,
  getBookingDetails,
  getAllBookings,
  updateBookingStatus,
  verifyPaymentAndBook,
} from "../controllers/booking.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/slots", getAvailableSlots);
// router.post("/", createBooking);
router.get("/:bookingId", getBookingDetails);
router.post("/create-order", createOrder);
router.post("/verify-payment-and-book", verifyPaymentAndBook);

// Protected routes
router.get("/", protect, authorize("admin", "manager"), getAllBookings);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "manager"),
  updateBookingStatus
);

export default router;
