import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMediaQuery from "@/hooks/use-media-query";
import {
  CalendarRange,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock data for bookings
const bookings = [
  {
    id: "ZT-1234",
    customer: "John Doe",
    phone: "+91 98765 43210",
    date: "Jul 24, 2023",
    time: "5:00 PM - 7:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 200,
    remaining: 1000,
    status: "confirmed",
    avatar: "/placeholder.svg",
  },
  {
    id: "ZT-1235",
    customer: "Jane Smith",
    phone: "+91 98765 43211",
    date: "Jul 25, 2023",
    time: "6:00 PM - 8:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 200,
    remaining: 1000,
    status: "pending",
    avatar: "/placeholder.svg",
  },
  {
    id: "ZT-1236",
    customer: "Mike Johnson",
    phone: "+91 98765 43212",
    date: "Jul 25, 2023",
    time: "7:00 PM - 9:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 1200,
    remaining: 0,
    status: "completed",
    avatar: "/placeholder.svg",
  },
  {
    id: "ZT-1237",
    customer: "Sarah Williams",
    phone: "+91 98765 43213",
    date: "Jul 26, 2023",
    time: "8:00 PM - 10:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 200,
    remaining: 1000,
    status: "confirmed",
    avatar: "/placeholder.svg",
  },
  {
    id: "ZT-1238",
    customer: "David Brown",
    phone: "+91 98765 43214",
    date: "Jul 26, 2023",
    time: "5:00 PM - 7:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 0,
    remaining: 1200,
    status: "cancelled",
    avatar: "/placeholder.svg",
  },
  {
    id: "ZT-1239",
    customer: "Emily Davis",
    phone: "+91 98765 43215",
    date: "Jul 27, 2023",
    time: "6:00 PM - 8:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 200,
    remaining: 1000,
    status: "confirmed",
    avatar: "/placeholder.svg",
  },
  {
    id: "ZT-1240",
    customer: "Michael Wilson",
    phone: "+91 98765 43216",
    date: "Jul 27, 2023",
    time: "7:00 PM - 9:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 200,
    remaining: 1000,
    status: "pending",
    avatar: "/placeholder.svg",
  },
  {
    id: "ZT-1241",
    customer: "Jessica Taylor",
    phone: "+91 98765 43217",
    date: "Jul 28, 2023",
    time: "8:00 PM - 10:00 PM",
    duration: "2 hours",
    amount: 1200,
    paid: 1200,
    remaining: 0,
    status: "completed",
    avatar: "/placeholder.svg",
  },
];

export default function Bookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Filter bookings based on search query and filters
  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery);

    // Status filter
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    // Date filter (simplified for demo)
    const matchesDate = dateFilter === "all" || true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage all your turf bookings</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by name, ID, or phone..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    <span>Date Range</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // Mobile card view
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bookings found
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <Link to={`/admin/bookings/${booking.id}`} key={booking.id}>
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={booking.avatar || "/placeholder.svg"}
                                alt={booking.customer}
                              />
                              <AvatarFallback>
                                {booking.customer.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {booking.customer}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.phone}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                ? "secondary"
                                : booking.status === "completed"
                                ? "success"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">Date & Time</div>
                            <div>{booking.date}</div>
                            <div className="text-xs">{booking.time}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Amount</div>
                            <div>₹{booking.amount}</div>
                            <div className="text-xs text-gray-500">
                              {booking.remaining > 0
                                ? `Due: ₹${booking.remaining}`
                                : "Fully Paid"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          ) : (
            // Desktop table view
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={booking.avatar || "/placeholder.svg"}
                                alt={booking.customer}
                              />
                              <AvatarFallback>
                                {booking.customer.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {booking.customer}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.phone}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.date}</div>
                          <div className="text-xs text-gray-500">
                            {booking.time} ({booking.duration})
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{booking.amount}</div>
                          <div className="text-xs text-gray-500">
                            Paid: ₹{booking.paid} • Due: ₹{booking.remaining}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                ? "secondary"
                                : booking.status === "completed"
                                ? "success"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/bookings/${booking.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <strong>{filteredBookings.length}</strong> of{" "}
            <strong>{bookings.length}</strong> bookings
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
