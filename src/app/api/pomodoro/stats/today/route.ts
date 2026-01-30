import authMiddleware from "@/lib/middlewares/authMiddleware";
import { getTodayStatsHandler } from "@/lib/handlers/pomodoro/pomodoro.handler";

export const GET = authMiddleware(getTodayStatsHandler);
