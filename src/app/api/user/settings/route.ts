import authMiddleware from "@/lib/middlewares/authMiddleware";
import {
  getSettings,
  updateSettings,
} from "@/lib/handlers/auth/settings.handler";

export const GET = authMiddleware(getSettings);

export const PUT = authMiddleware(updateSettings);
