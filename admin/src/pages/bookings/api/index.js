import api from "@/lib/api";

export const getAllBookings = async (params) => {
  const response = await api.get("/booking", { params });
  return response.data;
};

export const getBookingInfo = async (bookingId) => {
  try {
    const response = await api.get(`/booking/info/${bookingId}`);
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

export const getBookingFinanceInfo = async (bookingId) => {
  try {
    const response = await api.get(`/booking/${bookingId}/payments`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addPayment = async (bookingId, paymentData) => {
  try {
    const response = await api.post(`/booking/${bookingId}/payments`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



// Hi *{{1}}*,
// Thank you for choosing *Zain Sports Resort & Turf*! Your booking has been confirmed.

// 📅 *Date*: {{2}}
// ⏰ *Time*: {{3}}
// 💰 *Total*: ₹{{4}}
// 💸 *Advance Paid*: ₹{{5}}
// 🧾 *Remaining*: *₹{{6}}*

// 📍 Madhav nagari, Gangakhed Rd, Parbhani, Maharashtra 431401
// 📞 Contact: +91-8107870787

// We look forward to seeing you on the field!