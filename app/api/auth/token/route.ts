import { NextResponse } from "next/server";
import { createToken } from "@/lib/jwt";

export async function POST() {
  // This endpoint generates a "user" token
  // Participants need to discover they can manipulate this
  const token = createToken("user");

  const response = NextResponse.json({
    success: true,
    message: "Token generated",
  });

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600, // 1 hour
  });

  return response;
}
