import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export function checkAdminAuth(request: NextRequest): NextResponse | null {
  // Check if the request is coming from the correct admin page
  const referer = request.headers.get("referer");

  if (!referer || !referer.includes("/pedro-is-cool")) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid access point" },
      { status: 403 }
    );
  }

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or insufficient permissions" },
      { status: 403 }
    );
  }

  return null; // Auth successful
}
