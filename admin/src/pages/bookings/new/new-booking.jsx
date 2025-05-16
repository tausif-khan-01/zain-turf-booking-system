import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { calculateAdvanceAmount } from "@/utils/bookingUtils";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { BookingSteps } from "./components/BookingSteps";
import { PersonalDetailsForm } from "./components/PersonalDetailsForm";
import { TimeSlotSelector } from "./components/TimeSlotSelector";
import { toast } from "sonner";
import { BookingSummary } from "./components/BookingSummary";

export default function BookingPage() {
  //   const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    players: "5",
    notes: "",
  });

  const handleInputChange = ({ field, value }) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedSlots([]);
  };

  const handleSlotSelect = (slotId, startTime) => {
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
        // toast({
        //   title: "Selection Error",
        //   description:
        //     "Removing this slot would break the consecutive sequence",
        //   variant: "destructive",
        // });
        toast.error("Removing this slot would break the consecutive sequence");
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
        toast.error("You can only select consecutive time slots");
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

  const handleSubmit = (data) => {
    console.log(data);
    // router.push(`/receipt/${bookingId}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-0! sm:px-4">
        <div className="p-4">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 text-foreground">
            Book Your Slot
          </h1>
          <p className="text-muted-foreground mt-2">
            Select your preferred date and time to book the turf
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:flex md:items-start sm:gap-8">
          <div className="w-full">
            <Card className="border-border shadow-lg rounded-none sm:rounded-lg bg-card">
              <BookingSteps currentStep={bookingStep} />

              <CardContent className="text-card-foreground">
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

              <CardFooter className="flex justify-between border-t border-border">
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
                  <Button
                    onClick={() =>
                      handleSubmit({
                        amount: calculateAdvanceAmount(selectedSlots.length),
                        customer: {
                          name: formData.name,
                          contact: formData.phone,
                        },
                        date,
                        startTime: selectedSlots[0].startTime,
                        duration: selectedSlots.length,
                      })
                    }
                  >
                    Pay Advance & Complete Booking
                  </Button>
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
