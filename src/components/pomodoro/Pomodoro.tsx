"use client";
import { useCallback } from "react";
import FocusTimer from "./FocusTimer";
import BreakTime from "./BreakTime";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayedTimer } from "@/store/features/settingsSlice";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="w-full flex justify-center items-center flex-col gap-3 md:w-full md:max-w-[400px] mx-auto px-8">
      <div className="flex gap-4 w-full">
        <Button
          onClick={() => dispatch(updateDisplayedTimer("focus"))}
          variant={displayedTimer === "focus" ? "default" : "secondary"}
          className="w-full"
        >
          تركيز
        </Button>
        <Button
          onClick={() => dispatch(updateDisplayedTimer("shortBreak"))}
          variant={displayedTimer === "shortBreak" ? "default" : "secondary"}
          className="w-full"
        >
          بريك
        </Button>
      </div>
      {renderTimer()}
    </div>
  );
};

export default Pomodoro;
