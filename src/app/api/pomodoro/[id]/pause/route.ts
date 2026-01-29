import authMiddleware from "@/lib/middlewares/authMiddleware";
import { pausePomodoroHandler } from "@/lib/handlers/pomodoro/pomodoro.handler";

export const PATCH = authMiddleware(pausePomodoroHandler);
