import config from "../constants/config.js";

export const calculateBookingAmount = (duration) => {
  // Base amounts
  const totalAmount = config.turf.hourlyRate * duration;
  const advanceAmount = config.turf.bookingFee * duration;

  // Calculate Razorpay fees
  const razorpayFee = advanceAmount * config.turf.razorpayFeePercentage;
  const gstOnRazorpayFee = razorpayFee * config.turf.gstPercentage;
  const totalRazorpayFee = razorpayFee + gstOnRazorpayFee;

  const isCustomerPayRazorpayFees = config.razorpay.isCustomerPayRazorpayFees;

  const remainingAmount = totalAmount - advanceAmount;

  return {
    totalAmount,
    advanceAmount,
    remainingAmount,
    razorpayFee,
    gstOnRazorpayFee,
    totalRazorpayFee,
    isCustomerPayRazorpayFees,
  };
};

console.log("ccalculateBookingAmount(2);onfig: ", calculateBookingAmount(2));

export const calculateRemainingAmount = (totalAmount, advanceAmount) => {
  return totalAmount - advanceAmount;
};
