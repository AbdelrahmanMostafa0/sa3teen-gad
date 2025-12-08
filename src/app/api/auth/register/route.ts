import { NextRequest } from "next/server";
import { registerHandler } from "@/lib/handlers/auth/register.handler";

export const POST = registerHandler;
