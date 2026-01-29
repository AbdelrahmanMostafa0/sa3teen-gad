import authMiddleware from "@/lib/middlewares/authMiddleware";
import { createPomodoroHandler } from "@/lib/handlers/pomodoro/pomodoro.handler";

export const POST = authMiddleware(createPomodoroHandler);
