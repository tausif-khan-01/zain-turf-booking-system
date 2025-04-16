import Booking from "../models/Booking.js";
import { TURF_DETAILS } from "../constants/turf.js";
import {
  generateTimeSlots,
  isSlotAvailable,
  formatTime,
} from "../utility/timeSlots.js";
import Razorpay from "razorpay";
import QRCode from "qrcode";
import { format } from "date-fns";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get available slots for a date
export const getAvailableSlots = async (req, res) => {
  try {
    const { date: dateQuery } = req.query;

    const date = format(new Date(dateQuery), "yyyy-MM-dd");

    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "Date is required",
      });
    }

    if (TURF_DETAILS.status === "maintenance") {
      return res.status(400).json({
        status: "error",
        message: "Turf is not available for booking",
      });
    }

    // Generate all possible slots
    const allSlots = generateTimeSlots(
      TURF_DETAILS.operatingHours.start,
      TURF_DETAILS.operatingHours.end
    );

    // Get booked slots
    const bookedSlots = await Booking.find({
      date: date,
      status: { $ne: "cancelled" },
    }).select("startTime");

    const bookedTimes = bookedSlots.map((slot) => slot.startTime);

    // Filter available slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot.start)
    );

    res.status(200).json({
      status: "success",
      data: {
        slots: availableSlots.map((slot) => ({
          start: formatTime(slot.start),
          end: formatTime(slot.end),
        })),
        pricePerHour: TURF_DETAILS.pricePerHour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { date, startTime, duration, customerName, customerMobile } =
      req.body;

    // Validate input
    if (!date || !startTime || !duration || !customerName || !customerMobile) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (TURF_DETAILS.status === "maintenance") {
      return res.status(400).json({
        status: "error",
        message: "Turf is not available for booking",
      });
    }

    // Check if slot is available
    const isAvailable = await isSlotAvailable(
      new Date(date),
      startTime,
      duration,
      Booking
    );

    if (!isAvailable) {
      return res.status(400).json({
        status: "error",
        message: "Selected slot is not available",
      });
    }

    // Calculate amounts
    const totalAmount = TURF_DETAILS.pricePerHour * duration;
    const advanceAmount = (totalAmount * TURF_DETAILS.advancePercentage) / 100;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: advanceAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    });

    // Create booking
    const booking = await Booking.create({
      date: new Date(date),
      startTime,
      duration,
      customerName,
      customerMobile,
      totalAmount,
      advanceAmount,
      razorpayOrderId: order.id,
    });

    // Generate QR code
    const qrData = JSON.stringify({
      bookingId: booking._id,
      customerName,
      date,
      startTime,
      duration,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // Update booking with QR code
    booking.qrCode = qrCode;
    await booking.save();

    res.status(201).json({
      status: "success",
      data: {
        booking,
        order,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get booking details
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get all bookings (admin/manager only)
export const getAllBookings = async (req, res) => {
  try {
    const { date, status } = req.query;
    const query = {};

    if (date) {
      query.date = new Date(date);
    }
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      status: "success",
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update booking status (admin/manager only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
