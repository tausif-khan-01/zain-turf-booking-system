"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeft,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Available time slots
const timeSlots = [
  { id: 1, time: "06:00 AM - 07:00 AM", available: true, period: "morning" },
  { id: 2, time: "07:00 AM - 08:00 AM", available: true, period: "morning" },
  { id: 3, time: "08:00 AM - 09:00 AM", available: true, period: "morning" },
  { id: 4, time: "09:00 AM - 10:00 AM", available: false, period: "morning" },
  { id: 5, time: "10:00 AM - 11:00 AM", available: true, period: "morning" },
  { id: 6, time: "11:00 AM - 12:00 PM", available: true, period: "morning" },
  { id: 7, time: "12:00 PM - 01:00 PM", available: true, period: "evening" },
  { id: 8, time: "01:00 PM - 02:00 PM", available: true, period: "evening" },
  { id: 9, time: "02:00 PM - 03:00 PM", available: true, period: "evening" },
  { id: 10, time: "03:00 PM - 04:00 PM", available: false, period: "evening" },
  { id: 11, time: "04:00 PM - 05:00 PM", available: true, period: "evening" },
  { id: 12, time: "05:00 PM - 06:00 PM", available: true, period: "evening" },
  { id: 13, time: "06:00 PM - 07:00 PM", available: true, period: "evening" },
  { id: 14, time: "07:00 PM - 08:00 PM", available: false, period: "evening" },
  { id: 15, time: "08:00 PM - 09:00 PM", available: true, period: "evening" },
  { id: 16, time: "09:00 PM - 10:00 PM", available: true, period: "evening" },
  { id: 17, time: "10:00 PM - 11:00 PM", available: true, period: "evening" },
  { id: 18, time: "11:00 PM - 12:00 AM", available: true, period: "evening" },
];

// Base price and booking fee
const HOURLY_RATE = 600;
const BOOKING_FEE = 100;

