import mongoose from "mongoose";

const txnSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Booking",
        "Maintenance",
        "Utility",
        "Salary",
        "Other",
        "RazorpayFee",
      ],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Online", "Razorpay", "Bank Transfer", "Cheque", "UPI"],
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "Processing"],
      default: "Pending",
    },
    relatedBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    vendor: {
      type: String,
      // Required only for expenses
      required: function () {
        return this.type === "expense";
      },
    },
    razorpayDetails: {
      orderId: String,
      paymentId: String,
      fee: Number,
      feePayedBy: {
        type: String,
        enum: ["business", "customer"],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient reporting queries
txnSchema.index({ date: 1, type: 1 });
txnSchema.index({ category: 1, date: 1 });
txnSchema.index({ status: 1 });

const Txn = mongoose.model("Txn", txnSchema);

export default Txn;
