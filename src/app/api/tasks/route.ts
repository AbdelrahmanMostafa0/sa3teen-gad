import authMiddleware from "@/lib/middlewares/authMiddleware";
import {
  createTaskHandler,
  getAllTasksHandler,
} from "@/lib/handlers/tasks/tasks.handler";

export const GET = authMiddleware(getAllTasksHandler);
export const POST = authMiddleware(createTaskHandler);
