"use client";
import usePrayerTimes from "@/hooks/usePrayerTimes";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Sunrise, Sunset, CloudSun } from "lucide-react";

const PrayerTimes = () => {
  const { prayerTimes } = usePrayerTimes();

  const getIcon = (name: string) => {
    if (name.includes("الفجر")) return <Sunrise className="w-6 h-6 text-orange-400" />;
    if (name.includes("الشروق")) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (name.includes("الظهر")) return <Sun className="w-6 h-6 text-yellow-600" />;
    if (name.includes("العصر")) return <CloudSun className="w-6 h-6 text-orange-300" />;
    if (name.includes("المغرب")) return <Sunset className="w-6 h-6 text-orange-500" />;
    if (name.includes("العشاء")) return <Moon className="w-6 h-6 text-blue-800" />;
    return <Sun className="w-6 h-6" />;
  };

  return (
    <div className="w-full max-w-[95vw] md:max-w-[800px] mx-auto">
      <div className="flex items-center justify-start md:justify-center gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {prayerTimes &&
          prayerTimes.map((prayer) => (
            <Card key={prayer.name} className="min-w-[100px] flex-shrink-0 hover:shadow-md transition-shadow duration-200 border-none shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                {getIcon(prayer.name)}
                <p className="font-bold text-lg text-primary">{prayer.time}</p>
                <p className="text-xs text-muted-foreground font-medium">{prayer.name}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PrayerTimes;
