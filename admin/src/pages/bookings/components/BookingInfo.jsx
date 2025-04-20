import React from "react";
import { Calendar, Clock, User, Phone, Mail, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getBookingInfo } from "../api";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { getSlotEndTime } from "@/lib/getSlotEndtime";
export function BookingInfoSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" disabled>
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger value="history" disabled>
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                    {index < 2 && (
                      <div className="h-full w-px bg-gray-200"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-64 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function BookingInfo() {
  const { id } = useParams();
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ["bookings", id],
    queryFn: () => getBookingInfo(id),
    enabled: !!id,
  });

  const booking = bookingData?.booking;

  console.log(booking);

  if (isLoading) {
    return <BookingInfoSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Booking Information</CardTitle>
            <CardDescription>Details about this booking</CardDescription>
          </div>
          <Badge
            variant={
              booking.status === "confirmed"
                ? "default"
                : booking.status === "pending"
                ? "secondary"
                : booking.status === "completed"
                ? "success"
                : "destructive"
            }
            className="capitalize"
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Booking ID</h3>
              <p className="mt-1 text-sm font-medium">{booking.bookingId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <div className="mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <p className="text-sm font-medium">
                  {format(booking.date, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Time</h3>
              <div className="mt-1 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <p className="text-sm font-medium">
                  {booking.startTime} -{" "}
                  {getSlotEndTime(booking.startTime, booking.duration)} (
                  {booking.duration} hours)
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer</h3>
              <div className="mt-1 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <p className="text-sm font-medium">{booking.customer.name}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <div className="mt-1 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <p className="text-sm font-medium">
                  {booking.customer.contact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* {booking.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-sm">{booking.notes}</p>
              </div>
            )} */}
      </CardContent>
    </Card>
  );
}
