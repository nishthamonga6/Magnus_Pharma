import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Purchase from '@/models/Purchase'
import Sale from '@/models/Sale'
import { getTokenFromReq, verifyToken } from '@/lib/auth'
import clientPromise from '@/lib/nextMongoClient'

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
  const body = await req.json()
  const userId = user.id
  const { from, to, type } = body
  const match: any = { userId }
  if (from || to) match.date = {}
  if (from) match.date.$gte = new Date(from)
  if (to) match.date.$lte = new Date(to)

  // If no MongoDB configured, use in-memory client
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const colP = client.db().collection('purchases')
    const colS = client.db().collection('sales')
    if (type === 'purchases') {
      const data = await colP.find(match).sort({ date: -1 }).toArray()
      return NextResponse.json(data)
    }
    if (type === 'sales') {
      const data = await colS.find(match).sort({ date: -1 }).toArray()
      return NextResponse.json(data)
    }
    const purchases = await colP.find(match).sort({ date: -1 }).toArray()
    const sales = await colS.find(match).sort({ date: -1 }).toArray()
    return NextResponse.json({ purchases, sales })
  }

  await dbConnect()

  if (type === 'purchases') {
    const data = await Purchase.find(match).sort({ date: -1 })
    return NextResponse.json(data)
  }
  if (type === 'sales') {
    const data = await Sale.find(match).sort({ date: -1 })
    return NextResponse.json(data)
  }

  // default: return both
  const purchases = await Purchase.find(match).sort({ date: -1 })
  const sales = await Sale.find(match).sort({ date: -1 })
  return NextResponse.json({ purchases, sales })
}
