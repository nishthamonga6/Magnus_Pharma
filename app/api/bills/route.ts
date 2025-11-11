import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Bill from '@/models/Bill'
import Inventory from '@/models/Inventory'
import clientPromise from '@/lib/nextMongoClient'
import { getTokenFromReq, verifyToken } from '@/lib/auth'

async function requireUser(req: NextRequest) {
  const token = getTokenFromReq(req)
  if (!token) return null
  const v = verifyToken(token)
  if (!v.ok) return null
  return v.data
}

export async function GET(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const items = await client.db().collection('bills').find({ userId: user.id }).toArray()
    return NextResponse.json(items)
  }
  await dbConnect()
  const items = await Bill.find({ userId: user.id }).sort({ createdAt: -1 })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // Support in-memory client when no Mongo URI
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const col = client.db().collection('bills')
    const now = new Date()
    const doc = Object.assign({}, body, { userId: user.id, createdAt: now, updatedAt: now })
    const r = await col.insertOne(doc)
    if (Array.isArray(body.items)) {
      for (const it of body.items) {
        const filter: any = { userId: user.id, name: it.name }
        if (it.batchNo) filter.batchNo = it.batchNo
        await client.db().collection('inventory').updateOne(filter, { $inc: { stock: -(it.quantity || 0) } })
      }
    }
    const created = await col.findOne({ _id: r.insertedId })
    return NextResponse.json(created)
  }

  await dbConnect()
  const bill = await Bill.create({ ...body, userId: user.id })
  // Decrement inventory for each item in bill
  if (Array.isArray(body.items)) {
    for (const it of body.items) {
      const filter: any = { userId: user.id, name: it.name }
      if (it.batchNo) filter.batchNo = it.batchNo
      await Inventory.findOneAndUpdate(filter, { $inc: { stock: -it.quantity } })
    }
  }
  return NextResponse.json(bill)
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const removed = await client.db().collection('bills').findOneAndDelete({ _id: id, userId: user.id })
    // Optionally restore inventory if needed — omitted by default
    return NextResponse.json({ ok: true })
  }

  await dbConnect()
  const removed = await Bill.findOneAndDelete({ _id: id, userId: user.id })
  // Optionally restore inventory if needed — omitted by default
  return NextResponse.json({ ok: true })
}
