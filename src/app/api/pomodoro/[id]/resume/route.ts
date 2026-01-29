import authMiddleware from "@/lib/middlewares/authMiddleware";
import { resumePomodoroHandler } from "@/lib/handlers/pomodoro/pomodoro.handler";

export const PATCH = authMiddleware(resumePomodoroHandler);
