import { NextRequest } from "next/server";
import { loginHandler } from "@/lib/handlers/auth/login.handler";

export async function POST(req: NextRequest) {
  return loginHandler(req);
}
