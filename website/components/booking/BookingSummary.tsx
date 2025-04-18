import { Card, CardContent } from "@/components/ui/card";
import {
  calculateTotalPrice,
  formatBookingDate,
  type SelectedSlotInfo,
} from "@/utils/bookingUtils";
import { getSlotEndTime } from "@/utils/getEndTime";

interface BookingSummaryProps {
  date: string;
  selectedSlots: SelectedSlotInfo[];
}

export function BookingSummary({ date, selectedSlots }: BookingSummaryProps) {
  const startTime = selectedSlots?.[0]?.startTime || null;
  const endTime =
    startTime &&
    getSlotEndTime(selectedSlots?.[0]?.startTime, selectedSlots.length);
  return (
    <Card className="border-none shadow-lg rounded-none sm:rounded-lg min-w-xs">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Booking Summary</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{formatBookingDate(date)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time Slots</span>
            <div className="text-right">
              <div className="font-medium">
                {startTime && endTime
                  ? `${startTime} - ${endTime}`
                  : "Not selected"}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">
              {selectedSlots.length} hour{selectedSlots.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-medium">
              {calculateTotalPrice(selectedSlots)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
