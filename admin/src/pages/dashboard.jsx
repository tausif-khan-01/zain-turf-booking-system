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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for the dashboard
const dashboardData = {
  totalBookings: 128,
  bookingsChange: 12,
  revenue: 76800,
  revenueChange: 8,
  customers: 85,
  customersChange: 5,
  occupancyRate: 72,
  occupancyChange: -3,
  recentBookings: [
    {
      id: "ZT-1234",
      customer: "John Doe",
      date: "Today",
      time: "5:00 PM - 7:00 PM",
      amount: 1200,
      status: "confirmed",
      avatar: "/placeholder.svg",
    },
    {
      id: "ZT-1235",
      customer: "Jane Smith",
      date: "Tomorrow",
      time: "6:00 PM - 8:00 PM",
      amount: 1200,
      status: "pending",
      avatar: "/placeholder.svg",
    },
    {
      id: "ZT-1236",
      customer: "Mike Johnson",
      date: "Jul 25, 2023",
      time: "7:00 PM - 9:00 PM",
      amount: 1200,
      status: "confirmed",
      avatar: "/placeholder.svg",
    },
    {
      id: "ZT-1237",
      customer: "Sarah Williams",
      date: "Jul 26, 2023",
      time: "8:00 PM - 10:00 PM",
      amount: 1200,
      status: "confirmed",
      avatar: "/placeholder.svg",
    },
  ],
  upcomingBookings: [
    {
      id: "ZT-1238",
      date: "Today",
      slots: [
        {
          time: "5:00 PM - 6:00 PM",
          customer: "Team Alpha",
          status: "confirmed",
        },
        {
          time: "6:00 PM - 7:00 PM",
          customer: "Team Beta",
          status: "confirmed",
        },
        {
          time: "7:00 PM - 8:00 PM",
          customer: "Available",
          status: "available",
        },
        {
          time: "8:00 PM - 9:00 PM",
          customer: "Team Gamma",
          status: "pending",
        },
        {
          time: "9:00 PM - 10:00 PM",
          customer: "Available",
          status: "available",
        },
      ],
    },
    {
      id: "ZT-1239",
      date: "Tomorrow",
      slots: [
        {
          time: "5:00 PM - 6:00 PM",
          customer: "Available",
          status: "available",
        },
        {
          time: "6:00 PM - 7:00 PM",
          customer: "Team Delta",
          status: "confirmed",
        },
        {
          time: "7:00 PM - 8:00 PM",
          customer: "Team Epsilon",
          status: "confirmed",
        },
        {
          time: "8:00 PM - 9:00 PM",
          customer: "Available",
          status: "available",
        },
        {
          time: "9:00 PM - 10:00 PM",
          customer: "Team Zeta",
          status: "pending",
        },
      ],
    },
  ],
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("week");

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
        <MetricCard
          title="Total Bookings"
          value={dashboardData.totalBookings}
          change={dashboardData.bookingsChange}
          icon={<CalendarRange className="h-5 w-5" />}
          timeframe={timeframe}
        />
        <MetricCard
          title="Revenue"
          value={`₹${dashboardData.revenue.toLocaleString()}`}
          change={dashboardData.revenueChange}
          icon={<DollarSign className="h-5 w-5" />}
          timeframe={timeframe}
        />
        <MetricCard
          title="Customers"
          value={dashboardData.customers}
          change={dashboardData.customersChange}
          icon={<Users className="h-5 w-5" />}
          timeframe={timeframe}
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${dashboardData.occupancyRate}%`}
          change={dashboardData.occupancyChange}
          icon={<TrendingUp className="h-5 w-5" />}
          timeframe={timeframe}
        />
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
            <div className="space-y-4">
              {dashboardData.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={booking.avatar || "/placeholder.svg"}
                        alt={booking.customer}
                      />
                      <AvatarFallback>
                        {booking.customer.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{booking.customer}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {booking.date} • {booking.time}
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
                    <p className="text-sm font-medium">₹{booking.amount}</p>
                    <p className="text-xs text-gray-500">{booking.id}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {dashboardData.upcomingBookings[0].slots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{slot.time}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{slot.customer}</p>
                        <Badge
                          variant={
                            slot.status === "confirmed"
                              ? "default"
                              : slot.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px] px-1 py-0 h-4"
                        >
                          {slot.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {slot.status !== "available" && (
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
