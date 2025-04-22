import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TimeframeSelector = ({ value, onChange }) => {
  return (
    <div className="flex justify-end">
      <Tabs value={value} onValueChange={onChange} className="w-full  ">
        <TabsList className={"w-full max-w-md ml-auto"}>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="year">This Year</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
