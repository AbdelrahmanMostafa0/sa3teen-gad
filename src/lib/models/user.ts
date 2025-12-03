import { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password?: string; // Optional for OAuth users
  provider: string;
  profilePicture?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

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
