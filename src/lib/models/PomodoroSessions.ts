import { Schema, model, models } from "mongoose";
interface IPauseInterval {
  pauseStart: Date;
  pauseEnd: Date;
}
export interface IPomodoroSession {
  userId: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  taskName?: string;
  isPomodoro: boolean;
  pauseIntervals?: IPauseInterval[];
}

const PomodoroSessionSchema: Schema<IPomodoroSession> = new Schema(
  {
    userId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    taskName: { type: String, default: null },
    pauseIntervals: { type: [Object], default: [] },
    isPomodoro: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PomodoroSessionSchema.index({ userId: 1, startTime: 1 });

export const PomodoroSession =
  models.PomodoroSession || model("PomodoroSession", PomodoroSessionSchema);
