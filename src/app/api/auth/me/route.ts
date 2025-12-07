import authMiddleware from "@/lib/middlewares/authMiddleware";
import {
  getUserHandler,
  updateUserHandler,
} from "@/lib/handlers/auth/me.handler";

export const GET = authMiddleware(getUserHandler);

export const PUT = authMiddleware(updateUserHandler);
