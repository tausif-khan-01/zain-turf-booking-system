import mongoose from "mongoose";
import config from "../constants/config.js";

const razorpaySchema = new mongoose.Schema({
  isCustomerPayRazorpayFees: {
    type: Boolean,
    default: config.razorpay.isCustomerPayRazorpayFees,
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "razorpay", "online"],
      required: [true, "Payment method is required"],
    },
    amountType: {
      type: String,
      enum: ["advance", "balance", "razorpay_fee"],
      required: [true, "Amount type is required"],
    },
  },
  {
    timestamps: true,
  }
);

const amountSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
  },
  advanceAmount: {
    type: Number,
    required: [true, "Advance amount is required"],
  },

  transactions: [transactionSchema],
  remainingAmount: {
    type: Number,
    required: [true, "Remaining amount is required"],
  },
  discount: {
    type: Number,
  },
});

const bookingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
      },
      contact: {
        type: String,
        required: [true, "Customer contact is required"],
      },
    },
    bookingId: {
      type: String,
      required: [true, "Booking id is required"],
    },

    amount: amountSchema,

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    razorpay: razorpaySchema,

    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of available slots
bookingSchema.index({ date: 1, startTime: 1, bookingId: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
