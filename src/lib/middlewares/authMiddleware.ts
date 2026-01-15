import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../jwt";
import { v4 as uuid } from "uuid";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId?: string;
    email?: string;
    guestId?: string;
  };
}

type AuthHandler<T> = (
  req: AuthenticatedRequest,
  context?: T
) => Promise<NextResponse>;

export default function authMiddleware<T>(handler: AuthHandler<T>) {
  return async (req: NextRequest, context?: T) => {
    const token = req.cookies.get("token")?.value;
    const guestId = req.cookies.get("guestId")?.value;
    const decoded = token ? verifyToken(token as string) : null;
    console.log(guestId);

    const authenticatedReq = req as AuthenticatedRequest;

    if (decoded) {
      authenticatedReq.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    } else {
      if (!guestId) {
        // Generate new guest ID
        const newGuestId = uuid();
        authenticatedReq.user = {
          guestId: newGuestId,
        };

        // Execute the handler first
        const response = await handler(authenticatedReq, context);

        // Set the cookie on the response
        response.cookies.set({
          name: "guestId",
          value: newGuestId,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 365 * 5, // 5 years
        });

        return response;
      } else {
        authenticatedReq.user = {
          guestId,
        };
      }
    }

    return handler(authenticatedReq, context);
  };
}
