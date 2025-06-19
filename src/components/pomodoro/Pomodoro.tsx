"use client";
import { useCallback, useState } from "react";
import FocusTimer from "./FocusTimer";
import BreakTime from "./BreakTime";
import { IoMdSettings } from "react-icons/io";
import Modal from "../ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import { PomodoroInitialState } from "@/types/pomodora";
import { updateDurationTime } from "@/store/features/pomodoroSlice";

const Pomodoro = () => {
  const [viewdTimer, setViewdTimer] = useState<"pomo" | "break">("pomo");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const renderTimer = useCallback(() => {
    switch (viewdTimer) {
      case "pomo":
        return <FocusTimer />;
      case "break":
        return <BreakTime />;
    }
  }, [viewdTimer]);
  const { focusDurationTime, longBreakDuration, shortBreakDuration } =
    useSelector((state: { Pomodoro: PomodoroInitialState }) => state.Pomodoro);
  return (
    <div className=" w-full flex justify-center items-center flex-col gap-3 md:w-full md:max-w-[400px] mx-auto px-8">
      <div className="flex gap-4 w-full">
        <div className="flex gap-4 w-full">
          <button
            onClick={() => setViewdTimer("pomo")}
            className={`px-4 py-2 rounded-lg bg-gray-300/70 w-full  ${
              viewdTimer === "pomo" && "bg-slate-700 text-white"
            }`}
          >
            تركيز
          </button>
          <button
            onClick={() => setViewdTimer("break")}
            className={`px-4 py-2 rounded-lg bg-gray-300/70  w-full ${
              viewdTimer === "break" && "bg-slate-700 text-white"
            }`}
          >
            بريك
          </button>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-6 right-8 text-2xl"
        >
          <IoMdSettings />
        </button>
      </div>
      {renderTimer()}
      <Modal className="space-y-8" isOpen={isOpen} setIsOpen={setIsOpen}>
        <h5 className="text-2xl ">الإعدادات</h5>
        <div className="space-y-2 w-full">
          <p className=" font-light">تظبيط الوقت</p>
          <div className="w-full flex items-center gap-4">
            <div className="w-full space-y-2">
              <p>التركيز</p>
              <input
                defaultValue={focusDurationTime}
                onChange={(e) => {
                  console.log(Number(e.target.value));

                  dispatch(updateDurationTime(Number(e.target.value)));
                }}
                type="number"
                max={999}
                min={1}
                className="p-3 rounded bg-gray-100 outline-0 w-full"
              />
            </div>
            <div className="w-full space-y-2">
              <p>بريك صغنن</p>
              <input
                defaultValue={shortBreakDuration}
                type="number"
                max={999}
                min={1}
                className="p-3 rounded bg-gray-100 outline-0 w-full"
              />
            </div>
            <div className="w-full space-y-2">
              <p>بريك كبير</p>
              <input
                defaultValue={longBreakDuration}
                type="number"
                max={999}
                min={1}
                className="p-3 rounded bg-gray-100 outline-0 w-full"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Pomodoro;
