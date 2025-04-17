"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import html2canvas from "html2canvas";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Download,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

interface BookingData {
  id: string;
  date: string;
  timeSlot: string;
  duration: number;
  hourlyRate: number;
  onlinePayment: number;
  remainingPayment: number;
  totalAmount: number;
  name: string;
  phone: string;
}

export default function BookingConfirmation() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get booking data from localStorage
    const storedData = localStorage.getItem("bookingData");

    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      // If no booking data, redirect to booking page
      router.push("/booking");
    }

    setIsLoading(false);
  }, [router]);

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2, // Higher scale for better quality
          backgroundColor: "#ffffff",
          logging: false,
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `zain-turf-booking-${bookingData?.id || "receipt"}.png`;
        link.click();
      } catch (error) {
        console.error("Error generating receipt image:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Booking Found</h1>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find your booking information.
        </p>
        <Link href="/booking">
          <Button>Return to Booking Page</Button>
        </Link>
      </div>
    );
  }

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
          className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto  mb-8   receipt-compatible  "
        >
          <div className="bg-primary p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 rounded-full   bg-white flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Zain Turf Logo"
                    className="w-10 h-10 object-contain"
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
                <p className="text-sm font-semibold">{bookingData.id}</p>
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
                      <p className="text-sm font-medium">{bookingData.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="size-5 text-primary mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium">
                        {bookingData.timeSlot}
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
                    <p className="text-sm font-medium">{bookingData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{bookingData.phone}</p>
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
                    <span className="text-gray-600">
                      Total ({bookingData.duration} hr
                      {bookingData.duration !== 1 ? "s" : ""})
                    </span>
                    <span>₹{bookingData.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Online</span>
                    <span>₹{bookingData.onlinePayment}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Pay at Venue</span>
                    <span className="text-primary">
                      ₹{bookingData.remainingPayment}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-1 rounded-lg shadow-sm mb-1">
                  <QRCodeCanvas
                    value={`ZAIN-TURF-BOOKING:${bookingData.id}`}
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
        </div>
      </div>
    </main>
  );
}
