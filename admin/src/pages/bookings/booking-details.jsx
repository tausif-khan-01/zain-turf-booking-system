"use client";

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  Download,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [activeTab, setActiveTab] = useState("details");

  // In a real app, you would fetch the booking data based on the ID
  const booking = bookingData;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission
    alert(`Payment of ₹${paymentAmount} recorded via ${paymentMethod}`);
    setPaymentAmount("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/bookings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Booking Details
            </h1>
            <p className="text-muted-foreground">Manage booking {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Booking Information</CardTitle>
                  <CardDescription>Details about this booking</CardDescription>
                </div>
                <Badge
                  variant={
                    booking.status === "confirmed"
                      ? "default"
                      : booking.status === "pending"
                      ? "secondary"
                      : booking.status === "completed"
                      ? "success"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Booking ID
                        </h3>
                        <p className="mt-1 text-sm font-medium">{booking.id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Date
                        </h3>
                        <div className="mt-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm font-medium">{booking.date}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Time
                        </h3>
                        <div className="mt-1 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm font-medium">
                            {booking.time} ({booking.duration})
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Players
                        </h3>
                        <div className="mt-1 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm font-medium">
                            {booking.players} players
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Customer
                        </h3>
                        <div className="mt-1 flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm font-medium">
                            {booking.customer}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Phone
                        </h3>
                        <div className="mt-1 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm font-medium">{booking.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Email
                        </h3>
                        <div className="mt-1 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm font-medium">{booking.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500">
                        Notes
                      </h3>
                      <p className="mt-1 text-sm">{booking.notes}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="history" className="pt-4">
                  <div className="space-y-4">
                    {booking.history.map((item, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                          {index < booking.history.length - 1 && (
                            <div className="h-full w-px bg-gray-200"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{item.action}</p>
                            <span className="text-xs text-gray-500">
                              {item.date} at {item.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Track payments for this booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold">₹{booking.amount}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Paid Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{booking.paid}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Remaining Amount</p>
                    <p className="text-xl font-bold text-amber-600">
                      ₹{booking.remaining}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Payment History</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Booking Fee</p>
                        <p className="text-sm text-gray-500">
                          {booking.paymentDate} • {booking.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{booking.paid}</p>
                        <p className="text-xs text-gray-500">
                          {booking.paymentId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.remaining > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Record Payment</h3>
                    <form onSubmit={handlePaymentSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="payment-amount">Payment Amount</Label>
                          <Input
                            id="payment-amount"
                            placeholder="Enter amount"
                            type="number"
                            min="1"
                            max={booking.remaining}
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="payment-method">Payment Method</Label>
                          <Select
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                          >
                            <SelectTrigger id="payment-method">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="bank">
                                Bank Transfer
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={!paymentAmount}
                      >
                        Record Payment
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
              {booking.status === "confirmed" && (
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={booking.avatar || "/placeholder.svg"}
                    alt={booking.customer}
                  />
                  <AvatarFallback>
                    {booking.customer.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.customer}</p>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="text-sm">{booking.phone}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="text-sm">{booking.email}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Customer History
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
