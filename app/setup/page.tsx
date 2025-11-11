"use client"
import React, { useState } from 'react'
import Card from '@/components/Card'

export default function SetupPage() {
  const [name, setName] = useState('Magnus Pharma')
  const [gst, setGst] = useState('')
  const [address, setAddress] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [dark, setDark] = useState(false)

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setLogo(f)
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Setup</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium mb-3">Business settings</h3>
          <div className="space-y-3">
            <label className="block text-sm" htmlFor="biz_name">Business name</label>
            <input id="biz_name" aria-label="Business name" placeholder="Your business name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />

            <label className="block text-sm" htmlFor="biz_gst">GST</label>
            <input id="biz_gst" aria-label="GST" placeholder="GST number" value={gst} onChange={(e) => setGst(e.target.value)} className="w-full border rounded px-3 py-2" />

            <label className="block text-sm" htmlFor="biz_addr">Address</label>
            <textarea id="biz_addr" aria-label="Address" placeholder="Business address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" />

            <label className="block text-sm" htmlFor="biz_logo">Logo</label>
            <input id="biz_logo" aria-label="Logo upload" type="file" accept="image/*" onChange={onLogo} />
            {logo ? <div className="mt-2 text-sm text-slate-600">Selected: {logo.name}</div> : null}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-3">Profile & Theme</h3>
          <div className="space-y-3">
            <label className="block text-sm">Theme</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setDark(false)} className={`px-3 py-2 rounded ${!dark ? 'bg-indigo-600 text-white' : 'border'}`}>Light</button>
              <button onClick={() => setDark(true)} className={`px-3 py-2 rounded ${dark ? 'bg-indigo-600 text-white' : 'border'}`}>Dark</button>
            </div>
            <div className="pt-4 text-sm text-slate-500">Profile settings and contact info can be managed here.</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
