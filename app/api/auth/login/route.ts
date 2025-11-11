import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/nextMongoClient'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { sendLoginNotification } from '@/lib/mail'

export async function POST(req: NextRequest) {
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
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' })

  // fire-and-forget login notification email (if SMTP configured)
  ;(async () => {
    try { await sendLoginNotification(user.email, user.name) } catch (e) { /* ignore */ }
  })()

  return res
}
