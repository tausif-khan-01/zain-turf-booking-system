import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getSlotEndTime } from "@/utils/getEndTime";
import api from "@/utils/api";
import { format } from "date-fns";

interface TimeSlot {
  id: number;
  startTime: string;
  isBooked: boolean;
  available: boolean;
  time: string;
}

interface BookedSlot {
  startTime: string;
  duration: number;
}

type TimeOfDay = "all" | "early-morning" | "morning" | "afternoon" | "evening";

interface TimeSlotSelectorProps {
  date: string;
  selectedSlots: { id: number; startTime: string }[];
  onDateChange: (date: string) => void;
  onSlotSelect: (slotId: number, startTime: string) => void;
}

function SkeletonTimeSlot() {
  return (
    <div className="border rounded-md p-2 sm:p-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function TimeSlotSelector({
  date,
  selectedSlots,
  onDateChange,
  onSlotSelect,
}: TimeSlotSelectorProps) {
  const [activeTab, setActiveTab] = useState<TimeOfDay>("all");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (value: TimeOfDay) => {
    setActiveTab(value);
  };

  const fetchBookedSlots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/booking/slots`, {
        params: {
          date: format(new Date(date), "yyyy-MM-dd"),
        },
      });
      setBookedSlots(response.data.bookedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      setError("Failed to load time slots. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedSlots();
  }, [date]);

  const generateTimeSlots = useCallback(
    (start: number, end: number): TimeSlot[] => {
      const timeSlots: TimeSlot[] = [];
      let hour = start;

      while (hour < end) {
        const amPm = hour < 12 ? "AM" : "PM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const timeString = `${displayHour}:00 ${amPm}`;

        // Check if the slot is booked
        const isBooked = bookedSlots.some((bookedSlot) => {
          const [bookedHour] = bookedSlot.startTime.split(":");
          const bookedHourNum = parseInt(bookedHour);
          const isPM = bookedSlot.startTime.includes("PM");
          const bookedTime =
            bookedHourNum + (isPM && bookedHourNum !== 12 ? 12 : 0);

          // Check if current hour falls within any booked slot's duration
          return hour >= bookedTime && hour < bookedTime + bookedSlot.duration;
        });

        // Check if slot is in the past for today's date
        const isToday =
          new Date(date).toDateString() === new Date().toDateString();
        const currentHour = new Date().getHours();
        const isPastTime = isToday && hour <= currentHour;

        if (isPastTime) {
          hour++;
          continue;
        }

        const timeSlot: TimeSlot = {
          id: hour,
          startTime: timeString,
          isBooked: isBooked,
          available: !isBooked,
          time: timeString,
        };

        timeSlots.push(timeSlot);
        hour++;
      }

      return timeSlots;
    },
    [date, bookedSlots]
  );

  const filteredTimeSlots = useMemo(() => {
    const allSlots = generateTimeSlots(0, 24);

    switch (activeTab) {
      case "early-morning":
        return generateTimeSlots(0, 6);
      case "morning":
        return generateTimeSlots(6, 12);
      case "afternoon":
        return generateTimeSlots(12, 18);
      case "evening":
        return generateTimeSlots(18, 23);
      default:
        return allSlots;
    }
  }, [activeTab, generateTimeSlots]);

  // if (!isLoading) {
  //   return (
  //     <div className="space-y-4">
  //       <div className="flex gap-2">
  //         {["all", "morning", "afternoon", "evening"].map((tab) => (
  //           <SkeletonTimeSlot key={tab} />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-red-500">{error || "Failed to load time slots"}</p>
        <button
          onClick={fetchBookedSlots}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date-picker">Select Date</Label>
        <div className="grid grid-cols-1 gap-4">
          <Input
            id="date-picker"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full"
          />

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as TimeOfDay)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="early-morning" className="hidden sm:block">
                Early Morning
              </TabsTrigger>
              <TabsTrigger value="early-morning" className="sm:hidden">
                E.M
              </TabsTrigger>
              <TabsTrigger value="morning" className="hidden sm:block">
                Morning
              </TabsTrigger>
              <TabsTrigger value="morning" className="sm:hidden">
                Morn
              </TabsTrigger>
              <TabsTrigger value="afternoon" className="hidden sm:block">
                Afternoon
              </TabsTrigger>
              <TabsTrigger value="afternoon" className="sm:hidden">
                Noon
              </TabsTrigger>
              <TabsTrigger value="evening" className="hidden sm:block">
                Evening
              </TabsTrigger>
              <TabsTrigger value="evening" className="sm:hidden">
                Eve
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Select Time Slots</Label>
          <span className="text-sm text-gray-500">
            {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <p>• Hourly rate: ₹600 per hour</p>
          <p>• Online booking fee: ₹100 per hour (paid now)</p>
          <p>• Remaining amount to be paid at venue: ₹500 per hour</p>
          <p>• You can select multiple consecutive slots</p>
        </div>
        {!isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredTimeSlots.map((slot) => (
              <div
                key={slot.id}
                className={cn(
                  "border rounded-md p-2 sm:p-3 cursor-pointer transition-all",
                  slot.available
                    ? selectedSlots.some((s) => s.id === slot.id)
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary hover:bg-primary/5"
                    : "cursor-not-allowed bg-destructive/10 border-destructive",
                  "relative"
                )}
                onClick={() =>
                  slot.available && onSlotSelect(slot.id, slot.time)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
                    <span className="font-medium text-sm">
                      {slot.time} - {getSlotEndTime(slot.time, 1)}
                    </span>
                  </div>
                  {selectedSlots.some((s) => s.id === slot.id) && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
                {!slot.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-md">
                    <span className="text-xs sm:text-sm font-medium text-red-500">
                      {slot.isBooked ? "Booked" : "Not Available"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // skeleton time slots
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonTimeSlot key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
