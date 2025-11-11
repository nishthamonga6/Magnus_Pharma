import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Purchase from '@/models/Purchase'
import Sale from '@/models/Sale'
import Inventory from '@/models/Inventory'
import { getTokenFromReq, verifyToken } from '@/lib/auth'
import clientPromise from '@/lib/nextMongoClient'

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
  // If no real MongoDB is configured, use the lightweight in-memory client
  if (!process.env.MONGODB_URI) {
    const client = await clientPromise
    const purchases = await client.db().collection('purchases').find({ userId }).toArray()
    const sales = await client.db().collection('sales').find({ userId }).toArray()
    const totalPurchases = purchases.reduce((acc: number, p: any) => acc + ((p.purchasePrice || 0) * (p.quantity || 0)), 0)
    const totalSales = sales.reduce((acc: number, s: any) => acc + ((s.salePrice || 0) * (s.quantity || 0)), 0)
    const grossProfit = totalSales - totalPurchases

    const inventoryDocs: any[] = await client.db().collection('inventory').find({ userId }).toArray()
    const inventoryValue = inventoryDocs.reduce((acc: number, it: any) => acc + ((it.purchasePrice || 0) * (it.stock || 0)), 0)

    const now = new Date()
    const in30 = new Date()
    in30.setDate(now.getDate() + 30)
    const expiring = inventoryDocs.filter((it: any) => it.expiryDate && new Date(it.expiryDate) <= in30)
    const alerts = expiring.map((it: any) => {
      const daysLeft = Math.ceil((new Date(it.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return { productName: it.name, batchNo: it.batchNo, expiryDate: it.expiryDate, daysLeft, stock: it.stock }
    })

    return NextResponse.json({ totalSales, totalPurchases, grossProfit, inventoryValue, expiryAlerts: alerts })
  }

  await dbConnect()
  // totals
  const purchases = await Purchase.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: { $multiply: ['$purchasePrice', '$quantity'] } } } }
  ])
  const sales = await Sale.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: { $multiply: ['$salePrice', '$quantity'] } } } }
  ])
  const totalPurchases = purchases[0]?.total || 0
  const totalSales = sales[0]?.total || 0
  const grossProfit = totalSales - totalPurchases

  // inventory value
  const inventoryDocs: any[] = await Inventory.find({ userId })
  const inventoryValue = inventoryDocs.reduce((acc, it) => acc + (it.purchasePrice || 0) * (it.stock || 0), 0)

  // expiry alerts (<=30 days)
  const now = new Date()
  const in30 = new Date()
  in30.setDate(now.getDate() + 30)
  const expiring = await Inventory.find({ userId, expiryDate: { $lte: in30 } }).sort({ expiryDate: 1 })
  const alerts = expiring.map((it: any) => {
    const daysLeft = Math.ceil((new Date(it.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return { productName: it.name, batchNo: it.batchNo, expiryDate: it.expiryDate, daysLeft, stock: it.stock }
  })

  return NextResponse.json({ totalSales, totalPurchases, grossProfit, inventoryValue, expiryAlerts: alerts })
}
