import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { getSlotEndTime } from "@/utils/getEndTime";
import {
  formatBookingDate,
  calculateTotalPrice,
  calculateRemainingAmount,
} from "@/utils/bookingUtils";

// interface BookingConfirmationProps {
//   date: string;
//   selectedSlots: SelectedSlotInfo[];
//   formData: {
//     name: string;
//     phone: string;
//   };
// }

export function BookingConfirmation({ date, selectedSlots, formData }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-lg mb-3 text-card-foreground">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium text-card-foreground">
              {date ? formatBookingDate(date) : "Not selected"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time Slot:</span>
            <span className="font-medium text-card-foreground">
              {selectedSlots[0].startTime} -{" "}
              {getSlotEndTime(selectedSlots[0].startTime, selectedSlots.length)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium text-card-foreground">
              {selectedSlots.length} hour{selectedSlots.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Separator className="bg-border" />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium text-card-foreground">{formData.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium text-card-foreground">{formData.phone}</span>
          </div>

          <Separator className="bg-border" />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Turf Fee:</span>
            <span className="font-medium text-card-foreground">
              {calculateTotalPrice(selectedSlots)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Advance Payment (Now):</span>
            <span className="font-medium text-card-foreground">
              {calculateTotalPrice(selectedSlots, false, true)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining (At Venue):</span>
            <span className="font-medium text-card-foreground">
              {calculateRemainingAmount(selectedSlots)}
            </span>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <span className="font-semibold text-card-foreground">Total Amount:</span>
            <span className="font-bold text-primary">
              {calculateTotalPrice(selectedSlots)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="h-5 w-5 text-accent"
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
            <h3 className="text-sm font-medium text-accent-foreground">
              Important Information
            </h3>
            <div className="mt-2 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Please arrive 15 minutes before your slot time</li>
                <li>
                  Booking cancellation must be done 4 hours prior to the slot
                  time
                </li>
                <li>Payment must be made at the venue before the game</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
