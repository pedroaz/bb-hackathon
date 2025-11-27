import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ authorized: false }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ authorized: false }, { status: 401 });
  }

  return NextResponse.json({ authorized: true, payload });
}
