import { SettingsType } from "@/types/settings";
import { defaultSettings, IUser } from "@/types/user";
import { Schema, model, models } from "mongoose";
// export const settingsDefault: SettingsType = {
//   focusDurationTime: 25,
//   shortBreakDuration: 5,
//   longBreakDuration: 15,
//   displayedTimer: "focus",
//   autoBreakStart: false,
//   autoSwitch: false,
//   isWaterReminderOn: true,
//   waterReminderInterval: 20,
//   prayerReminderSettings: {
//     isEnabled: true,
//     preReminderMinutes: 10,
//     preReminderEnabled: true,
//     atTimeReminderEnabled: true,
//     individualPrayers: {
//       Fajr: { preReminderEnabled: true, atTimeReminderEnabled: true },
//       Dhuhr: { preReminderEnabled: true, atTimeReminderEnabled: true },
//       Asr: { preReminderEnabled: true, atTimeReminderEnabled: true },
//       Maghrib: { preReminderEnabled: true, atTimeReminderEnabled: true },
//       Isha: { preReminderEnabled: true, atTimeReminderEnabled: true },
//     },
//   },
//   country: "EGY",
//   city: "Cairo",
//   prayerTimesPosition: "top",
// };
// export interface IUser {
//   _id: string;
//   fullName: string;
//   email: string;
//   password?: string; // Optional for OAuth users
//   provider: string;
//   profilePicture?: string;
//   googleId?: string;
//   settings?: SettingsType;
//   createdAt: Date;
//   updatedAt: Date;
//   lastLoginAt?: Date;
// }

export const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't return password by default
    },
    profilePicture: {
      type: String,
      default: null,
    },

    // Authentication
    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    settings: {
      type: Schema.Types.Mixed,
      default: defaultSettings,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
