import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, CheckCircle } from "lucide-react";

export function BookingActions({ booking }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Send Reminder
        </Button>
        {booking.status === "confirmed" && (
          <Button className="w-full justify-start" variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 