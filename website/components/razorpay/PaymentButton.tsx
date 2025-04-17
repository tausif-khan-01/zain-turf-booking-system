import config from "@/lib/config";
import { Button } from "../ui/button";
import api from "@/utils/api";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;

    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayError) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface Booking {
  date: string;
  startTime: string;
  duration: number;
  customer: {
    name: string;
    contact: string;
  };
}

export default function PaymentButton({
  bookingInfo,
  amount,
  onSuccess,
  children,
}: {
  bookingInfo: Booking;
  amount: number;
  onSuccess: (bookingId: string) => void;
  children: React.ReactNode;
}) {
  const handlePayment = async () => {
    if (!amount) {
      throw new Error("Amount is required");
    }

    // create order
    const response = await api.post("/booking/create-order", {
      amount,
    });

    console.log("success");

    if (response.status !== 200) {
      throw new Error("Failed to create order");
    }

    const { order } = response.data;

    const options: RazorpayOptions = {
      key: config.razorpay.key,
      amount: order.amount,
      currency: order.currency,
      name: "Zain Turf",
      description: "Payment for your booking",
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        // verify payment
        const verifyResponse = await api.post(
          "/booking/verify-payment-and-book",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            booking: bookingInfo,
          }
        );

        if (verifyResponse.status !== 200) {
          throw new Error("Failed to verify payment");
        }

        const { bookingId } = verifyResponse.data;

        // update booking status
        await onSuccess(bookingId);
      },
      prefill: {
        name: bookingInfo.customer.name,
        contact: bookingInfo.customer.contact,
      },
      theme: {
        color: "#05df72",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

    razorpay.on("payment.failed", function (response: RazorpayError) {
      console.log(response);
    });
  };
  return <Button onClick={handlePayment}>{children}</Button>;
}
