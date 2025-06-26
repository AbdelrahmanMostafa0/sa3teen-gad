"use client";
import { useCallback } from "react";
import FocusTimer from "./FocusTimer";
import BreakTime from "./BreakTime";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayedTimer } from "@/store/features/settingsSlice";
import { RootState } from "@/store/store";
const Pomodoro = () => {
  const dispatch = useDispatch();
  const { displayedTimer } = useSelector((state: RootState) => state.Settings);
  const renderTimer = useCallback(() => {
    switch (displayedTimer) {
      case "focus":
        return <FocusTimer />;
      case "shortBreak":
        return <BreakTime />;
    }
  }, [displayedTimer]);
  console.log(
    "pomooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
  );

  return (
    <div className=" w-full flex justify-center items-center flex-col gap-3 md:w-full md:max-w-[400px] mx-auto px-8">
      <div className="flex gap-4 w-full">
        <div className="flex gap-4 w-full">
          <button
            onClick={() => {
              dispatch(updateDisplayedTimer("focus"));
            }}
            className={`px-4 py-2 rounded-lg bg-gray-300/70 w-full  ${
              displayedTimer === "focus" && "bg-slate-700 text-white"
            }`}
          >
            تركيز
          </button>
          <button
            onClick={() => {
              dispatch(updateDisplayedTimer("shortBreak"));
            }}
            className={`px-4 py-2 rounded-lg bg-gray-300/70  w-full ${
              displayedTimer === "shortBreak" && "bg-slate-700 text-white"
            }`}
          >
            بريك
          </button>
        </div>
      </div>
      {renderTimer()}
    </div>
  );
};
export default Pomodoro;
