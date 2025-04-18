import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { getSlotEndTime } from "@/utils/getEndTime";

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

export function TimeSlotSelector({
  date,
  selectedSlots,
  onDateChange,
  onSlotSelect,
}: TimeSlotSelectorProps) {
  const [activeTab, setActiveTab] = useState<TimeOfDay>("all");

  const handleTabChange = (value: TimeOfDay) => {
    setActiveTab(value);
  };

  // Mock booked slots from backend - replace with actual API call
  const bookedSlots: BookedSlot[] = [
    {
      startTime: "10:00 AM",
      duration: 2,
    },
    {
      startTime: "12:00 PM",
      duration: 1,
    },
  ];

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
              onClick={() => slot.available && onSlotSelect(slot.id, slot.time)}
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
      </div>
    </div>
  );
}
