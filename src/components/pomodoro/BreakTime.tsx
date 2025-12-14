import { useDispatch, useSelector } from "react-redux";
import Timer from "./Timer";
import usePomodoro from "@/hooks/usePomodoro";
import { useEffect } from "react";
import { RootState } from "@/store/store";
import { useUser } from "@/hooks/useUser";
// import { updateAutoSwitch } from "@/store/features/settingsSlice";

const BreakTime = ({ breakType = "shortBreak" }: { breakType: "shortBreak" | "longBreak" }) => {
  const { timers: { shortBreakDuration, longBreakDuration } } = useSelector(
    (state: RootState) => state.Settings
  );
  const dispatch = useDispatch();
  console.log(shortBreakDuration, longBreakDuration);
  const duration = breakType === "longBreak" ? longBreakDuration : shortBreakDuration;
  const { minutes, seconds, isActive, togglePomodoro, resetPomodoro } =
    usePomodoro({
      isBreak: true,
      specificMinutes: duration,
    });
  // useEffect(() => {
  //   if (autoBreakStart && autoSwitch && !isActive) {
  //     // dispatch(updateAutoSwitch(false));
  //     togglePomodoro();
  //   }
  // }, [autoBreakStart, autoSwitch, isActive, togglePomodoro, dispatch]);
  return (
    <Timer
      resetPomodoro={resetPomodoro}
      duration={duration}
      minutes={minutes}
      seconds={seconds}
      togglePomodoro={togglePomodoro}
      isActive={isActive}
    />
  );
};
export default BreakTime;
