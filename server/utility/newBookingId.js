import config from "../constants/config.js";
import Booking from "../models/Booking.js";

export const newBookingId = async () => {
  try {
    // Find the most recent booking
    const recentBooking = await Booking.findOne({})
      .sort({ createdAt: -1 })
      .select("bookingId")
      .lean();

    // If no booking exists, start with 0001
    if (!recentBooking || !recentBooking.bookingId) {
      return `${config.turf.initials}0001`;
    }

    // Extract the numeric part of the booking ID
    const [, numericPart] = recentBooking.bookingId.split(config.turf.initials);
    const currentId = parseInt(numericPart, 10);

    // Handle potential parsing errors
    if (isNaN(currentId)) {
      console.error(
        "Invalid booking ID format found:",
        recentBooking.bookingId
      );
      return `${config.turf.initials}0001`;
    }

    // Generate next ID with proper padding
    const nextId = currentId + 1;
    const paddedId = nextId.toString().padStart(4, "0");

    // Return the new booking ID
    return `${config.turf.initials}${paddedId}`;
  } catch (error) {
    console.error("Error generating new booking ID:", error);
    // Fallback to a timestamp-based ID in case of errors
    const timestamp = Date.now().toString().slice(-4);
    return `${config.turf.initials}${timestamp}`;
  }
};
