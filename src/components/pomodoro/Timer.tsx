import { RootState } from "@/store/store";
import Image from "next/image";
import { useMemo, useEffect } from "react";
import { BiPlay, BiReset } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { PiPause } from "react-icons/pi";
import { useSelector } from "react-redux";

const Timer = ({
  minutes,
  seconds,
  togglePomodoro,
  duration,
  isActive,
  resetPomodoro,
}: {
  minutes: string | number;
  duration: number;
  seconds: string | number;
  togglePomodoro?: () => void;
  resetPomodoro?: () => void;
  isActive?: boolean;
}) => {
  console.log("seconds", seconds);
  const hasStarted = useMemo(() => {
    if (Number(duration) !== Number(minutes)) {
      return true;
    } else {
      return false;
    }
  }, [minutes, duration]);

  const intialMinutes = useMemo(() => {
    return Number(duration);
  }, [duration]);
  const { displayedTimer } = useSelector((state: RootState) => state.Settings);
  console.log("intialMinutes", intialMinutes);
  console.log("intialMinutes", intialMinutes);
  const progress = useMemo(() => {
    const totalSeconds = Number(duration) * 60;
    const remainingSeconds = Number(minutes) * 60 + Number(seconds);
    const passedSeconds = totalSeconds - remainingSeconds;

    const percentage = (passedSeconds / totalSeconds) * 100;
    return Math.min(100, Math.max(0, percentage)); // clamp 0–100
  }, [minutes, seconds, duration]);
  const isGoing = hasStarted || isActive;
  useEffect(() => {
    if (window !== undefined) {
      if (isActive) {
        document.title = `${minutes}:${seconds}`;
      } else {
        document.title = "ساعتين جد";
      }
    }
  }, [displayedTimer, minutes, seconds, isActive]);
  console.log("progress", progress);
  console.log("intialMinutes", Number(intialMinutes));

  return (
    <div className="w-full md:max-w-[400px] space-y-4">
      <div className="md:w-full mx-auto text-center border-4 p-20 flex items-center justify-center rounded-full aspect-square max-w-[400px] overflow-hidden relative">
        <p
          dir="ltr"
          className="text-5xl whitespace-nowrap z-10 mix-blend-multiply"
        >
          <span className="w-10 text-center tracking-widest">{minutes}</span> :{" "}
          <span className="w-10 text-center tracking-widest">{seconds}</span>
        </p>
        <Image
          style={{
            top: `${progress}%`,
          }}
          className="absolute  scale-x-[2.5] scale-y-[1.2] rotate-clockwise duration-150 opacity-50"
          src={"/water-wave-1.svg"}
          width={400}
          height={400}
          alt=""
        />
        <Image
          style={{
            top: `${progress + 3.8}%`,
          }}
          className="absolute scale-x-[2.5] scale-y-[1.2] rotate-counterclockwise  duration-150 opacity-50"
          src={"/water-wave-2.svg"}
          width={400}
          height={400}
          alt=""
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={togglePomodoro}
          className={`text-white  h-12 grid place-items-center duration-75 ${
            isGoing ? "w-12 rounded-full aspect-square " : "w-[50%] rounded-lg"
          } ${isActive || hasStarted ? "bg-gray-400" : "bg-green-500"} `}
        >
          {isActive ? <PiPause size={25} /> : <BiPlay size={25} />}
        </button>
        {(hasStarted || isActive) && (
          <button
            onClick={resetPomodoro}
            className=" rounded-full w-12 h-12 grid place-items-center aspect-square bg-white"
          >
            <GrPowerReset size={25} />
          </button>
        )}
      </div>
      {/* {togglePomodoro && (
        <button
          onClick={togglePomodoro}
          className="text-white bg-slate-900 w-full rounded-xl py-3"
        >
          {isActive ? "وقف" : "أبدأ"}
        </button>
      )} */}
    </div>
  );
};
export default Timer;
