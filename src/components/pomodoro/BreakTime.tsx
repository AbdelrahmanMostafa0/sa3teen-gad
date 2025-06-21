import { PomodoroInitialState } from "@/types/pomodora";
import { useDispatch, useSelector } from "react-redux";
import Timer from "./Timer";
import usePomodoro from "@/hooks/usePomodoro";
import { useEffect } from "react";
// import { updateAutoSwitch } from "@/store/features/pomodoroSlice";

const BreakTime = () => {
  const { shortBreakDuration, autoSwitch, autoBreakStart } = useSelector(
    (state: { Pomodoro: PomodoroInitialState }) => state.Pomodoro
  );
  const dispatch = useDispatch();
  const { minutes, seconds, isActive, togglePomodoro } = usePomodoro({
    isBreak: true,
    specificMinutes: shortBreakDuration,
  });
  useEffect(() => {
    if (autoBreakStart && autoSwitch && !isActive) {
      // dispatch(updateAutoSwitch(false));
      togglePomodoro();
    }
  }, [autoBreakStart, autoSwitch, isActive, togglePomodoro, dispatch]);
  return (
    <Timer
      minutes={minutes}
      seconds={seconds}
      togglePomodoro={togglePomodoro}
      isActive={isActive}
    />
  );
};
export default BreakTime;
