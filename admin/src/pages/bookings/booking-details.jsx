"use client";

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BookingHeader } from "./components/BookingHeader";
import { BookingInfo } from "./components/BookingInfo";
import { PaymentInfo } from "./components/PaymentInfo";
import { CustomerInfo } from "./components/CustomerInfo";
import { BookingActions } from "./components/BookingActions";

// Mock booking data
const bookingData = {
  id: "ZT-1234",
  customer: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  date: "Jul 24, 2023",
  time: "5:00 PM - 7:00 PM",
  duration: "2 hours",
  players: 10,
  amount: 1200,
  paid: 200,
  remaining: 1000,
  status: "confirmed",
  notes: "Team wants to practice for upcoming tournament",
  paymentMethod: "Online",
  paymentId: "PAY-123456",
  paymentDate: "Jul 22, 2023",
  avatar: "/placeholder.svg",
  history: [
    {
      date: "Jul 22, 2023",
      time: "10:30 AM",
      action: "Booking created",
      details: "Online booking through website",
    },
    {
      date: "Jul 22, 2023",
      time: "10:32 AM",
      action: "Payment received",
      details: "₹200 paid online (Booking fee)",
    },
    {
      date: "Jul 22, 2023",
      time: "10:35 AM",
      action: "Booking confirmed",
      details: "Confirmation email sent",
    },
  ],
};

export default function BookingDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <BookingHeader bookingId={id} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BookingInfo />
          <PaymentInfo />
        </div>

        {/* <div className="space-y-6">
          <BookingActions booking={booking} />
          <CustomerInfo booking={booking} />
        </div> */}
      </div>
    </div>
  );
}
