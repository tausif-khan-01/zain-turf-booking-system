import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64 mt-2" />
    </div>
  </div>
);

export const TimeframeSkeleton = () => (
  <div className="flex justify-end">
    <Skeleton className="h-10 w-full md:w-[400px]" />
  </div>
);

export const FinancialCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16 mt-2" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const TransactionsSkeleton = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-full md:w-64" />
          <Skeleton className="h-10 w-full md:w-[180px]" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </CardContent>
    <CardFooter className="flex items-center justify-between">
      <Skeleton className="h-4 w-48" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardFooter>
  </Card>
);

const FinancesSkeleton = () => {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <TimeframeSkeleton />
      <FinancialCardsSkeleton />
      <TransactionsSkeleton />
    </div>
  );
};

export default FinancesSkeleton; 