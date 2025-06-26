import { useSelector } from "react-redux";
import Timer from "./Timer";
import usePomodoro from "@/hooks/usePomodoro";
import { RootState } from "@/store/store";

const FocusTimer = () => {
  const { focusDurationTime } = useSelector(
    (state: RootState) => state.Settings
  );
  const { minutes, seconds, isActive, togglePomodoro } = usePomodoro({
    isBreak: false,
    specificMinutes: focusDurationTime,
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
export default FocusTimer;
