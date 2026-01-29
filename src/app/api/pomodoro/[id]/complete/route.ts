import authMiddleware from "@/lib/middlewares/authMiddleware";
import { completePomodoroHandler } from "@/lib/handlers/pomodoro/pomodoro.handler";

export const PATCH = authMiddleware(completePomodoroHandler);
