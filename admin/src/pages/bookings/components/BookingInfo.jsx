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

export function BookingInfo({ booking, activeTab, onTabChange }) {
  return (
    <Card>
      <CardHeader className="pb-3">
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
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Booking ID
                  </h3>
                  <p className="mt-1 text-sm font-medium">{booking.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date
                  </h3>
                  <div className="mt-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm font-medium">{booking.date}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Time
                  </h3>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm font-medium">
                      {booking.time} ({booking.duration})
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Players
                  </h3>
                  <div className="mt-1 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm font-medium">
                      {booking.players} players
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Customer
                  </h3>
                  <div className="mt-1 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm font-medium">
                      {booking.customer}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Phone
                  </h3>
                  <div className="mt-1 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm font-medium">{booking.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Email
                  </h3>
                  <div className="mt-1 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm font-medium">{booking.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">
                  Notes
                </h3>
                <p className="mt-1 text-sm">{booking.notes}</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              {booking.history.map((item, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                    {index < booking.history.length - 1 && (
                      <div className="h-full w-px bg-gray-200"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.action}</p>
                      <span className="text-xs text-gray-500">
                        {item.date} at {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.details}
                    </p>
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