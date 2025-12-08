import { NextRequest } from "next/server";
import { loginHandler } from "@/lib/handlers/auth/login.handler";

export const POST = loginHandler;
