"use client"
import React from 'react'

export default function HeaderTop({ onClear }: { onClear: () => Promise<void> }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm mb-6">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>
      <div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          Clear All Data
        </button>
      </div>
    </div>
  )
}
