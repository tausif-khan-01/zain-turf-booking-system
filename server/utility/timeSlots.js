export const generateTimeSlots = (startTime, endTime, duration = 1) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute <= endMinute)
  ) {
    const slotStart = `${currentHour.toString().padStart(2, "0")}:${currentMinute
      .toString()
      .padStart(2, "0")}`;

    // Calculate end time
    let endHour = currentHour + duration;
    let endMinute = currentMinute;
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }

    const slotEnd = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    slots.push({
      start: slotStart,
      end: slotEnd,
    });

    // Move to next slot
    currentHour += duration;
  }

  return slots;
};

export const isSlotAvailable = async (date, startTime, duration, Booking) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const endHour = startHour + duration;
  const endMinute = startMinute;

  const existingBooking = await Booking.findOne({
    date,
    startTime,
    status: { $ne: "cancelled" },
  });

  return !existingBooking;
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}; 