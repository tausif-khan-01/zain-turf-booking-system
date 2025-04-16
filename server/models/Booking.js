import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerMobile: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    advanceAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    qrCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of available slots
bookingSchema.index({ date: 1, startTime: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking; 