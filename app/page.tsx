"use client"
import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ExpiryTable from '../components/ExpiryTable'
import HeaderTop from '../components/HeaderTop'
import { DollarSign, ShoppingCart, Package, Layers } from 'lucide-react'

type DashboardResponse = {
  totalSales: number
  totalPurchases: number
  grossProfit: number
  inventoryValue: number
  expiryAlerts: Array<any>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store', credentials: 'include' })
        if (res.ok) {
          const json = await res.json()
          setData(json)
        } else {
          setData(null)
        }
      } catch (err) {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleClear() {
    if (!confirm('Clear all your data? This cannot be undone.')) return
    const res = await fetch('/api/clear', { method: 'POST', credentials: 'include' })
    if (res.ok) {
      alert('Your data was cleared')
      setData(null)
    } else {
      alert('Failed to clear data')
    }
  }

  return (
    <div className="w-full">
      <main className="flex-1">
        <HeaderTop onClear={handleClear} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Sales" value={(data ? data.totalSales : 0).toLocaleString()} icon={<DollarSign className="w-5 h-5 text-emerald-600" />} />
          <StatCard title="Total Purchases" value={(data ? data.totalPurchases : 0).toLocaleString()} icon={<ShoppingCart className="w-5 h-5 text-rose-600" />} />
          <StatCard title="Gross Profit" value={(data ? data.grossProfit : 0).toLocaleString()} icon={<Package className="w-5 h-5 text-sky-600" />} />
          <StatCard title="Inventory Value" value={(data ? data.inventoryValue : 0).toLocaleString()} icon={<Layers className="w-5 h-5 text-amber-600" />} />
        </div>

        <ExpiryTable rows={data?.expiryAlerts?.map((a: any) => ({ productName: a.productName, batchNo: a.batchNo, expiryDate: new Date(a.expiryDate).toLocaleDateString(), daysLeft: a.daysLeft, stock: a.stock })) || []} />
      </main>
    </div>
  )
}
