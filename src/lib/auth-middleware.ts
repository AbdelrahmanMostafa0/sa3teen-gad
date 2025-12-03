import { NextRequest } from "next/server";
import { verifyToken, JWTPayload } from "@/lib/jwt";

export function getAuthUser(req: NextRequest): JWTPayload | null {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    return decoded;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return null;
  }
}

export function isAuthenticated(req: NextRequest): boolean {
  return getAuthUser(req) !== null;
}
