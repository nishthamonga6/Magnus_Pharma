"use client"
import React, { useEffect, useState, useMemo } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import FormInput from '@/components/FormInput'
import { useRouter } from 'next/navigation'

type Purchase = { _id?: string; id?: string; vendor?: string; name?: string; date?: string; amount?: number; purchasePrice?: number }

export default function PurchasesPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/purchases', { credentials: 'include' })
        if (res.status === 401) return router.push('/login')
        const json = await res.json()
        if (mounted) setRows(Array.isArray(json) ? json : [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [router])

  const filtered = useMemo(() => rows.filter(r => (r.vendor || r.name || '').toLowerCase().includes(query.toLowerCase())), [rows, query])

  async function addPurchase(vendor: string, amount: number) {
    // optimistic UI
    const temp: Purchase = { id: `temp-${Date.now()}`, vendor, date: new Date().toISOString().slice(0,10), amount }
    setRows((s) => [temp, ...s])
    setOpen(false)
    try {
      const res = await fetch('/api/purchases', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: vendor, quantity: 1, purchasePrice: amount }) })
      if (res.status === 401) return router.push('/login')
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to add')
      }
      const created = await res.json()
      // replace temp with created
      setRows((s) => s.map(r => (r.id && r.id.toString().startsWith('temp-')) ? created : r))
    } catch (err: any) {
      // revert optimistic
      setRows((s) => s.filter(r => !(r.id && r.id.toString().startsWith('temp-'))))
      alert(err?.message || 'Add failed')
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Purchases</h1>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vendor" className="border rounded px-3 py-2 text-sm" />
          <button onClick={() => setOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Add Purchase</button>
        </div>
      </div>

      <Card>
        {loading ? <div className="p-4">Loading...</div> : error ? <div className="p-4 text-red-600">{error}</div> : <Table columns={[{ key: 'vendor', title: 'Vendor', render: (r:any)=> r.vendor || r.name }, { key: 'date', title: 'Date' }, { key: 'amount', title: 'Amount', render: (r:any) => `₹ ${r.amount?.toLocaleString?.() || r.purchasePrice}` }]} data={filtered} />}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Purchase">
        <AddPurchaseForm onCancel={() => setOpen(false)} onAdd={addPurchase} />
      </Modal>
    </div>
  )
}

function AddPurchaseForm({ onCancel, onAdd }: { onCancel: () => void; onAdd: (vendor: string, amount: number) => void }) {
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onAdd(vendor, Number(amount)) }} className="space-y-4">
      <FormInput label="Vendor" value={vendor} onChange={setVendor} id="vendor" />
      <FormInput label="Amount" value={amount} onChange={setAmount} id="amount" type="number" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded-md border">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Add</button>
      </div>
    </form>
  )
}
