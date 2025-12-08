import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../jwt";

// authMiddleware.ts
export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

type AuthHandler<T = any> = (
  req: AuthenticatedRequest,
  context?: T
) => Promise<NextResponse>;

export default function authMiddleware<T = any>(handler: AuthHandler<T>) {
  return async (req: NextRequest, context?: T) => {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "رمز غير صالح" },
        { status: 401 }
      );
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    return handler(authenticatedReq, context);
  };
}
