import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

/**
 * Formats an ISO date string to Arabic like "السبت، 17 مايو"
 * @param isoString - ISO 8601 date string (e.g. "2025-06-25T18:57:21.417Z")
 * @returns Formatted Arabic date string
 */
export function formatArabicDate(isoString: string | undefined): string {
  if (!isoString) return "";
  const date = parseISO(isoString);
  // Format with placeholder AM/PM
  let formatted = format(date, "EEEE، d MMMM 'الساعة' hh:mm a", { locale: ar });

  // Replace 'AM' and 'PM' with Arabic
  formatted = formatted.replace("AM", "ص").replace("PM", "م");

  return formatted;
}
