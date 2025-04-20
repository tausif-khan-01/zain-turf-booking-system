import api from "@/lib/api";

export const getAllBookings = async (params) => {
  const response = await api.get("/booking", { params });
  return response.data;
};

export const getBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.patch(`/booking/${bookingId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
