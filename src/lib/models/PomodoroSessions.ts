import { Schema, model, models } from "mongoose";

const PauseIntervalSchema = new Schema({
  pauseStart: { type: Date, required: true },
  pauseEnd: { type: Date, default: null },
});

const PomodoroSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    durationMinutes: { type: Number, default: null },
    taskName: { type: String, default: null },
    isPomodoro: { type: Boolean, default: true },
    pauseIntervals: { type: [PauseIntervalSchema], default: [] },
  },
  { timestamps: true }
);

PomodoroSessionSchema.index({ userId: 1, startTime: 1 });

PomodoroSessionSchema.pre("save", function () {
  if (this.endTime) {
    const total = this.endTime.getTime() - this.startTime.getTime();

    const pauseMs = this.pauseIntervals.reduce((acc, p) => {
      if (!p.pauseEnd) return acc;
      return acc + (p.pauseEnd.getTime() - p.pauseStart.getTime());
    }, 0);

    this.durationMinutes = Math.max(0, Math.floor((total - pauseMs) / 60000));
  }
});

export const PomodoroSession =
  models.PomodoroSession || model("PomodoroSession", PomodoroSessionSchema);
