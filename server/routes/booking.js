import express from "express";
import {
  // createBooking,
  createOrder,
  getAvailableSlots,
  getBookingDetails,
  getAllBookings,
  updateBookingStatus,
  verifyPaymentAndBook,
  getReceipt,
} from "../controllers/booking.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/slots", getAvailableSlots);
// router.post("/", createBooking);
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

// Get single booking
router.get("/info/:id", protect, getBookingDetails);
router.get("/:bookingId", getBookingDetails);

router.get("/receipt/:id", getReceipt);

// Create booking
// router.post("/", protect, createBooking);

// Update booking
router.put("/:id", protect, updateBookingStatus);

// Delete booking
// router.delete("/:id", protect, authorize("admin"), deleteBooking);

export default router;
