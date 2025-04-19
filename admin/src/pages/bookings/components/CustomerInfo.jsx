import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail } from "lucide-react";

export function CustomerInfo({ booking }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={booking.avatar || "/placeholder.svg"}
              alt={booking.customer}
            />
            <AvatarFallback>
              {booking.customer.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{booking.customer}</p>
            <p className="text-sm text-gray-500">Customer</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <p className="text-sm">{booking.phone}</p>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <p className="text-sm">{booking.email}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Customer History
        </Button>
      </CardFooter>
    </Card>
  );
} 