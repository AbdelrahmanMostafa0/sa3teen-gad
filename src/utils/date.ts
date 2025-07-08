import {
  differenceInMinutes,
  format,
  isAfter,
  parse,
  parseISO,
  setHours,
  setMinutes,
} from "date-fns";
import { ar } from "date-fns/locale";
type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

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

export const formatTime12 = (time24: string): string => {
  const [hour, minute] = time24.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
};

export const getCurrentAndNextPrayer = (
  prayers: Record<string, string>,
  now: Date
): {
  current: keyof typeof prayers | null;
  next: keyof typeof prayers | null;
} => {
  const entries = Object.entries(prayers) as [keyof typeof prayers, string][];

  for (let i = 0; i < entries.length; i++) {
    const time = parse(entries[i][1], "HH:mm", new Date());
    if (isAfter(time, now)) {
      return {
        current: i > 0 ? entries[i - 1][0] : null,
        next: entries[i][0],
      };
    }
  }

  return {
    current: entries[entries.length - 1][0],
    next: null,
  };
};

// Returns the name of the next prayer
export const getNextPrayer = (
  prayers: PrayerTimes
): keyof PrayerTimes | null => {
  const now = new Date();

  for (const [key, time] of Object.entries(prayers)) {
    const parsed = parse(time, "HH:mm", new Date());
    if (isAfter(parsed, now)) {
      return key as keyof PrayerTimes;
    }
  }

  return null; // All prayers have passed
};

export function getNextTimeAndProgress(times: string[], currentDate: Date) {
  const toTimeDate = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return setMinutes(setHours(new Date(currentDate), h), m);
  };

  const parsedTimes = times.map(toTimeDate);

  let nextIndex = parsedTimes.findIndex((t) => isAfter(t, currentDate));
  if (nextIndex === -1) nextIndex = 0;

  const nextTime = parsedTimes[nextIndex];
  const prevTime = parsedTimes[(nextIndex - 1 + times.length) % times.length];

  const totalDiff = (differenceInMinutes(nextTime, prevTime) + 1440) % 1440;
  const elapsed = (differenceInMinutes(currentDate, prevTime) + 1440) % 1440;
  const percent = (elapsed / totalDiff) * 100;

  return {
    prevTime: times[(nextIndex - 1 + times.length) % times.length],
    nextTime: times[nextIndex],
    percentPassed: percent.toFixed(2) + "%",
  };
}
