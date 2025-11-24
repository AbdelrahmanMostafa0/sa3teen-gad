// src/hooks/usePrayerTimes.ts
"use client";

import { getPrayers } from "@/services/prayerApi";
import { RootState } from "@/store/store";
import { formatTime12 } from "@/utils/date";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

type PrayerTime = {
  name: "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
  time: string; // formatted Arabic time (12h)
  time24: string; // original 24h time from API (HH:mm)
};

const nameMap: Record<PrayerTime["name"], string> = {
  Fajr: "صلاة الفجر",
  Sunrise: "الشروق",
  Dhuhr: "صلاة الظهر",
  Asr: "صلاة العصر",
  Maghrib: "صلاة المغرب",
  Isha: "صلاة العشاء",
};

const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[] | null>(null);
  const { city, country } = useSelector((state: RootState) => state.Settings);

  const fetchPrayerTimes = useCallback(async () => {
    const formattedDate = format(new Date(), "yyyy-M-d");
    try {
      const res = await getPrayers({ city, country, date: formattedDate });
      const raw = res.data?.timings;
      const times: PrayerTime[] = [
        {
          name: "Fajr",
          time: formatTime12(raw?.Fajr || "").replace("AM", "ص").replace("PM", "م"),
          time24: raw?.Fajr || "",
        },
        {
          name: "Sunrise",
          time: formatTime12(raw?.Sunrise || "").replace("AM", "ص").replace("PM", "م"),
          time24: raw?.Sunrise || "",
        },
        {
          name: "Dhuhr",
          time: formatTime12(raw?.Dhuhr || "").replace("AM", "ص").replace("PM", "م"),
          time24: raw?.Dhuhr || "",
        },
        {
          name: "Asr",
          time: formatTime12(raw?.Asr || "").replace("AM", "ص").replace("PM", "م"),
          time24: raw?.Asr || "",
        },
        {
          name: "Maghrib",
          time: formatTime12(raw?.Maghrib || "").replace("AM", "ص").replace("PM", "م"),
          time24: raw?.Maghrib || "",
        },
        {
          name: "Isha",
          time: formatTime12(raw?.Isha || "").replace("AM", "ص").replace("PM", "م"),
          time24: raw?.Isha || "",
        },
      ];
      setPrayerTimes(times);
    } catch (err) {
      console.error(err);
    }
  }, [city, country]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  // Return formatted Arabic times for UI and raw 24‑hour times for reminder logic
  const formatted = prayerTimes?.map(({ name, time }) => ({ name: nameMap[name], time }));
  return { prayerTimes: formatted || [], rawPrayerTimes: prayerTimes || [] };
};

export default usePrayerTimes;
