import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Sale from '@/models/Sale'
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
    const items = await client.db().collection('sales').find({ userId: user.id }).toArray()
    return NextResponse.json(items)
  }
  await dbConnect()
  const items = await Sale.find({ userId: user.id }).sort({ date: -1 })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // If no real Mongo configured, use the in-memory client
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const invCol = client.db().collection('inventory')
    const filter: any = { userId: user.id, name: body.name }
    if (body.batchNo) filter.batchNo = body.batchNo
    const inv = await invCol.findOne(filter)
    if (!inv || (inv.stock || 0) < (body.quantity || 0)) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    const col = client.db().collection('sales')
    const now = new Date()
    const doc = Object.assign({}, body, { userId: user.id, createdAt: now, updatedAt: now })
    const r = await col.insertOne(doc)
    await invCol.updateOne(filter, { $inc: { stock: -(body.quantity || 0) } })
    const created = await col.findOne({ _id: r.insertedId })
    return NextResponse.json(created)
  }

  await dbConnect()
  // ensure enough stock
  const filter: any = { userId: user.id, name: body.name }
  if (body.batchNo) filter.batchNo = body.batchNo
  const inv = await Inventory.findOne(filter)
  if (!inv || inv.stock < body.quantity) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
  const sale = await Sale.create({ ...body, userId: user.id })
  await Inventory.findOneAndUpdate(filter, { $inc: { stock: -body.quantity } })
  return NextResponse.json(sale)
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const col = client.db().collection('sales')
    const removed = await col.findOneAndDelete({ _id: id, userId: user.id })
    if (removed && removed.value) {
      const r = removed.value
      const filter: any = { userId: user.id, name: r.name }
      if (r.batchNo) filter.batchNo = r.batchNo
      await client.db().collection('inventory').updateOne(filter, { $inc: { stock: r.quantity || 0 } })
    }
    return NextResponse.json({ ok: true })
  }

  await dbConnect()
  const removed = await Sale.findOneAndDelete({ _id: id, userId: user.id })
  if (removed) {
    const filter: any = { userId: user.id, name: removed.name }
    if (removed.batchNo) filter.batchNo = removed.batchNo
    await Inventory.findOneAndUpdate(filter, { $inc: { stock: removed.quantity } })
  }
  return NextResponse.json({ ok: true })
}
