"use client";

import { getPrayers } from "@/services/prayerApi";
import { AppDispatch, RootState } from "@/store/store";
import { formatTime12 } from "@/utils/date";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPrayerTimesStore } from "@/store/features/prayerSlice";

type PrayerTime = {
  name: "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
  time: string; // formatted Arabic time (12h)
  time24: string; // original 24h time from API (HH:mm)
};

export const PrayerNameMap: Record<PrayerTime["name"], string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const usePrayerTimes = () => {
  // const [prayerTimes, setPrayerTimes] = useState<PrayerTime[] | null>(null);
  const { city, country } = useSelector(
    (state: RootState) => state.Settings.location
  );
  const dispatch = useDispatch<AppDispatch>();
  const prayers = useSelector((state: RootState) => state.Prayers.prayerTimes);
  const isLoading = useSelector((state: RootState) => state.Prayers.isLoading);
  const settings = useSelector((state: RootState) => state.Settings);
  const profileCity = settings?.location?.city || city;
  const profileCountry = settings?.location?.country || country;
  console.log("prayers", prayers);
  const fetchPrayerTimes = useCallback(async () => {
    // Don't fetch if location is not set
    let city = profileCity;
    let country = profileCountry;
    if (!city || !country) {
      city = "Cairo";
      country = "Egypt";
    }

    const formattedDate = format(new Date(), "yyyy-M-d");
    try {
      const res = await getPrayers({
        city,
        country,
        date: formattedDate,
      });
      const raw = res.data?.timings;
      const times: PrayerTime[] = [
        {
          name: "Fajr",
          time: formatTime12(raw?.Fajr || "")
            .replace("AM", "ص")
            .replace("PM", "م"),
          time24: raw?.Fajr || "",
        },
        {
          name: "Sunrise",
          time: formatTime12(raw?.Sunrise || "")
            .replace("AM", "ص")
            .replace("PM", "م"),
          time24: raw?.Sunrise || "",
        },
        {
          name: "Dhuhr",
          time: formatTime12(raw?.Dhuhr || "")
            .replace("AM", "ص")
            .replace("PM", "م"),
          time24: raw?.Dhuhr || "",
        },
        {
          name: "Asr",
          time: formatTime12(raw?.Asr || "")
            .replace("AM", "ص")
            .replace("PM", "م"),
          time24: raw?.Asr || "",
        },
        {
          name: "Maghrib",
          time: formatTime12(raw?.Maghrib || "")
            .replace("AM", "ص")
            .replace("PM", "م"),
          time24: raw?.Maghrib || "",
        },
        {
          name: "Isha",
          time: formatTime12(raw?.Isha || "")
            .replace("AM", "ص")
            .replace("PM", "م"),
          time24: raw?.Isha || "",
        },
      ];
      dispatch(setPrayerTimesStore(times));
    } catch (err) {
      console.error(err);
    }
  }, [profileCity, profileCountry]);

  useEffect(() => {
    if (prayers.length > 0 || isLoading) return;
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  // Return formatted Arabic times for UI and raw 24‑hour times for reminder logic
  const formatted = prayers?.map(({ name, time }) => ({
    name: PrayerNameMap[name],
    time,
  }));
  return {
    prayerTimes: formatted || [],
    rawPrayerTimes: prayers || [],
    PrayerNameMap,
  };
};

export default usePrayerTimes;
