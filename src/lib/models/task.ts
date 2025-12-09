import { ISubtask, ITask } from "@/types/tasks";
import { Schema, model, models } from "mongoose";

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

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
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true, // Index for faster queries
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);
export const tasksResponse = (task: any) => ({
  id: task._id,
  title: task.title,
  description: task.description,
  subtasks: task.subtasks,
  completed: task.completed,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});
// Compound index for efficient user-specific queries
TaskSchema.index({ userId: 1, createdAt: -1 });

const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;
