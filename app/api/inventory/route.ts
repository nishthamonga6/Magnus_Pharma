import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Inventory from '@/models/Inventory'
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
  const userId = user.id
  if (!process.env.MONGODB_URI) {
    const client = await (await import('@/lib/nextMongoClient')).default
    const items = await client.db().collection('inventory').find({ userId }).toArray()
    return NextResponse.json(items)
  }
  await dbConnect()
  const items = await Inventory.find({ userId: user.id })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!process.env.MONGODB_URI) {
    const client = await (await import('@/lib/nextMongoClient')).default
    const col = client.db().collection('inventory')
    const now = new Date()
    const doc = Object.assign({}, body, { userId: user.id, createdAt: now, updatedAt: now })
    const r = await col.insertOne(doc)
    const created = await col.findOne({ _id: r.insertedId })
    return NextResponse.json(created)
  }

  await dbConnect()
  const created = await Inventory.create({ ...body, userId: user.id })
  return NextResponse.json(created)
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!process.env.MONGODB_URI) {
    const client = await (await import('@/lib/nextMongoClient')).default
    const col = client.db().collection('inventory')
    await col.updateOne({ _id: body._id, userId: user.id }, { $set: body })
    const updated = await col.findOne({ _id: body._id, userId: user.id })
    return NextResponse.json(updated)
  }

  await dbConnect()
  const updated = await Inventory.findOneAndUpdate({ _id: body._id, userId: user.id }, body, { new: true })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!process.env.MONGODB_URI) {
    const client = await (await import('@/lib/nextMongoClient')).default
    await client.db().collection('inventory').deleteOne({ _id: id, userId: user.id })
    return NextResponse.json({ ok: true })
  }

  await dbConnect()
  await Inventory.deleteOne({ _id: id, userId: user.id })
  return NextResponse.json({ ok: true })
}
