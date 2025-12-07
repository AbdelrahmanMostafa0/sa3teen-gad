import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../jwt";

// Extend NextRequest to include user data
export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

type AuthHandler = (req: AuthenticatedRequest) => Promise<NextResponse>;

export default function authMiddleware(handler: AuthHandler) {
  return async (req: NextRequest) => {
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

    // Attach decoded user data to the request
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    return handler(authenticatedReq);
  };
}
