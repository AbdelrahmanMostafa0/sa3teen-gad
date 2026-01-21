import { reorderTaskHandler } from "@/lib/handlers/tasks/tasks.handler";
import authMiddleware from "@/lib/middlewares/authMiddleware";

export const PUT = authMiddleware(reorderTaskHandler);
