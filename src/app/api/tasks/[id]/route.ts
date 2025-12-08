import authMiddleware from "@/lib/middlewares/authMiddleware";
import {
  deleteTaskHandler,
  getSingleTask,
  updateTaskHandler,
} from "@/lib/handlers/tasks/tasks.handler";

export const GET = authMiddleware(getSingleTask);

export const PATCH = authMiddleware(updateTaskHandler);

export const DELETE = authMiddleware(deleteTaskHandler);
