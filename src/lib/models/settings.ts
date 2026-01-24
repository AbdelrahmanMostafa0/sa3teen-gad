import { SettingsType } from "@/types/user";
import { Schema, model, models } from "mongoose";
export interface ISettings extends SettingsType {
  _id: string;
  userId?: string | null;
  guestId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
const PerPrayerSchema = new Schema(
  {
    pre: { type: Boolean, default: true },
    atTime: { type: Boolean, default: true },
  },
  { _id: false },
);
const SettingsSchema = new Schema<ISettings>(
  {
    userId: {
      type: String,
      index: true,
      default: null,
    },
    guestId: {
      type: String,
      index: true,
      default: null,
    },

    timers: {
      focusDurationTime: { type: Number, default: 25 },
      shortBreakDuration: { type: Number, default: 5 },
      longBreakDuration: { type: Number, default: 15 },
    },

    waterReminder: {
      enabled: { type: Boolean, default: true },
      interval: { type: Number, default: 15 },
    },
    homeTaskFilter: {
      type: String,
      enum: ["today", "week", "month", "all_time"],
      default: "week",
    },
    prayerReminder: {
      enabled: { type: Boolean, default: true },
      preReminderMinutes: { type: Number, default: 10 },
      preReminderEnabled: { type: Boolean, default: true },
      atTimeReminderEnabled: { type: Boolean, default: true },

      perPrayer: {
        Fajr: { type: PerPrayerSchema, default: () => ({}) },
        Dhuhr: { type: PerPrayerSchema, default: () => ({}) },
        Asr: { type: PerPrayerSchema, default: () => ({}) },
        Maghrib: { type: PerPrayerSchema, default: () => ({}) },
        Isha: { type: PerPrayerSchema, default: () => ({}) },
      },
    },

    location: {
      country: { type: String, default: "EGY" },
      city: { type: String, default: "Cairo" },
    },

    ui: {
      prayerTimesPosition: {
        type: String,
        enum: ["top", "left", "right"],
        default: "top",
      },
    },
  },
  {
    timestamps: true,
    strict: "throw",
  },
);

SettingsSchema.pre("validate", function () {
  if (!this.userId && !this.guestId) {
    throw new Error("Settings must belong to a user or a guest");
  }

  if (this.userId && this.guestId) {
    throw new Error("Settings cannot belong to both user and guest");
  }
});

const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);

export default Settings;
