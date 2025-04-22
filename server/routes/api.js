import express from "express";
import authRoutes from "./auth.js";
import bookingRoutes from "./booking.js";
import expenseRoutes from "./expenses.js";
import transactionRoutes from "./transactions.js";
import dashboardRoutes from "./dashboard.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/booking", bookingRoutes); 
router.use("/transactions", transactionRoutes);
router.use("/expenses", expenseRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
