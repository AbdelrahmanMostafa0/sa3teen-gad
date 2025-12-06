import { useSelector } from "react-redux";
import Timer from "./Timer";
import usePomodoro from "@/hooks/usePomodoro";
import { RootState } from "@/store/store";
import { useUser } from "@/hooks/useUser";

const FocusTimer = () => {
  const { focusDurationTime } = useSelector(
    (state: RootState) => state.Settings
  );
  const { user } = useUser();
  const { minutes, seconds, isActive, togglePomodoro, resetPomodoro } =
    usePomodoro({
      isBreak: false,
      specificMinutes: user?.settings?.timers?.focusDurationTime || focusDurationTime,
    });
  console.log(user?.settings?.timers?.focusDurationTime);

  return (
    <Timer
      duration={user?.settings?.timers?.focusDurationTime || focusDurationTime}
      minutes={minutes}
      seconds={seconds}
      togglePomodoro={togglePomodoro}
      isActive={isActive}
      resetPomodoro={resetPomodoro}
    />
  );
};
export default FocusTimer;
