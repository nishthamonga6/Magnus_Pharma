import React from 'react'

type Row = {
  productName: string
  batchNo: string
  expiryDate: string
  daysLeft: number
  stock: number
}

export default function ExpiryTable({ rows }: { rows: Row[] }) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Expiry Alerts</h3>
        <div className="text-sm text-slate-500">Products expiring within the next 30 days or already expired.</div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-slate-600 bg-slate-50">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Batch No</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Days Left</th>
                <th className="py-3 px-4">Stock</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No products are expiring soon.</td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3 px-4">{r.productName}</td>
                  <td className="py-3 px-4">{r.batchNo}</td>
                  <td className="py-3 px-4">{r.expiryDate}</td>
                  <td className="py-3 px-4">{r.daysLeft}</td>
                  <td className="py-3 px-4">{r.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
