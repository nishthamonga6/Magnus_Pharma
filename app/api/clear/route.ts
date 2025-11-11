import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/nextMongoClient'
import { getTokenFromReq, verifyToken } from '@/lib/auth'

async function requireUser(req: NextRequest) {
  const token = getTokenFromReq(req)
  if (!token) return null
  const v = verifyToken(token)
  if (!v.ok) return null
  return v.data
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const client = await clientPromise
  const db = client.db()
  const userId = user.id
  // delete user-specific collections
  await db.collection('inventories').deleteMany({ userId })
  await db.collection('purchases').deleteMany({ userId })
  await db.collection('sales').deleteMany({ userId })
  await db.collection('bills').deleteMany({ userId })
  return NextResponse.json({ ok: true })
}
