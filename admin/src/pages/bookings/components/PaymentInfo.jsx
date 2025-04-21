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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookingFinanceInfo, addPayment } from "../api";
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
import { toast } from "sonner";

export function PaymentInfoSkeleton() {
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Track payments for this booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>

          <Separator />

          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="bg-muted p-4 rounded-lg">
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

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", id, "payment-info"],
    queryFn: () => getBookingFinanceInfo(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <PaymentInfoSkeleton />;
  }

  const paymentData = data?.data;

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Track payments for this booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold">₹{paymentData?.totalAmount}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ₹{paymentData?.paidAmount}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Remaining Amount</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                ₹{paymentData?.remainingAmount}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Payment History</h3>

            <div className="space-y-2">
              {paymentData?.paymentHistory?.map((transaction, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()} •{" "}
                        {transaction.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{transaction.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {paymentData?.remainingAmount > 0 && (
            <AddPayment
              remaining={paymentData.remainingAmount}
              bookingId={id}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const AddPayment = ({ remaining, bookingId }) => {
  const queryClient = useQueryClient();
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

  const { mutate: submitPayment, isPending } = useMutation({
    mutationFn: (data) => addPayment(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", bookingId, "payment-info"] });
      form.reset();
      toast.success("Payment recorded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record payment");
    },
  });

  const onPaymentSubmit = (data) => {
    submitPayment({
      amount: data.amount,
      paymentMethod: data.method,
      description: "Booking Fee",
    });
  };

  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Record Payment</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onPaymentSubmit)}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4 *:flex-1">
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
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        <SelectTrigger 
                          id="payment-method" 
                          className="w-full bg-background"
                        >
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-auto w-full">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Recording..." : "Record Payment"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
