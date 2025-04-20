import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingHeader({ bookingId }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/bookings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Booking Details
          </h1>
          <p className="text-muted-foreground">Manage booking {bookingId}</p>
        </div>
      </div>
      {/* <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Cancel Booking
        </Button>
      </div> */}
    </div>
  );
} 