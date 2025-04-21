import express from "express";
import {
  createExpense,
  getExpenseSummary,
  getExpenses,
  updateExpenseStatus,
} from "../controllers/expenses.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Expense summary and reports
router.get("/summary", protect, getExpenseSummary);

// Expense management
router.get("/", protect, getExpenses);
router.post("/", protect, createExpense);
router.put("/:id/status", protect, updateExpenseStatus);

export default router;
