import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ErrorAlert = ({ error }) => (
  <div className="space-y-4">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error?.message || "An error occurred while fetching data"}
      </AlertDescription>
    </Alert>
  </div>
); 