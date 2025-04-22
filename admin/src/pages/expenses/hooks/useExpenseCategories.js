import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useExpenseCategories = () => {
  return useQuery({
    queryKey: ["expenseCategories"],
    queryFn: async () => {
      const { data } = await api.get("/expenses/categories");
      return data.data.categories;
    },
  });
}; 