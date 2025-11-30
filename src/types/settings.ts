export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type PrayerTimesPosition = "top" | "left" | "right";

export interface PrayerReminderSettings {
  isEnabled: boolean; // Global toggle for all prayer reminders
  preReminderMinutes: number; // Default 10 minutes before prayer
  preReminderEnabled: boolean; // Global toggle for pre-reminders
  atTimeReminderEnabled: boolean; // Global toggle for at-time reminders
  individualPrayers: {
    [key in PrayerName]: {
      preReminderEnabled: boolean;
      atTimeReminderEnabled: boolean;
    };
  };
}

export interface SettingsType {
  focusDurationTime: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  displayedTimer: "focus" | "shortBreak" | "longBreak";
  autoBreakStart: boolean;
  autoSwitch: boolean;
  isWaterReminderOn: boolean;
  waterReminderInterval: number;
  prayerReminderSettings: PrayerReminderSettings;
  country: string;
  city: string;
  prayerTimesPosition: PrayerTimesPosition;
}
