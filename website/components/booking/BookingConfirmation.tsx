import { Separator } from "@/components/ui/separator";
import { getSlotEndTime } from "@/utils/getEndTime";
import { formatBookingDate, calculateTotalPrice, calculateRemainingAmount, type SelectedSlotInfo } from "@/utils/bookingUtils";

interface BookingConfirmationProps {
  date: string;
  selectedSlots: SelectedSlotInfo[];
  formData: {
    name: string;
    phone: string;
  };
}

export function BookingConfirmation({
  date,
  selectedSlots,
  formData,
}: BookingConfirmationProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {date ? formatBookingDate(date) : "Not selected"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Slot:</span>
            <span className="font-medium">
              {selectedSlots[0].startTime} -{" "}
              {getSlotEndTime(selectedSlots[0].startTime, selectedSlots.length)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">
              {selectedSlots.length} hour{selectedSlots.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{formData.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>

          <Separator />
          <div className="flex justify-between">
            <span className="text-gray-600">Total Turf Fee:</span>
            <span className="font-medium">{calculateTotalPrice(selectedSlots)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Online Payment (Now):</span>
            <span className="font-medium">
              {calculateTotalPrice(selectedSlots, false, true)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining (At Venue):</span>
            <span className="font-medium">{calculateRemainingAmount(selectedSlots)}</span>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-bold text-primary">
              {calculateTotalPrice(selectedSlots)}
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
