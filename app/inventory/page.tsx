"use client"
import React, { useMemo, useState } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import FormInput from '@/components/FormInput'

type Item = { id: string; name: string; category: string; stock: number }

export default function InventoryPage() {
  const [rows, setRows] = useState<Item[]>([
    { id: 'i1', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 120 },
    { id: 'i2', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 8 }
  ])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => rows.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) && (category ? r.category === category : true)), [rows, query, category])

  function addItem(name: string, category: string, stock: number) {
    setRows((s) => [{ id: `i${Date.now()}`, name, category, stock }, ...s])
    setOpen(false)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item" className="border rounded px-3 py-2 text-sm" />
          <label className="sr-only" htmlFor="categorySelect">Category</label>
          <select id="categorySelect" value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-3 py-2 text-sm">
            <option value="">All categories</option>
            <option>Analgesic</option>
            <option>Antibiotic</option>
          </select>
          <button onClick={() => setOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Add Item</button>
        </div>
      </div>

      <Card>
        <Table columns={[{ key: 'name', title: 'Item' }, { key: 'category', title: 'Category' }, { key: 'stock', title: 'Stock', render: (r:any) => <StockBadge stock={r.stock} /> }]} data={filtered} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Item">
        <AddItemForm onCancel={() => setOpen(false)} onAdd={addItem} />
      </Modal>
    </div>
  )
}

function StockBadge({ stock }: { stock: number }) {
  return <span className={`px-2 py-1 rounded text-sm ${stock < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{stock}</span>
}

function AddItemForm({ onCancel, onAdd }: { onCancel: () => void; onAdd: (name: string, category: string, stock: number) => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onAdd(name, category, Number(stock)) }} className="space-y-4">
      <FormInput label="Item name" value={name} onChange={setName} id="iname" />
      <FormInput label="Category" value={category} onChange={setCategory} id="icat" />
      <FormInput label="Stock" value={stock} onChange={setStock} id="istock" type="number" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded-md border">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Add</button>
      </div>
    </form>
  )
}
