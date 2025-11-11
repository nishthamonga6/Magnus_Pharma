import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Purchase from '@/models/Purchase'
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
  // Prefer mongoose when a real MongoDB URI is configured; otherwise use the lightweight client
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const items = await client.db().collection('purchases').find({ userId: user.id }).toArray()
    return NextResponse.json(items)
  }
  await dbConnect()
  const items = await Purchase.find({ userId: user.id }).sort({ date: -1 })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // If no real Mongo configured, use the in-memory client
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const col = client.db().collection('purchases')
    const now = new Date()
    const doc = Object.assign({}, body, { userId: user.id, createdAt: now, updatedAt: now })
    const r = await col.insertOne(doc)
    // update inventory
    const invCol = client.db().collection('inventory')
    const filter: any = { userId: user.id, name: body.name }
    if (body.batchNo) filter.batchNo = body.batchNo
    await invCol.updateOne(filter, { $inc: { stock: body.quantity || 0 }, $set: { purchasePrice: body.purchasePrice || 0 } }, { upsert: true })
    const created = await col.findOne({ _id: r.insertedId })
    return NextResponse.json(created)
  }

  await dbConnect()
  const purchase = await Purchase.create({ ...body, userId: user.id })
  // update inventory: increment stock for the item (by name+batchNo)
  const filter: any = { userId: user.id, name: body.name }
  if (body.batchNo) filter.batchNo = body.batchNo
  await Inventory.findOneAndUpdate(filter, { $inc: { stock: body.quantity }, $set: { purchasePrice: body.purchasePrice } }, { upsert: true, new: true })
  return NextResponse.json(purchase)
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const col = client.db().collection('purchases')
    const removed = await col.findOneAndDelete({ _id: id, userId: user.id })
    if (removed && removed.value) {
      const r = removed.value
      const filter: any = { userId: user.id, name: r.name }
      if (r.batchNo) filter.batchNo = r.batchNo
      await client.db().collection('inventory').updateOne(filter, { $inc: { stock: -(r.quantity || 0) } })
    }
    return NextResponse.json({ ok: true })
  }

  await dbConnect()
  const removed = await Purchase.findOneAndDelete({ _id: id, userId: user.id })
  if (removed) {
    // decrement stock
    const filter: any = { userId: user.id, name: removed.name }
    if (removed.batchNo) filter.batchNo = removed.batchNo
    await Inventory.findOneAndUpdate(filter, { $inc: { stock: -removed.quantity } })
  }
  return NextResponse.json({ ok: true })
}
