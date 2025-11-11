import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true })
  // Clear cookie
  const cookieOpts: any = { httpOnly: true, path: '/', maxAge: 0 }
  if (process.env.NODE_ENV === 'production') {
    cookieOpts.sameSite = 'none'
    cookieOpts.secure = true
  } else {
    cookieOpts.sameSite = 'lax'
  }
  res.cookies.set('token', '', cookieOpts)
  return res
}
