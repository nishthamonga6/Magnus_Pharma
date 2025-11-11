"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/Card'
import FormInput from '@/components/FormInput'
import PasswordInput from '@/components/PasswordInput'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (res.ok) router.push('/')
      else {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Sign in to Magnus Pharma</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to access the dashboard</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput label="Email" id="email" value={email} onChange={setEmail} type="email" placeholder="you@company.com" />
            <PasswordInput label="Password" id="password" value={password} onChange={setPassword} />
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-indigo-600">Forgot password?</a>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-2 bg-indigo-600 hover:shadow-md text-white py-2 rounded-md transition">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className="mt-4 text-sm">
            Don't have an account? <a href="/signup" className="text-indigo-600">Sign up</a>
          </div>
        </Card>
      </div>
    </div>
  )
}
