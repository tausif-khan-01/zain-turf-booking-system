import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function PaymentInfo({ booking, paymentAmount, paymentMethod, onPaymentAmountChange, onPaymentMethodChange, onPaymentSubmit }) {
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Booking Fee</p>
                  <p className="text-sm text-gray-500">
                    {booking.paymentDate} • {booking.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{booking.paid}</p>
                  <p className="text-xs text-gray-500">
                    {booking.paymentId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {booking.remaining > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Record Payment</h3>
              <form onSubmit={onPaymentSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="payment-amount">Payment Amount</Label>
                    <Input
                      id="payment-amount"
                      placeholder="Enter amount"
                      type="number"
                      min="1"
                      max={booking.remaining}
                      value={paymentAmount}
                      onChange={onPaymentAmountChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={onPaymentMethodChange}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">
                          Bank Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!paymentAmount}
                >
                  Record Payment
                </Button>
              </form>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 