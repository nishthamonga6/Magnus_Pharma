import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/nextMongoClient'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { sendLoginNotification } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 })
    const client = await clientPromise
    const users = client.db().collection('users')
    const user = await users.findOne({ email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const valid = await bcrypt.compare(password, user.password || '')
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: (user._id || user._id).toString(), email: user.email, name: user.name })

    const res = NextResponse.json({ ok: true })
    // set HttpOnly cookie using NextResponse cookie API
    const cookieOpts: any = { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 }
    // In production (deployed) allow cross-site contexts by using SameSite=None
    // and Secure=true. In dev, keep Lax for convenience.
    if (process.env.NODE_ENV === 'production') {
      cookieOpts.sameSite = 'none'
      cookieOpts.secure = true
    } else {
      cookieOpts.sameSite = 'lax'
    }
    res.cookies.set('token', token, cookieOpts)

    // fire-and-forget login notification email (if SMTP configured)
    ;(async () => {
      try { await sendLoginNotification(user.email, user.name) } catch (e) { /* ignore */ }
    })()

    return res
  } catch (err: any) {
    console.error('Login error:', err && err.message ? err.message : err)
    return NextResponse.json({ error: err && err.message ? err.message : 'Internal Server Error' }, { status: 500 })
  }
}
