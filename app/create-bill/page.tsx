"use client"
import React, { useState } from 'react'
import Card from '@/components/Card'

type ItemRow = { id: number; name: string; qty: number; rate: number }

export default function CreateBillPage() {
  const [items, setItems] = useState<ItemRow[]>([{ id: 1, name: 'Paracetamol 500mg', qty: 2, rate: 50 }])
  const [customer, setCustomer] = useState('')

  function addRow() {
    setItems((s) => [...s, { id: Date.now(), name: '', qty: 1, rate: 0 }])
  }

  function updateRow(id: number, patch: Partial<ItemRow>) {
    setItems((s) => s.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  const subtotal = items.reduce((s, r) => s + r.qty * r.rate, 0)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Create Bill</h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-md border">Save</button>
          <button onClick={() => window.print()} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Print</button>
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <label className="block text-sm text-slate-600" htmlFor="cb_customer">Customer</label>
          <input id="cb_customer" aria-label="Customer" placeholder="Customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-600 text-left">
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Rate</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="align-top">
                  <td className="p-2"><input aria-label="Item name" placeholder="Item name" value={row.name} onChange={(e) => updateRow(row.id, { name: e.target.value })} className="w-full border rounded px-2 py-1" /></td>
                  <td className="p-2"><input aria-label="Quantity" placeholder="Qty" type="number" value={row.qty} onChange={(e) => updateRow(row.id, { qty: Number(e.target.value) })} className="w-24 border rounded px-2 py-1" /></td>
                  <td className="p-2"><input aria-label="Rate" placeholder="Rate" type="number" value={row.rate} onChange={(e) => updateRow(row.id, { rate: Number(e.target.value) })} className="w-32 border rounded px-2 py-1" /></td>
                  <td className="p-2">₹ {(row.qty * row.rate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={addRow} className="px-3 py-2 rounded-md border">Add item</button>
            <button onClick={async () => {
              // Save bill
              const payload = { items: items.map(i => ({ name: i.name, batchNo: undefined, quantity: i.qty, price: i.rate })), total: subtotal }
              try {
                const res = await fetch('/api/bills', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                if (res.status === 401) return window.location.href = '/login'
                if (!res.ok) {
                  const j = await res.json().catch(() => ({}))
                  throw new Error(j.error || 'Failed to save bill')
                }
                const created = await res.json()
                alert('Bill saved (id: ' + (created._id || created.id || '') + ')')
                // reset form
                setItems([{ id: Date.now(), name: '', qty: 1, rate: 0 }])
                setCustomer('')
              } catch (err: any) {
                alert(err?.message || 'Save failed')
              }
            }} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Save</button>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">Subtotal</div>
            <div className="text-2xl font-semibold">₹ {subtotal.toLocaleString()}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
