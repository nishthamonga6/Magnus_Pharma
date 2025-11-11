"use client"
import React from 'react'

export default function FormInput({ label, value, onChange, type = 'text', id, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; id?: string; placeholder?: string }) {
  return (
    <div className="relative">
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="peer w-full bg-transparent border border-slate-200 rounded-md px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      <label htmlFor={id} className="absolute left-3 top-2 text-sm text-slate-500 peer-focus:text-indigo-600 peer-focus:top-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm transition-all">{label}</label>
    </div>
  )
}
