import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchFinancialSummary = async (period) => {
  const { data } = await api.get(`/transactions/summary?period=${period}`);
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch financial summary");
  }
  return data;
};

export const useFinancialSummary = (timeframe) => {
  return useQuery({
    queryKey: ["financialSummary", timeframe],
    queryFn: () => fetchFinancialSummary(timeframe),
  });
}; 