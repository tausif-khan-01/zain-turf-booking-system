import express from "express";
import { login, register } from "../controllers/auth.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", protect, authorize("admin"), register);
router.post("/login", login);

export default router; 