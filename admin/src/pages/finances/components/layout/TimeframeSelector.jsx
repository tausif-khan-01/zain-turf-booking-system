import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TimeframeSelector = ({ value, onChange, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-end">
        <div className="h-10 w-full md:w-[400px] bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <Tabs value={value} onValueChange={onChange} className="w-full md:w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="year">This Year</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}; 