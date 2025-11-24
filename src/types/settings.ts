export interface SettingsType {
  focusDurationTime: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  displayedTimer: "focus" | "shortBreak" | "longBreak";
  autoBreakStart: boolean;
  autoSwitch: boolean;
  isWaterReminderOn: boolean;
  waterReminderInterval: number;
  isPrayerReminderOn: boolean;
  country: string;
  city: string;
}
