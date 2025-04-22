import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useExpenseSummary = (period = "month") => {
  return useQuery({
    queryKey: ["expenseSummary", period],
    queryFn: async () => {
      const { data } = await api.get(`/expenses/summary?period=${period}`);
      return data.data;
    },
  });
}; 