import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarRange,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parse } from "date-fns";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { getSlotEndTime } from "@/lib/getSlotEndTime";

function MetricCard({ title, value, change, icon, timeframe }) {
  const isPositive = change >= 0;
  const timeframeText =
    timeframe === "week" ? "week" : timeframe === "month" ? "month" : "year";

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
              isPositive ? "text-green-500" : "text-red-500"
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
}

function MetricSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("week");
  const { stats, recentBookings, todaySchedule, isLoading, error } =
    useDashboardStats(timeframe);

  console.log(todaySchedule);

  const sortedTodaySchedule = todaySchedule?.schedule?.sort((a, b) => {
    // start time = 6:00 AM
    const aStartTime = parse(a.startTime, "hh:mm a", new Date());
    const bStartTime = parse(b.startTime, "hh:mm a", new Date());
    return aStartTime - bStartTime;
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your turf booking business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">
            <CalendarRange className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Bookings"
              value={stats?.totalBookings?.count}
              change={stats?.totalBookings?.change}
              icon={<CalendarRange className="h-5 w-5" />}
              timeframe={timeframe}
            />
            <MetricCard
              title="Revenue"
              value={`₹${stats?.revenue?.amount?.toLocaleString()}`}
              change={stats?.revenue?.change}
              icon={<DollarSign className="h-5 w-5" />}
              timeframe={timeframe}
            />
            <MetricCard
              title="Customers"
              value={stats?.customers?.count}
              change={stats?.customers?.change}
              icon={<Users className="h-5 w-5" />}
              timeframe={timeframe}
            />
            <MetricCard
              title="Occupancy Rate"
              value={`${stats?.occupancyRate?.rate}%`}
              change={stats?.occupancyRate?.change}
              icon={<TrendingUp className="h-5 w-5" />}
              timeframe={timeframe}
            />
          </>
        )}
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-end">
        <Tabs
          value={timeframe}
          onValueChange={setTimeframe}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </div>
            <Link to="/bookings">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[60px]" />
                <Skeleton className="h-[60px]" />
                <Skeleton className="h-[60px]" />
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings?.recentBookings?.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {booking.customer.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {booking.customer.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">
                            {format(new Date(booking.date), "MMM d, yyyy")} •{" "}
                            {booking.startTime}
                          </p>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-[10px] px-1 py-0 h-4"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        <Link
                          to={`/bookings/${booking.bookingId}`}
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Upcoming bookings for today</CardDescription>
            </div>
            <Link to="/bookings">
              <Button variant="ghost" size="sm" className="gap-1">
                Full Schedule
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[60px]" />
                <Skeleton className="h-[60px]" />
                <Skeleton className="h-[60px]" />
              </div>
            ) : (
              <div className="space-y-4">
                {sortedTodaySchedule?.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {booking.customer.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">
                            {booking.startTime} -{" "}
                            {getSlotEndTime(
                              booking.startTime,
                              booking.duration
                            )}
                          </p>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-[10px] px-1 py-0 h-4"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        <Link
                          to={`/bookings/${booking.bookingId}`}
                          className="text-primary hover:text-primary/80"
                        >
                          Details
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
