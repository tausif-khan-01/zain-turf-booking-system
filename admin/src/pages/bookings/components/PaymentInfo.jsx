import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingFinanceInfo } from "../api";
import { Skeleton } from "@/components/ui/skeleton";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export function PaymentInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Track payments for this booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>

          <Separator />

          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentInfo() {
  const { id } = useParams();
  // const { data, isLoading } = useQuery({
  //   queryKey: ["bookings", id],
  //   queryFn: () => getBookingFinanceInfo(id),
  //   enabled: !!id,
  // });

  // const booking = data?.booking;

  // sample data
  const booking = {
    amount: 1000,
    paid: 500,
    remaining: 500,

    transactions: [
      {
        amount: 500,
        method: "cash",
        date: "2021-01-01",
      },
      {
        amount: 500,
        method: "cash",
        date: "2021-01-01",
      },
    ],
  };
  // if (isLoading) {
  //   // TODO: Add skeleton
  //   return <PaymentInfoSkeleton />;
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Track payments for this booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold">₹{booking.amount}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Paid Amount</p>
              <p className="text-xl font-bold text-green-600">
                ₹{booking.paid}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Remaining Amount</p>
              <p className="text-xl font-bold text-amber-600">
                ₹{booking.remaining}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Payment History</h3>

            <div className="space-y-2">
              {booking.transactions.map((transaction) => (
                <div key={transaction.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Booking Fee</p>
                      <p className="text-sm text-gray-500">
                        {transaction.date} • {transaction.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{transaction.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {booking.remaining > 0 && (
            <AddPayment remaining={booking.remaining} bookingId={id} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const AddPayment = ({ remaining, bookingId }) => {
  const schema = yup.object().shape({
    amount: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(1, "Amount cannot be less than 1")
      .max(remaining, "Amount cannot be greater than remaining amount")
      .required("Amount is required"),
    method: yup.string().required("Payment method is required"),
  });

  const form = useForm({
    resolver: yupResolver(schema),
  });

  const onPaymentSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Record Payment</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onPaymentSubmit)}
          className="space-y-3"
        >
          <div className="flex flex-col md:flex-row gap-2 *:flex-1">
            <div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="payment-amount">
                      Payment Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="payment-amount"
                        placeholder="Enter amount"
                        type="number"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Method   */}
            <div>
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem className="w-full mt-auto">
                    <FormLabel htmlFor="payment-method">
                      Payment Method
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="payment-method" className="w-full ">
                          <SelectValue placeholder="Select payment method " />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-auto w-full">
              <Button type="submit" className="w-full">
                Record Payment
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
