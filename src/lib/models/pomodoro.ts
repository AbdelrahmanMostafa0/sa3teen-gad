import { IPomodoroSession } from "@/types/pomodoro";
import { Schema, model, models } from "mongoose";

const PauseSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date },
});

const PomodoroSessionSchema = new Schema<IPomodoroSession>(
  {
    userId: {
      type: String,
      ref: "User",
      index: true,
      default: null,
    },
    guestId: {
      type: String,
      index: true,
      default: null,
    },
    type: {
      type: String,
      enum: ["focus", "shortBreak", "longBreak"],
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // Minimum 1 minute
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastPing: {
      type: Date,
      required: true,
      default: Date.now,
    },
    pauses: {
      type: [PauseSchema],
      default: [],
    },
    totalPausedTime: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    isTerminated: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

PomodoroSessionSchema.index({ userId: 1, startedAt: -1 });

PomodoroSessionSchema.pre("validate", async function () {
  if (!this.userId && !this.guestId) {
    throw new Error("Session must belong to a user or a guest");
  }

  if (this.userId && this.guestId) {
    throw new Error("Session cannot belong to both user and guest");
  }
});

const PomodoroSession =
  models.PomodoroSession ||
  model<IPomodoroSession>("PomodoroSession", PomodoroSessionSchema);

export default PomodoroSession;
