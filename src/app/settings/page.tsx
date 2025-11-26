"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { updateSettings } from "@/store/features/settingsSlice";
import useSyncLocalStorageToRedux from "@/hooks/useSyncLocalStorageToRedux";
import usePrayerTimes from "@/hooks/usePrayerTimes";
import countries from "@/data/countries.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Bell, Clock, Droplets, Timer } from "lucide-react";
import { PrayerName } from "@/types/settings";

const prayerNameMap: Record<PrayerName, string> = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export default function SettingsPage() {
  useSyncLocalStorageToRedux();
  const router = useRouter();
  const userSettings = useSelector((state: RootState) => state.Settings);
  const { rawPrayerTimes } = usePrayerTimes();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      waterReminderInterval: userSettings.waterReminderInterval,
      focusDurationTime: userSettings.focusDurationTime,
      shortBreakDuration: userSettings.shortBreakDuration,
      city: userSettings.city,
      country: userSettings.country,
      preReminderMinutes: userSettings.prayerReminderSettings.preReminderMinutes,
      isWaterReminderOn: userSettings.isWaterReminderOn,
      prayerReminderEnabled: userSettings.prayerReminderSettings.isEnabled,
      preReminderEnabled: userSettings.prayerReminderSettings.preReminderEnabled,
      atTimeReminderEnabled: userSettings.prayerReminderSettings.atTimeReminderEnabled,
      individualPrayers: userSettings.prayerReminderSettings.individualPrayers,
    },
  });

  const selectedCountry = watch("country");
  const countryCities = useMemo(() => {
    return countries.find((country) => country.iso3 === selectedCountry)?.cities;
  }, [selectedCountry]);

  const prayerReminderEnabled = watch("prayerReminderEnabled");
  const preReminderEnabled = watch("preReminderEnabled");
  const atTimeReminderEnabled = watch("atTimeReminderEnabled");
  const individualPrayers = watch("individualPrayers");

  useEffect(() => {
    setValue("city", userSettings.city);
    setValue("country", userSettings.country);
    setValue("waterReminderInterval", userSettings.waterReminderInterval);
    setValue("focusDurationTime", userSettings.focusDurationTime);
    setValue("shortBreakDuration", userSettings.shortBreakDuration);
    setValue("preReminderMinutes", userSettings.prayerReminderSettings.preReminderMinutes);
    setValue("isWaterReminderOn", userSettings.isWaterReminderOn);
    setValue("prayerReminderEnabled", userSettings.prayerReminderSettings.isEnabled);
    setValue("preReminderEnabled", userSettings.prayerReminderSettings.preReminderEnabled);
    setValue("atTimeReminderEnabled", userSettings.prayerReminderSettings.atTimeReminderEnabled);
    setValue("individualPrayers", userSettings.prayerReminderSettings.individualPrayers);
  }, [userSettings, setValue]);

  interface FormData {
    waterReminderInterval: number;
    focusDurationTime: number;
    shortBreakDuration: number;
    city: string;
    country: string;
    preReminderMinutes: number;
    isWaterReminderOn: boolean;
    prayerReminderEnabled: boolean;
    preReminderEnabled: boolean;
    atTimeReminderEnabled: boolean;
    individualPrayers: {
      [key in PrayerName]: {
        preReminderEnabled: boolean;
        atTimeReminderEnabled: boolean;
      };
    };
  }

  const onSubmit = (data: FormData) => {
    const updatedSettings = {
      ...userSettings,
      waterReminderInterval: data.waterReminderInterval,
      focusDurationTime: data.focusDurationTime,
      shortBreakDuration: data.shortBreakDuration,
      city: data.city,
      country: data.country,
      isWaterReminderOn: data.isWaterReminderOn,
      prayerReminderSettings: {
        isEnabled: data.prayerReminderEnabled,
        preReminderMinutes: data.preReminderMinutes,
        preReminderEnabled: data.preReminderEnabled,
        atTimeReminderEnabled: data.atTimeReminderEnabled,
        individualPrayers: data.individualPrayers,
      },
    };

    dispatch(updateSettings(updatedSettings));
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
    router.push("/");
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">الإعدادات</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pomodoro Settings */}
          <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Timer className="w-5 h-5 text-primary" />
                تظبيط الوقت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Focus Time */}
                <div className="space-y-2">
                  <Label htmlFor="focusDurationTime" className="font-bold">
                    التركيز (دقيقة)
                  </Label>
                  <Input
                    id="focusDurationTime"
                    {...register("focusDurationTime", {
                      required: { value: true, message: "مطلوب" },
                      valueAsNumber: true,
                    })}
                    type="number"
                    max={999}
                    
                  />
                  {errors.focusDurationTime && (
                    <p className="text-xs text-red-500">
                      {errors.focusDurationTime.message}
                    </p>
                  )}
                </div>

                {/* Short Break */}
                <div className="space-y-2">
                  <Label htmlFor="shortBreakDuration" className="font-bold">
                    البريك (دقيقة)
                  </Label>
                  <Input
                    id="shortBreakDuration"
                    {...register("shortBreakDuration", {
                      required: { value: true, message: "مطلوب" },
                      valueAsNumber: true,
                      validate: {
                        value: (value) => value !== 0 || "مطلوب",
                        minValue: (value) =>
                          value >= 1 || "لا يمكن ان يكون اقل من دقيقة",
                      },
                    })}
                    type="number"
                    max={999}
                    
                  />
                  {errors.shortBreakDuration && (
                    <p className="text-xs text-red-500">
                      {errors.shortBreakDuration.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water Reminder Settings */}
          <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Droplets className="w-5 h-5 text-primary" />
                تذكير شرب الماء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isWaterReminderOn" className="font-bold">
                  تفعيل التذكير
                </Label>
                <Switch
                dir="ltr"
                  id="isWaterReminderOn"
                  checked={watch("isWaterReminderOn")}
                  onCheckedChange={(checked: boolean) =>
                    setValue("isWaterReminderOn", checked, { shouldDirty: true })
                  }
                />
              </div>
              
              {watch("isWaterReminderOn") && (
                <div className="flex items-center gap-4">
                  <Label className="whitespace-nowrap">تذكير كل</Label>
                  <Input
                    {...register("waterReminderInterval", {
                      required: { value: true, message: "مطلوب" },
                      valueAsNumber: true,
                      validate: {
                        value: (value) => value !== 0 || "مطلوب",
                        minValue: (value) =>
                          value >= 1 || "لا يمكن ان يكون اقل من دقيقة",
                      },
                    })}
                    type="number"
                    className="w-4/12"
                  />
                  <Label>دقيقة</Label>
                </div>
              )}
              {errors.waterReminderInterval && (
                <p className="text-xs text-red-500">
                  {errors.waterReminderInterval.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Prayer Reminder Settings */}
          <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bell className="w-5 h-5 text-primary" />
                تذكير الصلاة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Global Toggle */}
              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                <Label htmlFor="prayerReminderEnabled" className="font-bold text-lg">
                  تفعيل تذكير الصلاة
                </Label>
                <Switch
                dir="ltr"
                  id="prayerReminderEnabled"
                  checked={prayerReminderEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setValue("prayerReminderEnabled", checked, { shouldDirty: true })
                  }
                />
              </div>

              {prayerReminderEnabled && (
                <>
                  {/* Pre-reminder Time */}
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      وقت التذكير المسبق
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        {...register("preReminderMinutes", {
                          required: { value: true, message: "مطلوب" },
                          valueAsNumber: true,
                          validate: {
                            value: (value) => value !== 0 || "مطلوب",
                            minValue: (value) =>
                              value >= 1 || "لا يمكن ان يكون اقل من دقيقة",
                          },
                        })}
                        type="number"
                        className="text-center max-w-[120px]"
                      />
                      <Label>دقيقة قبل الصلاة</Label>
                    </div>
                    {errors.preReminderMinutes && (
                      <p className="text-xs text-red-500">
                        {errors.preReminderMinutes.message}
                      </p>
                    )}
                  </div>

                  {/* Global Reminder Types */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                      <Label htmlFor="preReminderEnabled" className="font-medium">
                        تذكير مسبق
                      </Label>
                      <Switch
                      dir="ltr"
                        id="preReminderEnabled"
                        checked={preReminderEnabled}
                        onCheckedChange={(checked: boolean) =>
                          setValue("preReminderEnabled", checked, { shouldDirty: true })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                      <Label htmlFor="atTimeReminderEnabled" className="font-medium">
                        تذكير عند الوقت
                      </Label>
                      <Switch
                      dir="ltr"
                        id="atTimeReminderEnabled"
                        checked={atTimeReminderEnabled}
                        onCheckedChange={(checked: boolean) =>
                          setValue("atTimeReminderEnabled", checked, { shouldDirty: true })
                        }
                      />
                    </div>
                  </div>

                  {/* Individual Prayer Controls */}
                  <div className="space-y-3">
                    <Label className="font-bold text-base">تخصيص كل صلاة</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as PrayerName[]).map(
                        (prayer) => {
                          const prayerTime = rawPrayerTimes.find(
                            (p) => p.name === prayer
                          );
                          return (
                            <Card
                              key={prayer}
                              className="border-border/30 bg-card/50 backdrop-blur-sm"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <p className="font-bold text-lg">
                                      {prayerNameMap[prayer]}
                                    </p>
                                    {prayerTime && (
                                      <p className="text-sm text-muted-foreground">
                                        {prayerTime.time24}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <div className="flex items-center justify-between p-2 bg-secondary/40 rounded">
                                    <Label className="text-sm">تذكير مسبق</Label>
                                    <Switch
                                    dir="ltr"
                                      checked={
                                        individualPrayers?.[prayer]
                                          ?.preReminderEnabled ?? true
                                      }
                                      onCheckedChange={(checked: boolean) =>
                                        setValue(
                                          `individualPrayers.${prayer}.preReminderEnabled`,
                                          checked,
                                          { shouldDirty: true }
                                        )
                                      }
                                      disabled={!preReminderEnabled}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-secondary/40 rounded">
                                    <Label className="text-sm">عند الوقت</Label>
                                    <Switch
                                    dir="ltr"
                                      checked={
                                        individualPrayers?.[prayer]
                                          ?.atTimeReminderEnabled ?? true
                                      }
                                      onCheckedChange={(checked: boolean) =>
                                        setValue(
                                          `individualPrayers.${prayer}.atTimeReminderEnabled`,
                                          checked,
                                          { shouldDirty: true }
                                        )
                                      }
                                      disabled={!atTimeReminderEnabled}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        }
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Location Settings */}
          <Card className="border-border/40 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">الموقع لمواقيت الصلاة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">الدولة</Label>
                  <Select
                    value={watch("country")}
                    onValueChange={(value) =>
                      setValue("country", value, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.country} value={country.iso3}>
                          {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">المدينة</Label>
                  <Select
                    value={watch("city")}
                    onValueChange={(value) =>
                      setValue("city", value, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCities?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              disabled={!isDirty}
              className="flex-1"
              type="submit"
              size="lg"
            >
              حفظ التعديلات
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/")}
              size="lg"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
