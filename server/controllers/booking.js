import crypto from "crypto";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import Razorpay from "razorpay";
import config from "../constants/config.js";
import Booking from "../models/Booking.js";
import Txn from "../models/Txns.js";
import { calculateBookingAmount } from "../utility/booking-calc.js";
import { newBookingId } from "../utility/newBookingId.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.razorpay.key,
  key_secret: config.razorpay.secret,
});

// Helper function to create transaction for booking
async function createBookingTransaction(
  booking,
  amount,
  amountType,
  paymentMethod,
  razorpayDetails = null,
  id = null
) {
  const txnId = id || `TRX-${Date.now()}`;
  console.log("ID: ", txnId);
  return await Txn.create({
    txnId,
    amount,
    type: "income",
    category: "Booking",
    description: `Booking Payment - ${booking.bookingId}`,
    paymentMethod,
    status: "Paid",
    razorpayDetails,
  });
}

// Helper function to create Razorpay fee expense transaction
async function createRazorpayFeeTransaction(
  bookingId,
  amount,
  razorpayDetails
) {
  const txnId = `TRX-FEE-${Date.now()}`;

  return await Txn.create({
    txnId,
    amount,
    type: "expense",
    category: "RazorpayFee",
    description: `Razorpay Fee for Booking - ${bookingId}`,
    paymentMethod: "Razorpay",
    status: "Paid",
    vendor: "Razorpay",
    razorpayDetails,
  });
}

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

    // Create booking
    const date = format(new Date(booking.date), "yyyy-MM-dd");
    const bookingId = await newBookingId();
    const txnId = `TRX-${Date.now()}`;

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
            txnId,
            amount: amountDetails.advanceAmount,
            amountType: "advance",
            paymentMethod: "Razorpay",
            status: "Paid",
          },
        ],
      },
      razorpay: {
        isCustomerPayRazorpayFees: amountDetails.isCustomerPayRazorpayFees,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        fee: amountDetails.totalRazorpayFee,
      },
    };

    const newBooking = await Booking.create(bookingData);

    console.log("creating transaction record");
    // Create transaction record
    const transaction = await createBookingTransaction(
      newBooking,
      amountDetails.advanceAmount,
      "advance",
      "Razorpay",
      {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        fee: amountDetails.totalRazorpayFee,
        feePayedBy: amountDetails.isCustomerPayRazorpayFees
          ? "customer"
          : "business",
      },
      txnId
    );

    // If business pays Razorpay fee, create expense transaction
    if (
      !amountDetails.isCustomerPayRazorpayFees &&
      amountDetails.totalRazorpayFee > 0
    ) {
      console.log("creating razorpay fee expense record");
      await createRazorpayFeeTransaction(
        bookingId,
        amountDetails.totalRazorpayFee,
        {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          feePayedBy: "business",
        }
      );
    }

    console.log("transaction record created");

    res.status(200).json({
      status: "success",
      message: "Payment verified and booking created",
      bookingId: newBooking.bookingId,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// get booking details
export const getBookingDetails = async (req, res) => {
  try {
    const { id: bookingId } = req.params;

    const booking = await Booking.findOne({ bookingId });
    console.log("booking: ", JSON.stringify(booking));
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

    // Date filter logic
    if (dateFilter === "all") {
      // Show all dates - don't add date to query
      // query.date will be undefined, which means no date filtering
    } else if (dateFilter === "custom" && date) {
      // Custom filter with specific date
      const selectedDate = new Date(date);
      query.date = {
        $gte: startOfDay(selectedDate),
        $lte: endOfDay(selectedDate),
      };
    } else if (dateFilter) {
      // Date range filters
      const today = new Date(date || new Date());
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
        case "nextWeek":
          query.date = {
            $gte: startOfWeek(addDays(today, 7)),
            $lte: endOfWeek(addDays(today, 7)),
          };
          break;
        case "thisMonth":
          query.date = {
            $gte: startOfMonth(today),
            $lte: endOfMonth(today),
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
    } else if (date) {
      // Single date filter
      const selectedDate = new Date(date);
      query.date = {
        $gte: startOfDay(selectedDate),
        $lte: endOfDay(selectedDate),
      };
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
    console.log("❌error: ", error);
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

// get receipt
export const getReceipt = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
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

// New function to record additional payments
export const recordPayment = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const { amount, paymentMethod } = req.body;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    // Create transaction record
    const transaction = await createBookingTransaction(
      booking,
      amount,
      "balance",
      paymentMethod
    );

    // Update booking
    booking.amount.transactions.push({
      txnId: transaction.txnId,
      amount,
      amountType: "balance",
      paymentMethod,
      status: "Paid",
    });
    booking.amount.remainingAmount -= amount;

    if (booking.amount.remainingAmount <= 0) {
      booking.paymentStatus = "completed";
      booking.status = "completed";
    }

    await booking.save();

    res.status(200).json({
      status: "success",
      data: {
        booking,
        transaction,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// get bill info
export const getBillInfo = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    // Calculate total paid amount from transactions
    const paidAmount = booking.amount.transactions.reduce(
      (sum, transaction) => {
        return transaction.status === "Paid" ? sum + transaction.amount : sum;
      },
      0
    );

    // Format payment history
    const paymentHistory = booking.amount.transactions.map((transaction) => ({
      description:
        transaction.amountType === "advance"
          ? "Booking Fee"
          : "Balance Payment",
      date: transaction.createdAt,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      status: transaction.status,
    }));

    // Format response
    const billInfo = {
      totalAmount: booking.amount.totalAmount,
      paidAmount: paidAmount,
      remainingAmount: booking.amount.remainingAmount,
      paymentHistory: paymentHistory,
      paymentStatus: booking.paymentStatus,
      // Include Razorpay fee info if applicable
      razorpayFee: booking.razorpay?.fee || 0,
      isCustomerPayRazorpayFees:
        booking.razorpay?.isCustomerPayRazorpayFees || false,
    };

    res.status(200).json({
      status: "success",
      data: billInfo,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
