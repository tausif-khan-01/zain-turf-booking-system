const config = {
  turf: {
    initials: "ZT",
    hourlyRate: 600,
    bookingFee: 100,
    razorpayFeePercentage: 0.02,
    gstPercentage: 0.18,
  },
  db: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/turf",
  },
  razorpay: {
    key: process.env.RAZORPAY_KEY_ID,
    secret: process.env.RAZORPAY_KEY_SECRET,
    isCustomerPayRazorpayFees: Boolean(
      Number(process.env.IS_CUSTOMER_PAYS_RAZORPAY_FEES)
    ),
  },
  port: process.env.PORT || 5000,
};

export default config;
