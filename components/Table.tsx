"use client"
import React from 'react'

export default function Table<T>({ columns, data }: { columns: { key: string; title: string; render?: (row: any) => React.ReactNode }[]; data: T[] }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left text-sm font-medium text-slate-600 p-2 sm:p-3 border-b">{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              {columns.map((c) => (
                <td key={c.key} className="p-2 sm:p-3 align-top text-sm text-slate-700 border-b">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
