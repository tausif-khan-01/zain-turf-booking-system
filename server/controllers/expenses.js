import { TURF_DETAILS } from "../constants/turf.js";
import Expense from "../models/Expense.js";
import Txn from "../models/Txns.js";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";

// Get expense summary
export const getExpenseSummary = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const now = new Date();
    let startDate, endDate;

    // Set date range based on period
    if (period === "month") {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else {
      startDate = startOfDay(now);
      endDate = endOfDay(now);
    }

    // Get total expenses
    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get expenses by category
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: "Paid",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Format the response
    const summary = {
      totalExpenses: totalExpenses[0]?.total || 0,
      categories: expensesByCategory.reduce((acc, cat) => {
        acc[cat._id.toLowerCase()] = cat.total;
        return acc;
      }, {}),
    };

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

// Get expense list
export const getExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate,
      status,
      search,
    } = req.query;

    const query = {};

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
        { expenseId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { vendor: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: "success",
      data: {
        expenses,
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

// Create expense
export const createExpense = async (req, res) => {
  try {
    const { amount, category, description, vendor, paymentMethod } = req.body;

    // First create the transaction
    const txnId = `TRX-${Date.now()}`;
    const transaction = await Txn.create({
      txnId,
      amount,
      type: "expense",
      category,
      description,
      paymentMethod,
      vendor,
      status: "Paid",
    });

    // Then create the expense
    const expenseId = `EXP-${Date.now()}`;
    const expense = await Expense.create({
      expenseId,
      amount,
      category,
      description,
      vendor,
      paymentMethod,
      status: "Paid",
      relatedTransaction: transaction._id,
    });

    res.status(201).json({
      status: "success",
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update expense status
export const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const expense = await Expense.findOne({ expenseId: id });
    if (!expense) {
      return res.status(404).json({
        status: "error",
        message: "Expense not found",
      });
    }

    // Update both expense and related transaction
    expense.status = status;
    await expense.save();

    await Txn.findByIdAndUpdate(expense.relatedTransaction, { status });

    res.status(200).json({
      status: "success",
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get turf details
export const getTurf = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: TURF_DETAILS,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update turf details
export const updateTurf = async (req, res) => {
  try {
    const { pricePerHour, advancePercentage, operatingHours } = req.body;

    // Update only provided fields
    if (pricePerHour) TURF_DETAILS.pricePerHour = pricePerHour;
    if (advancePercentage) TURF_DETAILS.advancePercentage = advancePercentage;
    if (operatingHours) {
      if (operatingHours.start) TURF_DETAILS.operatingHours.start = operatingHours.start;
      if (operatingHours.end) TURF_DETAILS.operatingHours.end = operatingHours.end;
    }

    res.status(200).json({
      status: "success",
      data: TURF_DETAILS,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update turf status
export const updateTurfStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (status !== "active" && status !== "maintenance") {
      return res.status(400).json({
        status: "error",
        message: "Invalid status. Must be either 'active' or 'maintenance'",
      });
    }

    TURF_DETAILS.status = status;

    res.status(200).json({
      status: "success",
      data: TURF_DETAILS,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}; 