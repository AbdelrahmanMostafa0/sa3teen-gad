import authMiddleware from "@/lib/middlewares/authMiddleware";
import { terminatePomodoroHandler } from "@/lib/handlers/pomodoro/pomodoro.handler";

export const PATCH = authMiddleware(terminatePomodoroHandler);
