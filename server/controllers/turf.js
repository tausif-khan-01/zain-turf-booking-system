import { TURF_DETAILS } from "../constants/turf.js";

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