import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zainturf.com"),
  title: "Zain Turf - Biggest Turf in Parbhani",
  description:
    "Book your slot at Zain Turf, featuring professional-grade artificial grass, floodlights, and modern facilities in Parbhani, Maharashtra, India.",
  keywords: [
    "turf",
    "turf booking",
    "sports facility",
    "artificial grass",
    "Play Ground",
    "sports complex",
    "turf rental",
    "best turf in parbhani",
    "turf parbhani",
    "turf booking parbhani",
    "sports booking",
    "turf management",
    "Zain Turf",
    "Zain Turf Parbhani",
    "Zain Turf Booking",
    "Zain Turf Booking Parbhani",
    "Zain Turf Booking in Parbhani",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Zain Turf Booking in India",
    "Zain Turf Booking in Maharashtra",
    "Turf Booking in Parbhani",
    "Turf Booking in Maharashtra",
    "Turf Booking in India",
    "Turf Booking in Maharashtra",
    "Turf Booking in India",
    "Turf Booking in Maharashtra",
    "Turf Booking in India",
    "Turf Booking in Maharashtra",
    "Turf Booking in India",
    "Turf Booking in Maharashtra",
    "Turf Booking in India",
    "Turf Booking in Maharashtra",
    "Turf Booking in India",
    "Turf Booking in Maharashtra",
  ],
  authors: [{ name: "Zain Turf" }],
  creator: "Zain Turf",
  publisher: "Zain Turf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zainturf.com",
    title: "Zain Turf - Premium Turf Playground Booking",
    description:
      "Book your slot at Zain Turf, featuring professional-grade artificial grass, floodlights, and modern facilities.",
    siteName: "Zain Turf",
    images: [
      {
        url: "/img/turf-1.jpg",
        width: 1200,
        height: 630,
        alt: "Zain Turf Play Ground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zain Turf - Biggest Turf in Parbhani",
    description:
      "Book your slot at Zain Turf, featuring professional-grade artificial grass, floodlights, and modern facilities.",
    images: ["/img/turf-1.jpg"],
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
  manifest: "./site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
