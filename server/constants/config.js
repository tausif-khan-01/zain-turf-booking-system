const config = {
  db: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/turf",
  },
  razorpay: {
    key: process.env.RAZORPAY_KEY_ID,
    secret: process.env.RAZORPAY_KEY_SECRET,
  },
  port: process.env.PORT || 5000,
};

export default config;
