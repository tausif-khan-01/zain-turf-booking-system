import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zain Turf - Premium Football Turf Booking",
  description: "Book your slot at Zain Turf, featuring professional-grade artificial grass, floodlights, and modern facilities. Perfect for football enthusiasts and teams.",
  keywords: [
    "football turf",
    "turf booking",
    "sports facility",
    "artificial grass",
    "football ground",
    "sports complex",
    "turf rental",
    "football pitch",
    "sports booking",
    "turf management"
  ],
  authors: [{ name: "Zain Turf" }],
  creator: "Zain Turf",
  publisher: "Zain Turf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zainturf.com",
    title: "Zain Turf - Premium Football Turf Booking",
    description: "Book your slot at Zain Turf, featuring professional-grade artificial grass, floodlights, and modern facilities.",
    siteName: "Zain Turf",
    images: [
      {
        url: "/img/turf.jpg",
        width: 1200,
        height: 630,
        alt: "Zain Turf Football Ground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zain Turf - Premium Football Turf Booking",
    description: "Book your slot at Zain Turf, featuring professional-grade artificial grass, floodlights, and modern facilities.",
    images: ["/img/turf.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
}; 