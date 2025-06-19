import { PomodoroInitialState } from "@/types/pomodora";
import { useSelector } from "react-redux";
import Timer from "./Timer";
import usePomodoro from "@/hooks/usePomodoro";

const BreakTime = () => {
  const { shortBreakDuration } = useSelector(
    (state: { Pomodoro: PomodoroInitialState }) => state.Pomodoro
  );
  const { minutes, seconds, isActive, togglePomodoro } = usePomodoro({
    isBreak: true,
    specificMinutes: shortBreakDuration,
  });
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
