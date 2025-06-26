"use client";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./ui/Modal";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  // updateAutoBreakStart,
  updateFocusDuration,
  updateLongBreakDuration,
  // updatePomoSettings,
  updateShortBreakDuration,
  updateWaterReminderInterval,
} from "@/store/features/settingsSlice";
import { IoMdSettings } from "react-icons/io";
import { AppDispatch, RootState } from "@/store/store";
import { useTime } from "@/context/TimeContext";
// import { LiaToggleOffSolid, LiaToggleOnSolid } from "react-icons/lia";

const Settings = () => {
  const time = useTime();
  console.log(time);

  const {
    focusDurationTime,
    shortBreakDuration,
    longBreakDuration,
    // autoBreakStart,
    waterReminderInterval,
  } = useSelector((state: RootState) => state.Settings);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const toggleAutoBreak = () => {
  //   dispatch(updateAutoBreakStart(!autoBreakStart));
  // };
  // Load settings from localStorage on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings = localStorage.getItem("settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        dispatch(updateFocusDuration(parsed.focusDurationTime));
        dispatch(updateShortBreakDuration(parsed.shortBreakDuration));
        dispatch(updateLongBreakDuration(parsed.longBreakDuration));
      }
    }
  }, [dispatch]);
  useEffect(() => {}, [focusDurationTime, shortBreakDuration]);

  const updateDuration = (
    duration: number,
    type: "focus" | "shortBreak" | "longBreak"
  ) => {
    let newFocus = focusDurationTime;
    let newShort = shortBreakDuration;
    let newLong = longBreakDuration;

    if (type === "focus") {
      newFocus = duration;
      dispatch(updateFocusDuration(duration));
    } else if (type === "shortBreak") {
      newShort = duration;
      dispatch(updateShortBreakDuration(duration));
    } else if (type === "longBreak") {
      newLong = duration;
      dispatch(updateLongBreakDuration(duration));
    }

    localStorage.setItem(
      "settings",
      JSON.stringify({
        focusDurationTime: newFocus,
        shortBreakDuration: newShort,
        longBreakDuration: newLong,
      })
    );
  };
  const handleInput = (
    value: string,
    type: "focus" | "shortBreak" | "longBreak" | "waterReminder"
  ) => {
    // Remove leading zeros (preserves "0" as 0, but "05" becomes 5)
    const clean = value.startsWith("0") ? value.slice(1) : value;
    if (type === "waterReminder") {
      dispatch(updateWaterReminderInterval(Number(clean)));
    } else {
      updateDuration(Number(clean), type);
    }
  };
  return (
    <div className="fixed top-6 flex items-center gap-4 justify-between px-8 w-full">
      <p className=" px-4 py-2 bg-slate-800 rounded-full text-white text-sm">
        {format(time, "hh:mm:ss a").replace("AM", "ص").replace("PM", "م")}
      </p>
      <button onClick={() => setIsOpen(true)} className=" text-2xl">
        <IoMdSettings />
      </button>

      <Modal
        className="space-y-8 md:max-w-[500px]"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <h5 className="text-2xl">الإعدادات</h5>
        <div className="space-y-2 w-full">
          <p className="font-light">تظبيط الوقت</p>
          <div className="w-full flex items-center gap-4">
            {/* Focus Time */}
            <div className="w-full space-y-2">
              <p>التركيز</p>
              <input
                value={focusDurationTime === 0 ? "" : focusDurationTime}
                onChange={(e) => handleInput(e.target.value, "focus")}
                type="number"
                max={999}
                className="p-3 rounded bg-gray-100 outline-0 w-full"
              />
            </div>

            {/* Short Break */}
            <div className="w-full space-y-2">
              <p>بريك صغنن</p>
              <input
                value={shortBreakDuration === 0 ? "" : shortBreakDuration}
                onChange={(e) => handleInput(e.target.value, "shortBreak")}
                type="number"
                max={999}
                className="p-3 rounded bg-gray-100 outline-0 w-full"
              />
            </div>

            {/* Long Break */}
            {/* <div className="w-full space-y-2">
              <p>بريك كبير</p>
              <input
                value={longBreakDuration === 0 ? "" : longBreakDuration}
                onChange={(e) => handleInput(e.target.value, "longBreak")}
                type="number"
                max={999}
                min={1}
                className="p-3 rounded bg-gray-100 outline-0 w-full"
              />
            </div> */}
          </div>
        </div>
        {/* <div className="flex justify-between items-center ">
          <p>بدأ البريك اوتوماتيكى</p>
          <button className="text-4xl rotate-180" onClick={toggleAutoBreak}>
            {autoBreakStart ? <LiaToggleOnSolid /> : <LiaToggleOffSolid />}
          </button>
        </div> */}
        <div className="space-y-2">
          <p>تذكيرات</p>
          <div className="flex items-center gap-4">
            <p className="w-">تذكير بشرب الماء كل</p>
            <input
              value={waterReminderInterval === 0 ? "" : waterReminderInterval}
              onChange={(e) => handleInput(e.target.value, "waterReminder")}
              type="number"
              max={999}
              className="p-3 rounded bg-gray-100 outline-0 w-20 text-center"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
