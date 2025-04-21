import express from "express";
import {
  createTransaction,
  getFinancialSummary,
  getTransactions,
  updateTransactionStatus,
} from "../controllers/transactions.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Financial summary and reports
router.get("/summary", protect, getFinancialSummary);

// Transaction management
router.get("/", protect, getTransactions);
router.post("/", protect, createTransaction);
router.put("/:id/status", protect, updateTransactionStatus);

export default router;
