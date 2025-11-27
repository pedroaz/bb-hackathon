import { NextResponse } from "next/server";
import { createToken } from "@/lib/jwt";

// Secret endpoint for organizer to get real admin access
// Participants won't find this easily in the UI
export async function POST() {
  const token = createToken("admin"); // Generate with admin role

  const response = NextResponse.json({
    success: true,
    message: "Admin token generated successfully",
  });

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600, // 1 hour
  });

  return response;
}
