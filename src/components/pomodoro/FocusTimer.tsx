import { useSelector } from "react-redux";
import Timer from "./Timer";
import usePomodoro from "@/hooks/usePomodoro";
import { RootState } from "@/store/store";

const FocusTimer = () => {
  const { timers: { focusDurationTime } } = useSelector(
    (state: RootState) => state.Settings
  );
  const { minutes, seconds, isActive, togglePomodoro, resetPomodoro } =
    usePomodoro({
      isBreak: false,
      specificMinutes: focusDurationTime,
    });

  return (
    <Timer
      duration={focusDurationTime}
      minutes={minutes}
      seconds={seconds}
      togglePomodoro={togglePomodoro}
      isActive={isActive}
      resetPomodoro={resetPomodoro}
    />
  );
};
export default FocusTimer;
