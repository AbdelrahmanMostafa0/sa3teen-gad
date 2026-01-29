import authMiddleware from "@/lib/middlewares/authMiddleware";
import { pingPomodoroHandler } from "@/lib/handlers/pomodoro/pomodoro.handler";

export const PATCH = authMiddleware(pingPomodoroHandler);
