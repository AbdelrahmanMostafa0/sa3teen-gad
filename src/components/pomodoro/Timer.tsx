import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Timer = ({
  minutes,
  seconds,
  togglePomodoro,
  isActive,
}: {
  minutes: string | number;
  seconds: string | number;
  togglePomodoro?: () => void;
  isActive?: boolean;
}) => {
  const { displayedTimer } = useSelector((state: RootState) => state.Settings);
  useEffect(() => {
    if (window !== undefined) {
      if (isActive) {
        document.title = `${minutes}:${seconds}`;
      } else {
        document.title = "ساعتين جد";
      }
    }
  }, [displayedTimer, minutes, seconds, isActive]);
  return (
    <div className="w-full md:max-w-[400px] space-y-4">
      <div className="md:w-full mx-auto text-center border-4 p-10 md:py-20 rounded-xl ">
        <p dir="ltr" className="text-5xl">
          <span className="w-10 text-center tracking-widest">{minutes}</span> :{" "}
          <span className="w-10 text-center tracking-widest">{seconds}</span>
        </p>
      </div>
      {togglePomodoro && (
        <button
          onClick={togglePomodoro}
          className="text-white bg-slate-900 w-full rounded-xl py-3"
        >
          {isActive ? "وقف" : "أبدأ"}
        </button>
      )}
    </div>
  );
};
export default Timer;
