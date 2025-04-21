import Txn from "../models/Txns.js";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

// Get financial summary
export const getFinancialSummary = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const now = new Date();
    let startDate, endDate;

    // Set date range based on period
    switch (period) {
      case "week":
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "year":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    // Get all transactions for the period
    const transactions = await Txn.find({
      date: { $gte: startDate, $lte: endDate },
      status: "Paid",
    });

    // Calculate totals
    const summary = transactions.reduce(
      (acc, txn) => {
        if (txn.type === "income") {
          acc.totalRevenue += txn.amount;
        } else if (txn.type === "expense") {
          acc.totalExpenses += txn.amount;
        }
        return acc;
      },
      { totalRevenue: 0, totalExpenses: 0 }
    );

    // Calculate net profit
    summary.netProfit = summary.totalRevenue - summary.totalExpenses;

    // Get pending payments
    const pendingPayments = await Txn.aggregate([
      {
        $match: {
          type: "income",
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    summary.pendingPayments = pendingPayments[0]?.total || 0;

    // Get comparison with last period
    const lastPeriodStartDate = new Date(startDate);
    lastPeriodStartDate.setMonth(lastPeriodStartDate.getMonth() - 1);
    const lastPeriodEndDate = new Date(endDate);
    lastPeriodEndDate.setMonth(lastPeriodEndDate.getMonth() - 1);

    const lastPeriodTransactions = await Txn.find({
      date: { $gte: lastPeriodStartDate, $lte: lastPeriodEndDate },
      status: "Paid",
    });

    const lastPeriodSummary = lastPeriodTransactions.reduce(
      (acc, txn) => {
        if (txn.type === "income") {
          acc.totalRevenue += txn.amount;
        } else if (txn.type === "expense") {
          acc.totalExpenses += txn.amount;
        }
        return acc;
      },
      { totalRevenue: 0, totalExpenses: 0 }
    );

    // Calculate percentage changes
    summary.revenueChange = lastPeriodSummary.totalRevenue
      ? ((summary.totalRevenue - lastPeriodSummary.totalRevenue) /
          lastPeriodSummary.totalRevenue) *
        100
      : 0;
    summary.expensesChange = lastPeriodSummary.totalExpenses
      ? ((summary.totalExpenses - lastPeriodSummary.totalExpenses) /
          lastPeriodSummary.totalExpenses) *
        100
      : 0;

    res.status(200).json({
      status: "success",
      data: summary,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get transaction list
export const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      status,
      search,
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(new Date(startDate)),
        $lte: endOfDay(new Date(endDate)),
      };
    }

    if (search) {
      query.$or = [
        { txnId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Txn.countDocuments(query);
    const transactions = await Txn.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: "success",
      data: {
        transactions,
        pagination: {
          total,
          page: parseInt(page),
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

// Create transaction
export const createTransaction = async (req, res) => {
  try {
    const {
      amount,
      type,
      category,
      description,
      paymentMethod,
      vendor,
      razorpayDetails,
    } = req.body;

    console.log("req.body: ", req.body);

    const txnId = `TRX-${Date.now()}`;
    const transaction = await Txn.create({
      txnId,
      amount,
      type,
      category,
      description,
      paymentMethod,
      vendor,
      razorpayDetails,
      status: "Paid",
    });

    res.status(201).json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update transaction status
export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = await Txn.findOneAndUpdate(
      { txnId: id },
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
