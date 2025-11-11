import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/nextMongoClient'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
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
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' })
  return res
}
