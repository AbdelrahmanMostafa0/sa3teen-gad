"use client";
import usePrayerTimes from "@/hooks/usePrayerTimes";

const PrayerTimes = () => {
  const { prayerTimes } = usePrayerTimes();
  return (
    <div className="flex items-center justify-center flex-wrap gap-8 px-5 min-h-28 md:min-h-12 ">
      {prayerTimes &&
        prayerTimes.map((prayer) => (
          <div className="text-center" key={prayer.name}>
            <p>{prayer.time}</p>
            <p>{prayer.name}</p>
          </div>
        ))}
    </div>
  );
};

export default PrayerTimes;
