export interface PomodoroInitialState {
  focusDurationTime: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  focusTimer: {
    minutes: number;
    seconds: number;
  };
  shortBreakTimer: {
    minutes: number;
    seconds: number;
  };
  longBreakTimer: {
    minutes: number;
    seconds: number;
  };
  isLongBreak: boolean;
  isFocusActive: boolean;
  isBreakActive: boolean;
  displayedTimer: "focus" | "shortBreak" | "longBreak";
}
