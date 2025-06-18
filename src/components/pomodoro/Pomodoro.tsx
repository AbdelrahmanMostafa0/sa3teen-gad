"use client";
import usePomodoro from "@/hooks/usePomodoro";
import { useState } from "react";

const Pomodoro = () => {
  const [PomoTimer, setPomoTimer] = useState<number>(1);
  const { isActive, togglePomodoro, minutes, seconds, finished } = usePomodoro({
    sepcificMinutes: PomoTimer,
  });
  return (
    <div className=" w-full flex justify-center items-center flex-col gap-3">
      {!isActive && (
        <input
          disabled={isActive}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value)) {
              setPomoTimer(value);
            }
          }}
          value={PomoTimer}
          type="text"
          className="bg-white p-3 rounded  text-center w-24 disabled:opacity-50"
        />
      )}

      <p dir="ltr">
        <span className="w-10 text-center tracking-widest">{minutes}</span> :{" "}
        <span className="w-10 text-center tracking-widest">{seconds}</span>
      </p>
      {finished && <p>Finished</p>}
      <button onClick={togglePomodoro}>{isActive ? "Stop" : "Start"}</button>
    </div>
  );
};
export default Pomodoro;
