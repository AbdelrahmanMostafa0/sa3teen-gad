"use client";

import { updateSettings } from "@/store/features/settingsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import useSyncLocalStorageToRedux from "@/hooks/useSyncLocalStorageToRedux";
import countries from "@/data/countries.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  useSyncLocalStorageToRedux();
  const userSettings = useSelector((state: RootState) => state.Settings);
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
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const onSubmit = (data: { [key: string]: string | number }) => {
    dispatch(updateSettings({ ...userSettings, ...data }));
    localStorage.setItem(
      "settings",
      JSON.stringify({ ...userSettings, ...data })
    );
    setIsOpen(false);
  };
  
  const selectedCountry = watch("country");
  const countryCities = useMemo(() => {
    return countries.find((country) => country.iso3 === selectedCountry)
      ?.cities;
  }, [selectedCountry]);
  
  useEffect(() => {
    setValue("city", userSettings.city);
    setValue("country", userSettings.country);
    setValue("waterReminderInterval", userSettings.waterReminderInterval);
    setValue("focusDurationTime", userSettings.focusDurationTime);
    setValue("shortBreakDuration", userSettings.shortBreakDuration);
  }, [userSettings, setValue]);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-2xl">
          <IoMdSettings />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] md:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">الإعدادات</DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4 w-full">
            <p className="font-light">تظبيط الوقت</p>
            <div className="w-full flex items-start gap-4">
              {/* Focus Time */}
              <div className="w-full space-y-2">
                <p className="font-bold">التركيز</p>
                <Input
                  id="focusDurationTime"
                  {...register("focusDurationTime", {
                    required: {
                      value: true,
                      message: "مطلوب",
                    },
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
              <div className="w-full space-y-2">
                <p className="font-bold">البريك</p>
                <Input
                  id="shortBreakDuration"
                  {...register("shortBreakDuration", {
                    required: {
                      value: true,
                      message: "مطلوب",
                    },
                    valueAsNumber: true,
                    validate: {
                      value: (value) => {
                        if (value === 0) {
                          return "مطلوب";
                        }
                        return true;
                      },
                      minValue: (value) => {
                        if (value < 1) {
                          return "لا يمكن ان يكون اقل من دقيقة";
                        }
                        return true;
                      },
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
          </div>
          
          <div className="space-y-2">
            <p className="font-bold">تذكيرات</p>
            <div className="flex items-center gap-4">
              <p className="w-fit whitespace-nowrap">تذكير بشرب الماء كل</p>
              <Input
                {...register(`waterReminderInterval`, {
                  required: {
                    value: true,
                    message: "مطلوب",
                  },
                  valueAsNumber: true,
                  validate: {
                    value: (value) => {
                      if (value === 0) {
                        return "مطلوب";
                      }
                      return true;
                    },
                    minValue: (value) => {
                      if (value < 1) {
                        return "لا يمكن ان يكون اقل من دقيقة";
                      }
                      return true;
                    },
                  },
                })}
                type="number"
                className="text-center"
              />
            </div>
            {errors.waterReminderInterval && (
              <p className="text-xs text-red-500">
                {errors.waterReminderInterval.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="font-bold">الموقع لمواقيت الصلاة</p>
            <div className="flex gap-2">
              <Select
                value={watch("country")}
                onValueChange={(value) => setValue("country", value, { shouldDirty: true })}
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
              
              <Select
                value={watch("city")}
                onValueChange={(value) => setValue("city", value, { shouldDirty: true })}
              >
                <SelectTrigger className="w-full">
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
          
          <Button
            disabled={!isDirty}
            className="w-full"
            type="submit"
          >
            تعديل
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
