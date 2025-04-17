"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/utils/api";
import { getSlotEndTime } from "@/utils/getEndTime";
import html2canvas from "html2canvas";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Download,
  Share,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

interface Transaction {
  amount: number;
  paymentMethod: string;
  amountType: string;
  createdAt: string;
}

interface Amount {
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  discount?: number;
  transactions: Transaction[];
}

interface Razorpay {
  isCustomerPayRazorpayFees: boolean;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

interface BookingData {
  _id: string;
  bookingId: string;
  date: string;
  startTime: string;
  duration: number;
  customer: {
    name: string;
    contact: string;
  };
  amount: Amount;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  razorpay: Razorpay;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export default function BookingConfirmation() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/booking/${bookingId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch booking data");
        }
        const data = response.data.booking;
        setBookingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `zain-turf-booking-${
          bookingData?.bookingId || "receipt"
        }.png`;
        link.click();
      } catch (error) {
        console.error("Error generating receipt image:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="space-y-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-20 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-600 mb-6">
          {error || "We couldn't find your booking information."}
        </p>
        <Link href="/booking">
          <Button>Return to Booking Page</Button>
        </Link>
      </div>
    );
  }

  const shareReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      navigator.share({
        title: "Zain Turf Booking Receipt",
        text: "Check out my booking details",
        files: [new File([image], "receipt.png", { type: "image/png" })],
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your booking has been successfully confirmed. Please find your
            booking details below.
          </p>
        </div>

        <div
          ref={receiptRef}
          className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto mb-8 receipt-compatible"
        >
          <div className="bg-primary p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 h-full flex items-center justify-center">
                  <Image
                    src="/logo.jpg"
                    alt="Zain Turf Logo"
                    className="h-12"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Zain Turf</h2>
                  <p className="text-sm">Booking Receipt</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs">Booking ID</p>
                <p className="text-sm font-semibold">{bookingData.bookingId}</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Booking Details
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Calendar className="size-5 text-primary mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium">
                        {new Date(bookingData.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="size-5 text-primary mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium">
                        {bookingData.startTime} -{" "}
                        {getSlotEndTime(
                          bookingData.startTime,
                          bookingData.duration
                        )}{" "}
                        ({bookingData.duration} hours)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Customer Info
                </h3>
                <div className="space-y-1">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium">
                      {bookingData.customer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">
                      {bookingData.customer.contact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Payment Summary
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span>₹{bookingData.amount.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advance Paid</span>
                    <span>₹{bookingData.amount.advanceAmount}</span>
                  </div>
                  {bookingData.amount.discount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span>₹{bookingData.amount.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Remaining Amount</span>
                    <span className="text-primary">
                      ₹{bookingData.amount.remainingAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-1 rounded-lg shadow-sm mb-1">
                  <QRCodeCanvas
                    value={`ZAIN-TURF-BOOKING:${bookingData.bookingId}`}
                    size={80}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Scan at venue
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <h3 className="text-xs font-semibold text-gray-700 mb-1">
                Venue Information
              </h3>
              <p className="text-xs text-gray-600">
                Zain Turf, Near Lotus Garden, Jintur Naka
              </p>
              <p className="text-xs text-gray-600">
                Parbhani, Maharashtra 431401
              </p>
              <p className="text-xs text-gray-600">Contact: +91-1234567890</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Link>
          </Button>
          <Button onClick={downloadReceipt}>
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>

          {/* share if user is on mobile  it should open share dialog whith the receipt image */}
          <Button onClick={shareReceipt}>
            <Share className="w-4 h-4 mr-2" />
            Share Receipt
          </Button>
        </div>
      </div>
    </main>
  );
}
