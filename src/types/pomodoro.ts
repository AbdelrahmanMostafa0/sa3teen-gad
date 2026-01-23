import { Document } from "mongoose";

export type PomodoroType = "focus" | "shortBreak" | "longBreak";

export interface IPause {
  start: Date;
  end?: Date;
}

export interface IPomodoroSession extends Document {
  userId?: string;
  guestId?: string;
  type: PomodoroType;
  duration: number; // planned duration in minutes
  startedAt: Date;
  endedAt?: Date;
  completed: boolean;
  lastPing: Date;
  pauses: IPause[];
  totalPausedTime: number; // in seconds
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
