import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useDashboardStats = (period = "week") => {
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats", period],
    queryFn: async () => {
      const response = await api.get(`/dashboard/stats?period=${period}`);
      return response.data.data;
    },
  });

  const recentBookingsQuery = useQuery({
    queryKey: ["dashboard", "recent-bookings"],
    queryFn: async () => {
      const response = await api.get("/dashboard/recent-bookings");
      return response.data.data;
    },
  });

  const todayScheduleQuery = useQuery({
    queryKey: ["dashboard", "schedule"],
    queryFn: async () => {
      const response = await api.get("/dashboard/schedule");
      return response.data.data;
    },
  });

  return {
    stats: statsQuery.data,
    recentBookings: recentBookingsQuery.data,
    todaySchedule: todayScheduleQuery.data,
    isLoading: statsQuery.isLoading || recentBookingsQuery.isLoading || todayScheduleQuery.isLoading,
    error: statsQuery.error || recentBookingsQuery.error || todayScheduleQuery.error,
  };
}; 