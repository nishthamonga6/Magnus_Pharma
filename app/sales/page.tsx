"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import FormInput from '@/components/FormInput'
import { useRouter } from 'next/navigation'

type Sale = { _id?: string; id?: string; customer?: string; date?: string; total?: number }

export default function SalesPage() {
  const router = useRouter()
  const [rows, setRows] = useState<Sale[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/sales', { credentials: 'include' })
        if (res.status === 401) return router.push('/login')
        const json = await res.json()
        if (mounted) setRows(Array.isArray(json) ? json : [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load')
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [router])

  const filtered = useMemo(() => rows.filter(r => (r.customer || '').toLowerCase().includes(query.toLowerCase())), [rows, query])
  const totalSales = useMemo(() => rows.reduce((s, r) => s + (r.total || 0), 0), [rows])

  async function addSale(customer: string, total: number) {
    const temp: Sale = { id: `temp-${Date.now()}`, customer, date: new Date().toISOString().slice(0,10), total }
    setRows(s => [temp, ...s])
    setOpen(false)
    try {
      const res = await fetch('/api/sales', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: customer, quantity: 1, salePrice: total }) })
      if (res.status === 401) return router.push('/login')
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to add')
      }
      const created = await res.json()
      setRows(s => s.map(r => (r.id && r.id.toString().startsWith('temp-')) ? created : r))
    } catch (err: any) {
      setRows(s => s.filter(r => !(r.id && r.id.toString().startsWith('temp-'))))
      alert(err?.message || 'Add failed')
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Sales</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">Total sales: <span className="font-semibold">₹ {totalSales.toLocaleString()}</span></div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer" className="border rounded px-3 py-2 text-sm" />
          <button onClick={() => setOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Add Sale</button>
        </div>
      </div>

      <Card>
        {loading ? <div className="p-4">Loading...</div> : error ? <div className="p-4 text-red-600">{error}</div> : <Table columns={[{ key: 'customer', title: 'Customer' }, { key: 'date', title: 'Date' }, { key: 'total', title: 'Total', render: (r:any) => `₹ ${ (r.total || r.salePrice || 0).toLocaleString() }` }]} data={filtered} />}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Sale">
        <AddSaleForm onCancel={() => setOpen(false)} onAdd={addSale} />
      </Modal>
    </div>
  )
}

function AddSaleForm({ onCancel, onAdd }: { onCancel: () => void; onAdd: (customer: string, total: number) => void }) {
  const [customer, setCustomer] = useState('')
  const [total, setTotal] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onAdd(customer, Number(total)) }} className="space-y-4">
      <FormInput label="Customer" value={customer} onChange={setCustomer} id="customer" />
      <FormInput label="Total" value={total} onChange={setTotal} id="total" type="number" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded-md border">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Add</button>
      </div>
    </form>
  )
}
