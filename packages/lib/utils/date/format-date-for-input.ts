import { format } from "date-fns";

/**
 * Formats date object to be used in input[type="datetime"]
 * YYYY-MM-DDTHH:MM
 * @returns Formatted date string
 */
export const getCurrentDateTimeForInput = (date: Date): string =>
  format(date, "yyyy-MM-dd'T'HH:mm");

export const formatDateForUI = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
