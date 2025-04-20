import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialCard = ({ title, value, change, icon, timeframe, positive }) => {
  const isPositive = change >= 0;
  const timeframeText =
    timeframe === "week" ? "week" : timeframe === "month" ? "month" : "year";
  const showPositiveIndicator = positive ? isPositive : !isPositive;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <div
            className={`flex items-center text-xs ${
              showPositiveIndicator ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-gray-500 ml-1">
            vs last {timeframeText}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialCard;
