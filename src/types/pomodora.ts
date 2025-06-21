export interface PomodoroInitialState {
  focusDurationTime: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  displayedTimer: "focus" | "shortBreak" | "longBreak";
  autoBreakStart: boolean;
  autoSwitch: boolean;
}
