const config = {
  db: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/turf",
  },
  port: process.env.PORT || 5000,
};

export default config;
