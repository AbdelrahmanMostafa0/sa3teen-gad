const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof PRAYER_NAMES)[number];
export const defaultSettings: SettingsType = {
  timers: {
    focusDurationTime: 25,
    shotBreakDuration: 5,
    longBreakDuration: 15,
  },
  waterReminder: {
    enabled: false,
    interval: 15,
  },
  prayerReminder: {
    enabled: false,
    preReminderMinutes: 10,
    preReminderEnabled: true,
    atTimeReminderEnabled: true,
    perPrayer: {
      Fajr: { pre: true, atTime: true },
      Dhuhr: { pre: true, atTime: true },
      Asr: { pre: true, atTime: true },
      Maghrib: { pre: true, atTime: true },
      Isha: { pre: true, atTime: true },
    },
  },
  location: {
    country: "",
    city: "",
  },
  ui: {
    prayerTimesPosition: "top",
  },
};
export interface SettingsType {
  timers: {
    focusDurationTime: number;
    shotBreakDuration: number;
    longBreakDuration: number;
  };
  waterReminder: {
    enabled: boolean;
    interval: number;
  };
  prayerReminder: {
    enabled: boolean;
    preReminderMinutes: number;
    preReminderEnabled: boolean;
    atTimeReminderEnabled: boolean;
    perPrayer: {
      [key in PrayerName]: {
        pre: boolean;
        atTime: boolean;
      };
    };
  };
  location: {
    country: string;
    city: string;
  };
  ui: {
    prayerTimesPosition: "top" | "left" | "right";
  };
}
export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password?: string;
  profilePicture: string;
  provider: string;
  googleId?: string;
  settings: SettingsType;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
