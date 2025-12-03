import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface JWTPayload {
  userId: string;
  email: string;
  fullName: string;
}

export function generateToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "30d",
  });
}

export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    return decoded as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as JWTPayload;
  } catch (error) {
    console.error("JWT decode failed:", error);
    return null;
  }
}
