import authMiddleware from "@/lib/middlewares/authMiddleware";
import { getIncompleteTasksHandler } from "@/lib/handlers/tasks/tasks.handler";

export const GET = authMiddleware(getIncompleteTasksHandler);
