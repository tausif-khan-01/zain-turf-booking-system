"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, Clock, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Available time slots
const timeSlots = [
  { id: 1, time: "06:00 AM - 07:00 AM", available: true, price: "₹800" },
  { id: 2, time: "07:00 AM - 08:00 AM", available: true, price: "₹800" },
  { id: 3, time: "08:00 AM - 09:00 AM", available: true, price: "₹800" },
  { id: 4, time: "09:00 AM - 10:00 AM", available: false, price: "₹800" },
  { id: 5, time: "10:00 AM - 11:00 AM", available: true, price: "₹800" },
  { id: 6, time: "11:00 AM - 12:00 PM", available: true, price: "₹800" },
  { id: 7, time: "12:00 PM - 01:00 PM", available: true, price: "₹1000" },
  { id: 8, time: "01:00 PM - 02:00 PM", available: true, price: "₹1000" },
  { id: 9, time: "02:00 PM - 03:00 PM", available: true, price: "₹1000" },
  { id: 10, time: "03:00 PM - 04:00 PM", available: false, price: "₹1000" },
  { id: 11, time: "04:00 PM - 05:00 PM", available: true, price: "₹1000" },
  { id: 12, time: "05:00 PM - 06:00 PM", available: true, price: "₹1200" },
  { id: 13, time: "06:00 PM - 07:00 PM", available: true, price: "₹1200" },
  { id: 14, time: "07:00 PM - 08:00 PM", available: false, price: "₹1200" },
  { id: 15, time: "08:00 PM - 09:00 PM", available: true, price: "₹1200" },
  { id: 16, time: "09:00 PM - 10:00 PM", available: true, price: "₹1200" },
  { id: 17, time: "10:00 PM - 11:00 PM", available: true, price: "₹1000" },
  { id: 18, time: "11:00 PM - 12:00 AM", available: true, price: "₹1000" },
]

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    players: "5",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId)
  }

  const handleNextStep = () => {
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the booking data to your backend
    alert("Booking submitted successfully!")
    // Reset form or redirect to confirmation page
  }

  const selectedSlotData = selectedSlot ? timeSlots.find((slot) => slot.id === selectedSlot) : null

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Book Your Slot</h1>
          <p className="text-gray-600 mt-2">Select your preferred date and time to book the football turf</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Steps */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Booking Details</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
                    >
                      1
                    </div>
                    <div className={`w-12 h-1 ${bookingStep >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
                    >
                      2
                    </div>
                    <div className={`w-12 h-1 ${bookingStep >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
                    >
                      3
                    </div>
                  </div>
                </div>
                <CardDescription>
                  {bookingStep === 1 && "Select your preferred date and time slot"}
                  {bookingStep === 2 && "Enter your personal details"}
                  {bookingStep === 3 && "Review and confirm your booking"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Step 1: Date and Time Selection */}
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Select Date</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                          </PopoverContent>
                        </Popover>

                        <Tabs defaultValue="all">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="morning">Morning</TabsTrigger>
                            <TabsTrigger value="evening">Evening</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Time Slot</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={cn(
                              "border rounded-md p-3 cursor-pointer transition-all",
                              slot.available
                                ? selectedSlot === slot.id
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary hover:bg-primary/5"
                                : "opacity-50 cursor-not-allowed bg-gray-100",
                              "relative",
                            )}
                            onClick={() => slot.available && handleSlotSelect(slot.id)}
                          >
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-primary" />
                              <span className="font-medium">{slot.time}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">{slot.price}</div>
                            {!slot.available && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-md">
                                <span className="text-sm font-medium text-red-500">Booked</span>
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          onValueChange={(value) => handleSelectChange(value, "players")}
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
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{date ? format(date, "PPP") : "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Slot:</span>
                          <span className="font-medium">{selectedSlotData?.time || "Not selected"}</span>
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
                          <span className="font-medium">{formData.players}</span>
                        </div>
                        {formData.notes && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Notes:</span>
                            <span className="font-medium">{formData.notes}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="font-bold text-primary">{selectedSlotData?.price || "₹0"}</span>
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
                          <h3 className="text-sm font-medium text-yellow-800">Important Information</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Please arrive 15 minutes before your slot time</li>
                              <li>Booking cancellation must be done 4 hours prior to the slot time</li>
                              <li>Payment must be made at the venue before the game</li>
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
                      (bookingStep === 1 && !selectedSlot) ||
                      (bookingStep === 2 && (!formData.name || !formData.email || !formData.phone))
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                    Confirm Booking
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                      <span className="text-gray-600">Date</span>
                    </div>
                    <span className="font-medium">{date ? format(date, "PPP") : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary" />
                      <span className="text-gray-600">Time</span>
                    </div>
                    <span className="font-medium">{selectedSlotData?.time || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      <span className="text-gray-600">Players</span>
                    </div>
                    <span className="font-medium">{formData.players}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-primary" />
                      <span className="font-semibold">Total</span>
                    </div>
                    <span className="font-bold text-primary">{selectedSlotData?.price || "₹0"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    If you have any questions or need assistance with your booking, please contact us:
                  </p>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-primary mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>+91-1234567890</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-primary mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>booking@zainturf.com</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
