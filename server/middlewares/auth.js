import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Get access token from Authorization header
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return res.status(401).json({
        status: 401 || "error",
        message: "Invalid access token",
      });
    }

    // Find user and attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    // Check if user has the required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to access this route",
      });
    }

    next();
  };
};
