"use client"
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ label, value, onChange, id }: { label: string; value: string; onChange: (v: string) => void; id?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" " className="peer w-full bg-transparent border border-slate-200 rounded-md px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      <label htmlFor={id} className="absolute left-3 top-2 text-sm text-slate-500 peer-focus:text-indigo-600 peer-focus:top-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm transition-all">{label}</label>
      <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} className="absolute right-2 top-2 p-1 text-slate-600">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}
