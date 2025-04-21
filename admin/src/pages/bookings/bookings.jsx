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
import { getAllBookings } from "@/pages/bookings/api";
import {
  CalendarRange,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; 
import { getSlotEndTime } from "@/lib/getSlotEndTime";

export default function Bookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedDate, setSelectedDate] = useState();
  const [page, setPage] = useState(1);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Query parameters
  const queryParams = {
    page,
    limit: 10,
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    dateFilter: dateFilter !== "all" ? dateFilter : "all",
    date:
      dateFilter === "custom" && selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
  };

  // Fetch bookings using react-query
  const {
    data: bookingsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings", queryParams],
    queryFn: () => getAllBookings(queryParams),
  });

  // Loading skeleton components
  const MobileSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={index}
          className="hover:bg-gray-50 transition-colors cursor-pointer rounded-none border-x-0"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const DesktopSkeleton = () => (
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
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32 mt-1" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32 mt-1" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24 mt-1" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (isError) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Error loading bookings: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage all your turf bookings</p>
        </div>
      </div>

      <Card className={"rounded md:rounded-md"}>
        <CardHeader className="p-1.5 md:p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
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
              <Button
                variant="outline"
                size="icon"
                onClick={refetch}
                disabled={isLoading}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
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
                    <span>Date</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>

              {dateFilter === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full md:w-[180px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className={"p-0 md:p-4"}>
          {isLoading ? (
            isMobile ? (
              <MobileSkeleton />
            ) : (
              <DesktopSkeleton />
            )
          ) : isMobile ? (
            // Mobile card view
            <div className="space-y-4">
              {bookingsData?.data.bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bookings found
                </div>
              ) : (
                bookingsData?.data.bookings.map((booking) => (
                  <Link
                    to={`/bookings/${booking.bookingId}`}
                    key={booking.bookingId}
                  >
                    <Card className="hover:bg-gray-50 transition-colors cursor-pointer rounded-none border-x-0">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {booking.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-xs text-gray-500">
                                {booking.contact}
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
                            <div>
                              {format(new Date(booking.date), "dd MMM yyyy")}
                            </div>
                            <div className="text-xs">
                              {booking.startTime} -{" "}
                              {getSlotEndTime(
                                booking.startTime,
                                booking.duration
                              )}
                            </div>
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
                  {bookingsData?.data.bookings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookingsData?.data.bookings.map((booking) => (
                      <TableRow key={booking.bookingId}>
                        <TableCell className="font-medium">
                          {booking.bookingId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {booking.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-xs text-gray-500">
                                {booking.contact}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {format(new Date(booking.date), "MMM dd, yyyy")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.startTime} -{" "}
                            {getSlotEndTime(
                              booking.startTime,
                              booking.duration
                            )}
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
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/bookings/${booking.bookingId}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
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
            Showing <strong>{bookingsData?.data.bookings.length || 0}</strong>{" "}
            of <strong>{bookingsData?.data.pagination.total || 0}</strong>{" "}
            bookings
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                !bookingsData?.data.pagination.pages ||
                page >= bookingsData?.data.pagination.pages
              }
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
