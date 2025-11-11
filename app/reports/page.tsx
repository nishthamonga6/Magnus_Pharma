"use client"
import React, { useMemo, useState } from 'react'
import Card from '@/components/Card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'

const mockSales = [
  { date: '2025-10-01', sales: 4000 },
  { date: '2025-10-08', sales: 3000 },
  { date: '2025-10-15', sales: 5000 },
  { date: '2025-10-22', sales: 2000 },
  { date: '2025-11-01', sales: 6500 }
]

export default function ReportsPage() {
  const [range, setRange] = useState('30')

  const data = useMemo(() => mockSales, [])

  function exportCSV() {
    const csv = ['date,sales', ...data.map(d => `${d.date},${d.sales}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sales.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="rangeSelect">Range</label>
          <select id="rangeSelect" value={range} onChange={(e) => setRange(e.target.value)} className="border rounded px-3 py-2 text-sm">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button onClick={exportCSV} className="px-3 py-2 rounded-md border">Download CSV</button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  )
}
