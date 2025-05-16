import { addHours, format, parse } from "date-fns";

export const getSlotEndTime = (startTime, duration) => {
  const parsedTime = parse(startTime, "h:mm a", new Date());
  const endTime = addHours(parsedTime, duration);
  return format(endTime, "h:mm a");
};
