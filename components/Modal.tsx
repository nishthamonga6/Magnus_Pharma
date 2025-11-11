"use client"
import React from 'react'

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white shadow-lg z-10 w-full modal-mobile-full p-4 sm:p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button aria-label="Close modal" onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
  <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}
