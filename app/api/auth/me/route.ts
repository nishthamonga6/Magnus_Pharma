import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromReq, verifyToken } from '@/lib/auth'
import clientPromise from '@/lib/nextMongoClient'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  const token = getTokenFromReq(req)
  if (!token) return NextResponse.json({ ok: false }, { status: 401 })
  const v = verifyToken(token)
  if (!v.ok) return NextResponse.json({ ok: false }, { status: 401 })
  const userId = v.data.id || v.data.sub
  const userEmail = v.data.email

  try {
    const client = await clientPromise
    const users = client.db().collection('users')
    let u = null
    if (userEmail) {
      u = await users.findOne({ email: userEmail })
    }
    if (!u && userId) {
      try {
        u = await users.findOne({ _id: new ObjectId(String(userId)) })
      } catch (e) {
        // fallback to string id
        u = await users.findOne({ _id: String(userId) }) || await users.findOne({ id: String(userId) })
      }
    }
    if (u) {
      const safe = { id: (u._id && u._id.toString) ? u._id.toString() : u.id, email: u.email, name: u.name }
      return NextResponse.json({ ok: true, user: safe })
    }
  } catch (e) {
    // ignore and fall back
  }

  return NextResponse.json({ ok: true, user: { id: String(userId) } })
}
