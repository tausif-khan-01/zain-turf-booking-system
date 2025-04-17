import Script from "next/script";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      {children}
    </>
  );
}
