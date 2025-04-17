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
    email: string;
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

export default function PaymentButton({
  amount,
  currency = "INR",
  children,
}: {
  amount: number;
  currency?: string;
  children: React.ReactNode;
}) {
  const handlePayment = async () => {
    // create order
    const response = await api.post("/payment/create-order", {
      amount,
      currency,
    });

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
        const verifyResponse = await api.post("/payment/verify-payment", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyResponse.status !== 200) {
          throw new Error("Failed to verify payment");
        }

        const { payment } = verifyResponse.data;

        console.log(payment);

        // update booking status
        const updateResponse = await api.put(`/booking`, {
          status: "paid",
        });

        if (updateResponse.status !== 200) {
          throw new Error("Failed to update booking status");
        }

        const { booking } = updateResponse.data;

        console.log(booking);
      },
      prefill: {
        name: "Zain Turf",
        email: "zain@zainturf.com",
        contact: "9876543210",
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
  return (
    <Button
      variant="outline"
      className="bg-primary text-white"
      onClick={handlePayment}
    >
      {children}
    </Button>
  );
}
