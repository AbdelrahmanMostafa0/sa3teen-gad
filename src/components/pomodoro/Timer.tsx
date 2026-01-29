"use client";
import Image from "next/image";
import { useMemo, useEffect } from "react";
import { BiPlay } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { PiPause } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import usePomodoro from "@/hooks/usePomodoro";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Timer = ({
  type = "focus",
}: {
  type?: "focus" | "shortBreak" | "longBreak";
}) => {
  const { timers: { focusDurationTime, longBreakDuration, shortBreakDuration } } = useSelector((state: RootState) => state.Settings);
  const duration = type === "focus" ? focusDurationTime : type === "shortBreak" ? shortBreakDuration : longBreakDuration;
  const isBreak = type === "shortBreak" || type === "longBreak";
  const { hasStarted, minutes, seconds, isActive, togglePomodoro, resetPomodoro } = usePomodoro({ specificMinutes: Number(duration), isBreak, type: type });
  const progress = useMemo(() => {
    const total = Number(duration) * 60;
    const remaining = Number(minutes) * 60 + Number(seconds);
    const passed = total - remaining;

    return Math.min(100, Math.max(0, (passed / total) * 100));
  }, [minutes, seconds, duration]);

  const isGoing = hasStarted || isActive;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = isActive ? `${minutes}:${seconds}` : "ساعتين جد";
    }
  }, [minutes, seconds, isActive]);

  return (
    <div className="w-full md:max-w-[420px] space-y-6 mx-auto">
      {/* TIMER CIRCLE */}
      <div className="relative border-4 border-white/30 shadow-2xl backdrop-blur-sm p-16 
                      rounded-full aspect-square max-w-[420px] mx-auto 
                      flex items-center justify-center overflow-hidden">

        {/* TIME */}
        <p
          dir="ltr"
          className="text-6xl font-semibold tracking-widest text-white drop-shadow-2xl z-20"
        >
          {minutes}:{seconds}
        </p>

        {/* WATER WAVE 1 */}
        <Image
          style={{ top: `${progress + 14}%` }}
          className={`absolute scale-x-[2.8] scale-y-[1.4]  ${hasStarted && "rotate-clockwise"} transition-all duration-300 opacity-40`}
          src={"/water-wave-1.svg"}
          width={450}
          height={450}
          alt=""
        />

        {/* WATER WAVE 2 */}
        <Image
          style={{ top: `${progress + 14}%` }}
          className={`absolute scale-x-[2.8] scale-y-[1.4]  ${hasStarted && "rotate-counterclockwise"} transition-all duration-300 opacity-40`}
          src={"/water-wave-2.svg"}
          width={450}
          height={450}
          alt=""
        />
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-center gap-5">

        {/* PLAY / PAUSE BUTTON */}
        <Button
          onClick={togglePomodoro}
          size="icon"
          className={`h-14 transition-all shadow-lg rounded-full ${isGoing ? "w-14 " : "w-[55%] "
            } ${isActive || hasStarted
              ? "bg-zinc-300 hover:bg-zinc-400 text-black"
              : "bg-green-500 hover:bg-green-600 text-white"
            }`}
        >
          {isActive ? <PiPause size={28} /> : hasStarted ? <BiPlay size={28} /> : <span className="text-xl font-bold">أبدأ</span>}
        </Button>

        {/* RESET BUTTON */}
        {(hasStarted || isActive) && (
          <Button
            onClick={() => resetPomodoro({ finished: false })}
            variant="outline"
            size="icon"
            className="rounded-full w-14 h-14 shadow-md bg-white/30 hover:bg-white/40 backdrop-blur-md border-white/40"
          >
            <GrPowerReset size={26} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
