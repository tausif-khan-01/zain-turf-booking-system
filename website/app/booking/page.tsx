"use client";

import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { PersonalDetailsForm } from "@/components/booking/PersonalDetailsForm";
import { TimeSlotSelector } from "@/components/booking/TimeSlotSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSlotEndTime } from "@/utils/getEndTime";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type FormData,
  type SelectedSlotInfo,
  calculateTotalPrice,
  calculateRemainingAmount,
  generateBookingId,
  calculateAdvanceAmount,
} from "@/utils/bookingUtils";
import PaymentButton from "@/components/razorpay/PaymentButton";

export default function BookingPage() {
  const router = useRouter();
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlotInfo[]>([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    players: "5",
    notes: "",
  });
  const { toast } = useToast();

  const handleInputChange = ({
    field,
    value,
  }: {
    field: string;
    value: string;
  }) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedSlots([]);
  };

  const handleSlotSelect = (slotId: number, startTime: string) => {
    if (selectedSlots.some((slot) => slot.id === slotId)) {
      // Remove slot if already selected
      const newSelection = selectedSlots.filter((slot) => slot.id !== slotId);

      // If only 0 or 1 slot remains, allow removal
      if (newSelection.length <= 1) {
        setSelectedSlots(newSelection);
        return;
      }

      // Check if remaining slots are consecutive
      const sortedNewSelection = [...newSelection].sort((a, b) => a.id - b.id);
      let isConsecutive = true;
      for (let i = 1; i < sortedNewSelection.length; i++) {
        if (sortedNewSelection[i].id !== sortedNewSelection[i - 1].id + 1) {
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
      // Add new slot
      const newSelection = [...selectedSlots, { id: slotId, startTime }].sort(
        (a, b) => a.id - b.id
      );

      // Check if selection is consecutive
      let isConsecutive = true;
      for (let i = 1; i < newSelection.length; i++) {
        if (newSelection[i].id !== newSelection[i - 1].id + 1) {
          isConsecutive = false;
          break;
        }
      }

      if (!isConsecutive) {
        toast({
          title: "Selection Error",
          description: "You can only select consecutive time slots",
          variant: "destructive",
        });
        return;
      }

      setSelectedSlots(newSelection);
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

  const handleSubmit = (bookingId: string) => {
    router.push(`/booking/confirmation?bookingId=${bookingId}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-0! sm:px-4">
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
            Select your preferred date and time to book the turf
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          <div>
            <Card className="border-none shadow-lg rounded-none sm:rounded-lg">
              <BookingSteps currentStep={bookingStep} />

              <CardContent>
                {bookingStep === 1 && (
                  <TimeSlotSelector
                    date={date}
                    selectedSlots={selectedSlots}
                    onDateChange={handleDateChange}
                    onSlotSelect={handleSlotSelect}
                  />
                )}

                {bookingStep === 2 && (
                  <PersonalDetailsForm
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                )}

                {bookingStep === 3 && (
                  <BookingConfirmation
                    date={date}
                    selectedSlots={selectedSlots}
                    formData={formData}
                  />
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
                      (bookingStep === 2 && (!formData.name || !formData.phone))
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <PaymentButton
                    amount={calculateAdvanceAmount(selectedSlots.length)}
                    onSuccess={handleSubmit}
                    bookingInfo={{
                      customer: {
                        name: formData.name,
                        contact: formData.phone,
                      },
                      date,
                      startTime: selectedSlots[0].startTime,
                      duration: selectedSlots.length,
                    }}
                  >
                    Pay Advance & Complete Booking
                  </PaymentButton>
                )}
              </CardFooter>
            </Card>
          </div>

          {bookingStep !== 3 && (
            <BookingSummary date={date} selectedSlots={selectedSlots} />
          )}
        </div>
      </div>
    </main>
  );
}
