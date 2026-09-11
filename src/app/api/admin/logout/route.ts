import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  clearAdminCookie(response, request);
  return response;
}
