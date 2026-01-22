import { getAllTasksHandler } from "@/lib/handlers/tasks/tasks.handler";
import authMiddleware from "@/lib/middlewares/authMiddleware";

export const GET = authMiddleware(getAllTasksHandler);
