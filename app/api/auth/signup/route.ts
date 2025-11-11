import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/nextMongoClient'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = body
    if (!email || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 })

    const client = await clientPromise
    const users = client.db().collection('users')
    const exists = await users.findOne({ email })
    if (exists) return NextResponse.json({ error: 'User exists' }, { status: 400 })
    const hashed = await bcrypt.hash(password, 10)
    const created = await users.insertOne({ email, name, password: hashed, createdAt: new Date() })

    // Auto-login: sign token and set cookie like the login route
    const id = created.insertedId
    const token = signToken({ id: id.toString(), email, name })
    const res = NextResponse.json({ ok: true, id })
    const cookieOpts: any = { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 }
    if (process.env.NODE_ENV === 'production') {
      cookieOpts.sameSite = 'none'
      cookieOpts.secure = true
    } else {
      cookieOpts.sameSite = 'lax'
    }
    res.cookies.set('token', token, cookieOpts)
    return res
  } catch (err: any) {
    // Surface a helpful error in response and logs so Vercel shows the root cause
    console.error('Signup error:', err && err.message ? err.message : err)
    return NextResponse.json({ error: err && err.message ? err.message : 'Internal Server Error' }, { status: 500 })
  }
}
