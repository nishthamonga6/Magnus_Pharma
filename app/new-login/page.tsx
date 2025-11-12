"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(j.error || 'Login failed')
        setLoading(false)
        return
      }
      router.push('/')
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Log in</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input id="email" title="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-1 block w-full rounded border p-2" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input id="password" title="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-1 block w-full rounded border p-2" />
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-sm text-gray-600">Don't have an account? <a href="/new-signup" className="text-blue-600">Sign up</a></p>
      </div>
    </div>
  )
}
