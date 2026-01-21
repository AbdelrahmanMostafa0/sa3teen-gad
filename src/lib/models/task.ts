import { ISubtask, ITask } from "@/types/tasks";
import { Schema, model, models } from "mongoose";

const SubtaskSchema = new Schema<ISubtask>({
  title: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [500, "Title cannot exceed 500 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    subtasks: {
      type: [SubtaskSchema],
      default: [],
    },
    prevTaskId: {
      type: String,
      index: true,
      default: null,
    },
    nextTaskId: {
      type: String,
      index: true,
      default: null,
    },
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
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const tasksResponse = (task: ITask) => ({
  id: task._id,
  title: task.title,
  description: task.description,
  subtasks: task.subtasks,
  prevTaskId: task.prevTaskId,
  nextTaskId: task.nextTaskId,
  completed: task.completed,
  completedAt: task.completedAt,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.pre("validate", async function () {
  if (!this.userId && !this.guestId) {
    throw new Error("Task must belong to a user or a guest");
  }

  if (this.userId && this.guestId) {
    throw new Error("Task cannot belong to both user and guest");
  }
});

const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;
