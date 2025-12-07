import { NextRequest } from "next/server";
import { googleHandler } from "@/lib/handlers/auth/google.handler";

export async function POST(req: NextRequest) {
  return googleHandler(req);
}
