import authMiddleware from "@/lib/middlewares/authMiddleware";
import {
  createTaskHandler,
  getTaskWithFiltersHandler,
} from "@/lib/handlers/tasks/tasks.handler";

export const GET = authMiddleware(getTaskWithFiltersHandler);
export const POST = authMiddleware(createTaskHandler);
