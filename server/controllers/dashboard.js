import {
  endOfWeek,
  endOfYear,
  startOfWeek,
  startOfYear,
  subWeeks,
  subYears,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
} from "date-fns";
import Booking from "../models/Booking.js";
import Txn from "../models/Txns.js";

const getPeriodDates = (period) => {
  const now = new Date();
  let currentStart, currentEnd, previousStart, previousEnd;

  switch (period) {
    case "week":
      currentStart = startOfWeek(now);
      currentEnd = endOfWeek(now);
      previousStart = startOfWeek(subWeeks(now, 1));
      previousEnd = endOfWeek(subWeeks(now, 1));
      break;
    case "month":
      currentStart = startOfMonth(now);
      currentEnd = endOfMonth(now);
      previousStart = startOfMonth(subMonths(now, 1));
      previousEnd = endOfMonth(subMonths(now, 1));
      break;
    case "year":
      currentStart = startOfYear(now);
      currentEnd = endOfYear(now);
      previousStart = startOfYear(subYears(now, 1));
      previousEnd = endOfYear(subYears(now, 1));
      break;
    default:
      currentStart = startOfWeek(now);
      currentEnd = endOfWeek(now);
      previousStart = startOfWeek(subWeeks(now, 1));
      previousEnd = endOfWeek(subWeeks(now, 1));
  }

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
  };
};

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Get main dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const { period = "week" } = req.query;
    const { currentStart, currentEnd, previousStart, previousEnd } =
      getPeriodDates(period);

    // Get total bookings
    const currentBookings = await Booking.countDocuments({
      date: { $gte: currentStart, $lte: currentEnd },
    });

    const previousBookings = await Booking.countDocuments({
      date: { $gte: previousStart, $lte: previousEnd },
    });

    // Get revenue
    const currentRevenue = await Txn.aggregate([
      {
        $match: {
          type: "income",
          createdAt: { $gte: currentStart, $lte: currentEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const previousRevenue = await Txn.aggregate([
      {
        $match: {
          type: "income",
          createdAt: { $gte: previousStart, $lte: previousEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get unique customers
    const currentCustomers = await Booking.distinct("customer.phone", {
      date: { $gte: currentStart, $lte: currentEnd },
    });

    const previousCustomers = await Booking.distinct("customer.phone", {
      date: { $gte: previousStart, $lte: previousEnd },
    });

    // Calculate occupancy rate
    const totalSlots = 14; // Assuming 14 slots per day (6 AM to 8 PM)
    const daysBetween = Math.ceil(
      (currentEnd - currentStart) / (1000 * 60 * 60 * 24)
    );
    const totalPossibleSlots = totalSlots * daysBetween;

    const currentOccupancy = (currentBookings / totalPossibleSlots) * 100;
    const previousOccupancy = (previousBookings / totalPossibleSlots) * 100;

    res.status(200).json({
      status: "success",
      data: {
        totalBookings: {
          count: currentBookings,
          change: calculatePercentageChange(currentBookings, previousBookings),
        },
        revenue: {
          amount: currentRevenue[0]?.total || 0,
          change: calculatePercentageChange(
            currentRevenue[0]?.total || 0,
            previousRevenue[0]?.total || 0
          ),
        },
        customers: {
          count: currentCustomers.length,
          change: calculatePercentageChange(
            currentCustomers.length,
            previousCustomers.length
          ),
        },
        occupancyRate: {
          rate: Math.round(currentOccupancy),
          change: calculatePercentageChange(currentOccupancy, previousOccupancy),
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get recent bookings
export const getRecentBookings = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("bookingId customer date startTime duration amount status");

    res.status(200).json({
      status: "success",
      data: {
        recentBookings,
      },
    });
  } catch (error) {
    console.error("Recent Bookings Error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get today's schedule
export const getTodaySchedule = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const schedule = await Booking.find({
      date: {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate),
      },
    })
      .sort({ startTime: 1 })
      .select("bookingId customer date startTime duration amount status");

    res.status(200).json({
      status: "success",
      data: {
        schedule,
      },
    });
  } catch (error) {
    console.error("Schedule Error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
