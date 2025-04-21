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
  fee: {
    type: Number,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online", "Razorpay"],
      required: [true, "Payment method is required"],
    },
    amountType: {
      type: String,
      enum: ["advance", "balance"],
      required: [true, "Amount type is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
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
    default: 0,
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
      unique: true,
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

// Indexes for efficient querying
bookingSchema.index({ date: 1, startTime: 1, bookingId: 1 });
bookingSchema.index({ "customer.contact": 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ status: 1 });

// Virtual field for total paid amount
bookingSchema.virtual('totalPaidAmount').get(function() {
  return this.amount.transactions.reduce((sum, txn) => {
    return txn.status === 'Paid' ? sum + txn.amount : sum;
  }, 0);
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
