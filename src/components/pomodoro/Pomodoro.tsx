"use client";
import usePomodoro from "@/hooks/usePomodoro";
import { useEffect, useState } from "react";

const Pomodoro = () => {
  const [PomoTimer, setPomoTimer] = useState<number>(1);
  const {
    isActive,
    togglePomodoro,
    minutes,
    seconds,
    finished,
    startPomodoro,
  } = usePomodoro({
    specificMinutes: PomoTimer,
  });
  const {
    minutes: breakMin,
    seconds: breakSec,
    startPomodoro: startBreak,
  } = usePomodoro({ specificMinutes: 1, isBreak: true });
  useEffect(() => {
    if (finished) {
      startBreak();
    }
  }, [finished]);
  return (
    <div className=" w-full flex justify-center items-center flex-col gap-3">
      {finished ? (
        <p dir="ltr">
          <span className="w-10 text-center tracking-widest">{breakMin}</span> :{" "}
          <span className="w-10 text-center tracking-widest">{breakSec}</span>
        </p>
      ) : (
        <>
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
            <span className="w-10 text-center tracking-widest">{minutes}</span>{" "}
            :{" "}
            <span className="w-10 text-center tracking-widest">{seconds}</span>
          </p>
          {finished && <p>Finished</p>}
          <button onClick={isActive ? togglePomodoro : startPomodoro}>
            {isActive ? "Stop" : "Start"}
          </button>
        </>
      )}
    </div>
  );
};
export default Pomodoro;
