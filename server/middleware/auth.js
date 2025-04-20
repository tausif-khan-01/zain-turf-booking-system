import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get access token from cookie
    const accessToken =
      req.headers?.authorization?.split(" ")[1] ||
      req.headers?.Authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        status: "error",
        message: "Access token not found",
      });
    }

    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return res.status(401).json({
        status: "error",
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
