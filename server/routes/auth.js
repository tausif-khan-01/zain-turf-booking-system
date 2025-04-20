import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
} from "../controllers/auth.js";
import { authorize, protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", protect, authorize("admin"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
// me
router.get("/me", protect, getMe);

export default router;
