import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useExpenses = ({
  page = 1,
  limit = 10,
  startDate,
  endDate,
  category,
  status,
  search,
}) => {
  return useQuery({
    queryKey: [
      "expenses",
      {
        page,
        limit,
        startDate,
        endDate,
        category,
        status,
        search,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (category) params.append("category", category);
      if (status) params.append("status", status);
      if (search) params.append("search", search);

      const { data } = await api.get(`/expenses?${params.toString()}`);
      return data.data;
    },
  });
}; 