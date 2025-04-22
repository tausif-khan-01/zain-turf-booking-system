import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    expenseId: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    vendor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Maintenance", "Utility", "Salary", "Other"],
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online", "Bank Transfer", "Cheque", "UPI", "Razorpay"],
      required: true,
    },
    relatedTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Txn",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient reporting queries
expenseSchema.index({ date: 1 });
expenseSchema.index({ category: 1, date: 1 });
expenseSchema.index({ status: 1 });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
