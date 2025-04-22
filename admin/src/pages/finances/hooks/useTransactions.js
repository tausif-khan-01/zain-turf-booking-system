import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchTransactions = async ({
  page = 1,
  type = "all",
  category = "all",
  search = "",
  startDate = undefined,
  endDate = undefined,
}) => {
  const { data } = await api.get(`/transactions`, {
    params: {
      page,
      limit: 10,
      type: type === "all" ? undefined : type,
      category: category === "all" ? undefined : category,
      search: search || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    },
  });
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch transactions");
  }
  return data;
};

export const useTransactions = ({ page, type, search, startDate, endDate }) => {
  return useQuery({
    queryKey: ["transactions", page, type, search, startDate, endDate],
    queryFn: () =>
      fetchTransactions({ page, type, search, startDate, endDate }),
  });
};
