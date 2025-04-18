const config = {
  turf: {
    name: "Zain Turf",
    address: "Madhav nagari, Gangakhed Rd, Parbhani, Maharashtra 431401",
    extendedAddress:
      "Zain Sports Resorts & Turf, Madhav nagari, Gangakhed Rd, Parbhani, Maharashtra 431401",
    phone: "+91 98230 00000",
    email: "info@zainturf.com",
    social: {
      instagram: "https://www.instagram.com/zain_turf/",
      facebook: "https://www.facebook.com/zain.turf.5",
      twitter: "https://x.com/zain_turf",
    },
  },
  razorpay: {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    currency: "INR",
  },
};

export default config;
