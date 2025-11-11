// NextAuth route disabled to avoid importing optional adapter dependency.
// This project uses an in-repo JWT login at /api/auth/login and /api/auth/signup.
// Keep this route present so requests to /api/auth/[...nextauth] return a helpful message
// instead of causing a module resolution error when the optional adapter package is not installed.

import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: false,
    message:
      'NextAuth route disabled in this workspace. Use /api/auth/login and /api/auth/signup for auth (JWT-based).'
  }, { status: 404 })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    ok: false,
    message:
      'NextAuth route disabled in this workspace. Use /api/auth/login and /api/auth/signup for auth (JWT-based).'
  }, { status: 404 })
}
