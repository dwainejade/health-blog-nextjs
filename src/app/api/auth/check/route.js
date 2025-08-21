// src/app/api/auth/check/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Get admin emails from server environment (secure)
    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

    const isAdmin = adminEmails.includes(email?.toLowerCase());

    return NextResponse.json({
      isAdmin,
      role: isAdmin ? "admin" : "user",
    });
  } catch (error) {
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 });
  }
}
