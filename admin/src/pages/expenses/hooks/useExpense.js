import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useExpense = (txnId) => {
  return useQuery({
    queryKey: ["expense", txnId],
    queryFn: async () => {
      const { data } = await api.get(`/expenses/${txnId}`);
      return data.data.expense;
    },
    enabled: !!txnId,
  });
}; 