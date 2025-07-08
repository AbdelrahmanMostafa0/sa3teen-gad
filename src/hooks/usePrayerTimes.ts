import { useTime } from "@/context/TimeContext";
import { getPrayers } from "@/services/prayerApi";
import { RootState } from "@/store/store";
import { formatTime12, getNextTimeAndProgress } from "@/utils/date";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
type PrayerTime = {
  name: "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
  time: string;
};
const nameMap = {
  Fajr: "صلاة الفجر",
  Sunrise: "الشروق",
  Dhuhr: "صلاة الظهر",
  Asr: "صلاة العصر",
  Maghrib: "صلاة المغرب",
  Isha: "صلاة العشاء",
};

type PrayerTimes = PrayerTime[];
const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>();
  const time = useTime();
  const { city, country } = useSelector((state: RootState) => state.Settings);
  const getDayPrayers = useCallback(async () => {
    const formattedDate = format(new Date(), "yyyy-M-d");

    try {
      const res = await getPrayers({
        city: city,
        country: country,
        date: formattedDate,
      });
      const times: PrayerTimes = [
        {
          name: "Fajr",
          time: res.data?.timings.Fajr || "",
        },
        {
          name: "Sunrise",
          time: res.data?.timings.Sunrise || "",
        },
        {
          name: "Dhuhr",
          time: res.data?.timings.Dhuhr || "",
        },
        {
          name: "Asr",
          time: res.data?.timings.Asr || "",
        },
        {
          name: "Maghrib",
          time: res.data?.timings.Maghrib || "",
        },
        {
          name: "Isha",
          time: res.data?.timings.Isha || "",
        },
      ];
      setPrayerTimes(times);
    } catch (err) {
      console.log(err);
    }
  }, [city, country]);
  console.log(prayerTimes);

  useEffect(() => {
    getDayPrayers();
  }, [city, country, getDayPrayers]);
  const paryerTimesInArabic = () => {
    if (!prayerTimes) return null;
    const updatedPRayers = prayerTimes.map((prayer) => {
      return {
        name: nameMap[prayer.name],
        time: formatTime12(prayer.time).replace("AM", "ص").replace("PM", "م"),
      };
    });

    return updatedPRayers;
  };
  const prayerTimesOnly = prayerTimes?.map((prayer) => prayer.time);
  console.log(prayerTimesOnly);

  // const  {prevTime, nextTime,percentPassed} = getNextTimeAndProgress(prayerTimesOnly || [], time
  const progressData = getNextTimeAndProgress(prayerTimesOnly || [], time);
  console.log(progressData);

  return { prayerTimes: paryerTimesInArabic() };
};

export default usePrayerTimes;
