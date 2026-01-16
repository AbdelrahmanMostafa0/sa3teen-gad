import { NextResponse } from "next/server";

const RATE_LIMIT = 100;
const WINDOW = 30_000; // 30 seconds
const ipCache = new Map<string, number[]>();

export default function middleware(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || (req as any).ip || "unknown";

  const now = Date.now();

  const timestamps = ipCache.get(ip) || [];
  const filtered = timestamps.filter((t) => now - t < WINDOW);

  if (filtered.length >= RATE_LIMIT) {
    return new NextResponse(
      JSON.stringify({
        message: "Too Many Requests",
        status: 429,
        success: false,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  filtered.push(now);
  ipCache.set(ip, filtered);

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
