import express from "express";
import authRoutes from "./auth.js";
import bookingRoutes from "./booking.js";
import expenseRoutes from "./expenses.js";
import transactionRoutes from "./transactions.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/booking", bookingRoutes); 
router.use("/transactions", transactionRoutes);
router.use("/expenses", expenseRoutes);

export default router;
