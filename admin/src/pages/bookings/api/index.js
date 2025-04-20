import api from "@/lib/api";

export const getAllBookings = async (params) => {
  const response = await api.get("/booking", { params });
  return response.data;
};
