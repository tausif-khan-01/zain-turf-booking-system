import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useExpenseMutations = () => {
  const queryClient = useQueryClient();

  const createExpense = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/expenses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseSummary"] });
      toast.success("Expense added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add expense");
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/expenses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseSummary"] });
      toast.success("Expense updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update expense");
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseSummary"] });
      toast.success("Expense deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    },
  });

  return {
    createExpense,
    updateExpense,
    deleteExpense,
  };
}; 