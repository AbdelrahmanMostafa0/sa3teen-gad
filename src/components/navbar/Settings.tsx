import { updateSettings } from "@/store/features/settingsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../ui/Modal";
import { useForm } from "react-hook-form";
import useSyncLocalStorageToRedux from "@/hooks/useSyncLocalStorageToRedux";
import countries from "@/data/countries.json";
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
  const seletctedCountry = watch("country");
  const countryCities = useMemo(() => {
    return countries.find((country) => country.iso3 === seletctedCountry)
      ?.cities;
  }, [seletctedCountry]);
  useEffect(() => {
    setValue("city", userSettings.city);
    setValue("country", userSettings.country);
    setValue("waterReminderInterval", userSettings.waterReminderInterval);
    setValue("focusDurationTime", userSettings.focusDurationTime);
    setValue("shortBreakDuration", userSettings.shortBreakDuration);
  }, [userSettings, setValue]);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className=" text-2xl">
        <IoMdSettings />
      </button>
      <Modal
        className="space-y-8 md:max-w-[500px]"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <h5 className="text-2xl">الإعدادات</h5>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2 w-full">
            <p className="font-light">تظبيط الوقت</p>
            <div className="w-full flex items-start gap-4">
              {/* Focus Time */}
              <div className="w-full space-y-2">
                <p>التركيز</p>
                <input
                  {...register("focusDurationTime", {
                    required: {
                      value: true,
                      message: "مطلوب",
                    },
                    valueAsNumber: true,
                  })}
                  type="number"
                  max={999}
                  className="p-3 rounded bg-gray-100 outline-0 w-full"
                />
                {errors.focusDurationTime && (
                  <p className="text-xs text-red-500">
                    {errors.focusDurationTime.message}
                  </p>
                )}
              </div>

              {/* Short Break */}
              <div className="w-full space-y-2">
                <p>البريك </p>
                <input
                  {...register("shortBreakDuration", {
                    required: {
                      value: true,
                      message: " مطلوب",
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
                  // value={shortBreakDuration === 0 ? "" : shortBreakDuration}
                  // onChange={(e) => handleInput(e.target.value, "shortBreak")}
                  type="number"
                  max={999}
                  className="p-3 rounded bg-gray-100 outline-0 w-full"
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
            <p>تذكيرات</p>
            <div className="flex items-center gap-4">
              <p className="w-fit">تذكير بشرب الماء كل</p>
              <input
                {...register(`waterReminderInterval`, {
                  required: {
                    value: true,
                    message: " مطلوب",
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
                className="p-3 rounded bg-gray-100 outline-0 w-full text-center"
              />
            </div>
            {errors.waterReminderInterval && (
              <p className="text-xs text-red-500">
                {errors.waterReminderInterval.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p>الموقع لمواقيت الصلاة</p>{" "}
          </div>
          <div className="flex gap-2">
            <select
              className="w-full flex-1"
              {...register("country")}
              name="country"
              id=""
            >
              {countries.map((country) => {
                return (
                  <option key={country.country} value={country.iso3}>
                    {country.country}
                  </option>
                );
              })}
            </select>
            <select className="w-full flex-1" {...register("city")} id="">
              {countryCities?.map((city) => {
                return (
                  <option key={city} value={city}>
                    {city}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            disabled={!isDirty}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white w-full disabled:opacity-50"
            type="submit"
          >
            تعديل
          </button>
        </form>

        {/* <div className="flex justify-between items-center ">
          <p>بدأ البريك اوتوماتيكى</p>
          <button className="text-4xl rotate-180" onClick={toggleAutoBreak}>
            {autoBreakStart ? <LiaToggleOnSolid /> : <LiaToggleOffSolid />}
          </button>
        </div> */}
      </Modal>
    </>
  );
};

export default Settings;
