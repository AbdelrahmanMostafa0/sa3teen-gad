export type PrayerTime = {
  name: "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
  time: string;
};

export type PrayerTimesType = Record<PrayerTime["name"], string>;