export default function BookingPage() {
  const router = useRouter();
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    players: "5",
    notes: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // Reset selected slots when date changes
    setSelectedSlots([]);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Function to check if a slot can be selected
  const canSelectSlot = (slotId: number) => {
    // If no slots are selected yet, any available slot can be selected
    if (selectedSlots.length === 0) {
      return timeSlots.find((slot) => slot.id === slotId)?.available || false;
    }

    // Sort the currently selected slots
    const sortedSlots = [...selectedSlots].sort((a, b) => a - b);

    // Check if the slot is adjacent to the current selection
    const isAdjacent =
      slotId === sortedSlots[0] - 1 || // Adjacent to the first selected slot
      slotId === sortedSlots[sortedSlots.length - 1] + 1; // Adjacent to the last selected slot

    // If trying to select a slot that's not adjacent, show a warning
    if (!isAdjacent) {
      toast({
        title: "Selection Error",
        description: "You can only select consecutive time slots",
        variant: "destructive",
      });
      return false;
    }

    // Check if the slot is available
    return timeSlots.find((slot) => slot.id === slotId)?.available || false;
  };

  const handleSlotSelect = (slotId: number) => {
    // If the slot is already selected, remove it
    if (selectedSlots.includes(slotId)) {
      // Check if removing this slot would break the consecutive sequence
      const newSelection = selectedSlots.filter((id) => id !== slotId);

      if (newSelection.length <= 1) {
        // If only 0 or 1 slot remains, it's always valid
        setSelectedSlots(newSelection);
        return;
      }

      // Sort the remaining slots
      const sortedNewSelection = [...newSelection].sort((a, b) => a - b);

      // Check if the remaining slots are still consecutive
      let isConsecutive = true;
      for (let i = 1; i < sortedNewSelection.length; i++) {
        if (sortedNewSelection[i] !== sortedNewSelection[i - 1] + 1) {
          isConsecutive = false;
          break;
        }
      }

      if (!isConsecutive) {
        toast({
          title: "Selection Error",
          description:
            "Removing this slot would break the consecutive sequence",
          variant: "destructive",
        });
        return;
      }

      setSelectedSlots(newSelection);
    } else {
      // Check if the slot can be selected
      if (canSelectSlot(slotId)) {
        setSelectedSlots([...selectedSlots, slotId]);
      }
    }
  };

  const handleNextStep = () => {
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a unique booking ID
    const bookingId = `ZT-${Date.now()
      .toString(36)
      .toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    // Create booking data to pass to confirmation page
    const bookingData = {
      id: bookingId,
      date: format(new Date(date), "PPP"),
      timeSlot: getSelectedSlotTimes(),
      duration: selectedSlots.length,
      hourlyRate: HOURLY_RATE,
      onlinePayment: calculateTotalPrice(true, true),
      remainingPayment: calculateRemainingAmount(true),
      totalAmount: calculateTotalPrice(true),
      ...formData,
    };

    // Store booking data in localStorage to access it on the confirmation page
    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    // Navigate to confirmation page
    router.push("/booking/confirmation");
  };

  // Calculate total price based on number of selected slots
  const calculateTotalPrice = (numeric = false, onlineOnly = false) => {
    const hourlyRate = HOURLY_RATE; // 600 per hour
    const onlineBookingFee = BOOKING_FEE; // 100 per hour (paid online)
    const numberOfSlots = selectedSlots.length;

    if (numberOfSlots === 0) return numeric ? 0 : "₹0";

    if (onlineOnly) {
      // Only the online booking fee portion
      return numeric
        ? onlineBookingFee * numberOfSlots
        : `₹${onlineBookingFee * numberOfSlots}`;
    }

    // Total price
    const total = hourlyRate * numberOfSlots;
    return numeric ? total : `₹${total}`;
  };

  // Calculate remaining amount to be paid at venue
  const calculateRemainingAmount = (numeric = false) => {
    const totalPrice = calculateTotalPrice(true);
    const onlinePayment = calculateTotalPrice(true, true);
    const remainingAmount = totalPrice - onlinePayment;

    return numeric ? remainingAmount : `₹${remainingAmount}`;
  };

  // Get selected slot times for display
  const getSelectedSlotTimes = () => {
    if (selectedSlots.length === 0) return "Not selected";

    // Sort the slots
    const sortedSlots = [...selectedSlots].sort((a, b) => a - b);

    // Get the first and last slot
    const firstSlot = timeSlots.find((slot) => slot.id === sortedSlots[0]);
    const lastSlot = timeSlots.find(
      (slot) => slot.id === sortedSlots[sortedSlots.length - 1]
    );

    if (!firstSlot || !lastSlot) return "Not selected";

    // Extract just the start time from the first slot and end time from the last slot
    const startTime = firstSlot.time.split(" - ")[0];
    const endTime = lastSlot.time.split(" - ")[1];

    return `${startTime} - ${endTime}`;
  };

  // Filter slots based on active tab
  const filteredSlots = timeSlots.filter(
    (slot) => activeTab === "all" || slot.period === activeTab
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="p-4">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4">
            Book Your Slot
          </h1>
          <p className="text-gray-600 mt-2">
            Select your preferred date and time to book the football turf
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {/* Booking Steps */}
          <div>
            <Card className="border-none shadow-lg rounded-none sm:rounded-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Booking Details</CardTitle>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
                        bookingStep >= 1
                          ? "bg-primary text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      1
                    </div>
                    <div
                      className={`w-6 sm:w-12 h-1 ${
                        bookingStep >= 2 ? "bg-primary" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
                        bookingStep >= 2
                          ? "bg-primary text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      2
                    </div>
                    <div
                      className={`w-6 sm:w-12 h-1 ${
                        bookingStep >= 3 ? "bg-primary" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
                        bookingStep >= 3
                          ? "bg-primary text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      3
                    </div>
                  </div>
                </div>
                <CardDescription>
                  {bookingStep === 1 &&
                    "Select your preferred date and time slots"}
                  {bookingStep === 2 && "Enter your personal details"}
                  {bookingStep === 3 && "Review and confirm your booking"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Step 1: Date and Time Selection */}
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="date-picker">Select Date</Label>
                      <div className="grid grid-cols-1 gap-4">
                        <Input
                          id="date-picker"
                          type="date"
                          value={date}
                          onChange={handleDateChange}
                          min={format(new Date(), "yyyy-MM-dd")}
                          className="w-full"
                        />

                        <Tabs
                          defaultValue="all"
                          value={activeTab}
                          onValueChange={handleTabChange}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="morning">Morning</TabsTrigger>
                            <TabsTrigger value="evening">Evening</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Select Time Slots</Label>
                        <span className="text-sm text-gray-500">
                          {selectedSlots.length} slot
                          {selectedSlots.length !== 1 ? "s" : ""} selected
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <p>• Hourly rate: ₹600 per hour</p>
                        <p>• Online booking fee: ₹100 per hour (paid now)</p>
                        <p>
                          • Remaining amount to be paid at venue: ₹500 per hour
                        </p>
                        <p>• You can select multiple consecutive slots</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {filteredSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={cn(
                              "border rounded-md p-2 sm:p-3 cursor-pointer transition-all",
                              slot.available
                                ? selectedSlots.includes(slot.id)
                                  ? "border-primary bg-primary/10"
                                  : "hover:border-primary hover:bg-primary/5"
                                : "opacity-50 cursor-not-allowed bg-gray-100",
                              "relative"
                            )}
                            onClick={() =>
                              slot.available && handleSlotSelect(slot.id)
                            }
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
                                <span className="font-medium text-sm">
                                  {slot.time}
                                </span>
                              </div>
                              {selectedSlots.includes(slot.id) && (
                                <CheckCircle className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            {!slot.available && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-md">
                                <span className="text-xs sm:text-sm font-medium text-red-500">
                                  Booked
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Details */}
                {bookingStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="players">Number of Players</Label>
                        <Select
                          value={formData.players}
                          onValueChange={(value) =>
                            handleSelectChange(value, "players")
                          }
                        >
                          <SelectTrigger id="players">
                            <SelectValue placeholder="Select number of players" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Players</SelectItem>
                            <SelectItem value="6">6 Players</SelectItem>
                            <SelectItem value="7">7 Players</SelectItem>
                            <SelectItem value="8">8 Players</SelectItem>
                            <SelectItem value="9">9 Players</SelectItem>
                            <SelectItem value="10">10 Players</SelectItem>
                            <SelectItem value="11">11 Players</SelectItem>
                            <SelectItem value="12">12 Players</SelectItem>
                            <SelectItem value="13">13 Players</SelectItem>
                            <SelectItem value="14">14 Players</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Special Requests (Optional)</Label>
                      <Input
                        id="notes"
                        name="notes"
                        placeholder="Any special requests or notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review and Confirm */}
                {bookingStep === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Booking Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {date
                              ? format(new Date(date), "PPP")
                              : "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Slot:</span>
                          <span className="font-medium">
                            {getSelectedSlotTimes()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {selectedSlots.length} hour
                            {selectedSlots.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Players:</span>
                          <span className="font-medium">
                            {formData.players}
                          </span>
                        </div>
                        {formData.notes && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Notes:</span>
                            <span className="font-medium">
                              {formData.notes}
                            </span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Turf Fee:</span>
                          <span className="font-medium">
                            {calculateTotalPrice()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Online Payment (Now):
                          </span>
                          <span className="font-medium">
                            {calculateTotalPrice(false, true)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Remaining (At Venue):
                          </span>
                          <span className="font-medium">
                            {calculateRemainingAmount()}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg mt-2">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="font-bold text-primary">
                            {calculateTotalPrice()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            className="h-5 w-5 text-yellow-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Important Information
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                Please arrive 15 minutes before your slot time
                              </li>
                              <li>
                                Booking cancellation must be done 4 hours prior
                                to the slot time
                              </li>
                              <li>
                                Payment must be made at the venue before the
                                game
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                {bookingStep > 1 ? (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                ) : (
                  <Link href="/">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                )}
                {bookingStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (bookingStep === 1 && selectedSlots.length === 0) ||
                      (bookingStep === 2 &&
                        (!formData.name || !formData.email || !formData.phone))
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Confirm Booking
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Booking Summary Card */}
          <div>
            <Card className="border-none shadow-lg rounded-none sm:rounded-lg">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-gray-600">Date</span>
                  </div>
                  <span className="font-medium">
                    {date ? format(new Date(date), "PPP") : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-gray-600">Time</span>
                  </div>
                  <span className="font-medium">{getSelectedSlotTimes()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-gray-600">Players</span>
                  </div>
                  <span className="font-medium">{formData.players}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-600">Duration</span>
                  </div>
                  <span className="font-medium">
                    {selectedSlots.length} hour
                    {selectedSlots.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-primary" />
                      <span className="font-semibold">Pay Now</span>
                    </div>
                    <span className="font-medium">
                      {calculateTotalPrice(false, true)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <div className="flex items-center">
                      <span className="font-semibold">Total</span>
                    </div>
                    <span className="font-bold text-primary">
                      {calculateTotalPrice()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
