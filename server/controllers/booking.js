import crypto from "crypto";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import Razorpay from "razorpay";
import config from "../constants/config.js";
import Booking from "../models/Booking.js";
import { calculateBookingAmount } from "../utility/booking-calc.js";
import { newBookingId } from "../utility/newBookingId.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.razorpay.key,
  key_secret: config.razorpay.secret,
});

// Get available slots for a date
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "Date is required",
      });
    }

    // Get booked slots
    const bookedSlots = await Booking.find({
      date: date,
    }).select("startTime duration");

    res.status(200).json({
      status: "success",
      bookedSlots,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// create order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        status: "error",
        message: "Amount is required",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_receipt",
    });

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// verify payment
export const verifyPaymentAndBook = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.secret)
      .update(body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(razorpay_signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Payment failed",
      });
    }

    const amountDetails = calculateBookingAmount(booking.duration);

    // create booking with Razorpay fee details
    const date = format(new Date(booking.date), "yyyy-MM-dd");

    const bookingId = await newBookingId();

    const bookingData = {
      date,
      startTime: booking.startTime,
      duration: booking.duration,
      customer: booking.customer,
      bookingId,
      amount: {
        totalAmount: amountDetails.totalAmount,
        advanceAmount: amountDetails.advanceAmount,
        remainingAmount: amountDetails.remainingAmount,
        transactions: [
          {
            amount: amountDetails.advanceAmount,
            amountType: "advance",
            paymentMethod: "razorpay",
          },
        ],
      },
      razorpay: {
        isCustomerPayRazorpayFees: amountDetails.isCustomerPayRazorpayFees,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    };

    console.log(bookingData);

    const newBooking = await Booking.create(bookingData);

    res.status(200).json({
      status: "success",
      message: "Payment verified and booking created",
      bookingId: newBooking.bookingId,
    });
  } catch (error) {
    console.log("error: ", error.message);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// get booking details
export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    res.status(200).json({
      status: "success",
      booking,
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
    const {
      page = 1,
      limit = 10,
      search,
      status,
      dateFilter,
      startDate,
      endDate,
      date,
    } = req.query;

    // Build query
    const query = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Date filter
    if (date) {
      // Single date filter
      const selectedDate = new Date(date);
      query.date = {
        $gte: startOfDay(selectedDate),
        $lte: endOfDay(selectedDate),
      };
    } else if (dateFilter) {
      // Date range filter
      const today = new Date();
      switch (dateFilter) {
        case "today":
          query.date = {
            $gte: startOfDay(today),
            $lte: endOfDay(today),
          };
          break;
        case "tomorrow":
          const tomorrow = addDays(today, 1);
          query.date = {
            $gte: startOfDay(tomorrow),
            $lte: endOfDay(tomorrow),
          };
          break;
        case "thisWeek":
          query.date = {
            $gte: startOfWeek(today),
            $lte: endOfWeek(today),
          };
          break;
        case "custom":
          if (startDate && endDate) {
            query.date = {
              $gte: startOfDay(new Date(startDate)),
              $lte: endOfDay(new Date(endDate)),
            };
          }
          break;
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { bookingId: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    // Get paginated results
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Transform the data to match the requested format
    const formattedBookings = bookings.map((booking) => ({
      bookingId: booking.bookingId,
      name: booking.customer.name,
      contact: booking.customer.contact,
      date: format(new Date(booking.date), "yyyy-MM-dd"),
      startTime: booking.startTime,
      duration: booking.duration,
      amount: booking.amount.totalAmount,
      paid:
        booking.amount?.transactions?.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        ) || 0,
      remaining: booking.amount.remainingAmount,
      status: booking.status,
    }));

    res.status(200).json({
      status: "success",
      data: {
        bookings: formattedBookings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
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
      message: "Booking status updated",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
