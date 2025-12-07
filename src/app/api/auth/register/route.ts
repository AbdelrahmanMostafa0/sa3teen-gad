import { NextRequest } from "next/server";
import { registerHandler } from "@/lib/handlers/auth/register.handler";

export async function POST(req: NextRequest) {
  return registerHandler(req);
}
