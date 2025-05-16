import { format } from "date-fns";

// Constants
export const HOURLY_RATE = 600;
export const BOOKING_FEE = 100;

// Types
// export interface SelectedSlotInfo {
//   id: number;
//   startTime: string;
// }

// export interface FormData {
//   name: string;
//   phone: string;
//   players: string;
//   notes: string;
// }

// Utility Functions
export const calculateTotalPrice = (
  selectedSlots,
  numeric = false,
  onlineOnly = false
) => {
  const numberOfSlots = selectedSlots.length;
  if (numberOfSlots === 0) return numeric ? 0 : "₹0";

  if (onlineOnly) {
    return numeric
      ? BOOKING_FEE * numberOfSlots
      : `₹${BOOKING_FEE * numberOfSlots}`;
  }

  const total = HOURLY_RATE * numberOfSlots;
  return numeric ? total : `₹${total}`;
};

export const calculateAdvanceAmount = (duration) => {
  return BOOKING_FEE * duration;
};

// calculate razorpay transaction fee 2% of advance amount
export const calculateRazorpayTransactionFee = (slots, numeric = false) => {
  const total = BOOKING_FEE * slots * 0.02;

  const gst = total * 0.18;

  const totalAmount = total + gst;

  return numeric ? totalAmount : `₹${totalAmount}`;
};

export const calculateRemainingAmount = (selectedSlots, numeric = false) => {
  const totalPrice = calculateTotalPrice(selectedSlots, true);
  const onlinePayment = calculateTotalPrice(selectedSlots, true, true);
  const remainingAmount = totalPrice - onlinePayment;
  return numeric ? remainingAmount : `₹${remainingAmount}`;
};

export const generateBookingId = () => {
  return `ZT-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;
};

export const formatBookingDate = (date) => {
  return format(new Date(date), "MMMM d, yyyy");
};
