"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/Card'
import FormInput from '@/components/FormInput'
import PasswordInput from '@/components/PasswordInput'

function passwordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score += 1
  if (/[A-Z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return score
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) return alert('Passwords do not match')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      if (res.ok) router.push('/')
      else {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const strength = passwordStrength(password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <h2 className="text-2xl font-bold mb-2">Create account</h2>
          <p className="text-sm text-slate-500 mb-4">Set up your Magnus Pharma account</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput label="Full name" id="name" value={name} onChange={setName} placeholder="Jane Doe" />
            <FormInput label="Email" id="email" value={email} onChange={setEmail} type="email" placeholder="you@company.com" />
            <PasswordInput label="Password" id="password" value={password} onChange={setPassword} />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <PasswordInput label="Confirm password" id="confirm" value={confirm} onChange={setConfirm} />
              </div>
            </div>
            <div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full ${strength < 2 ? 'bg-red-400' : strength < 3 ? 'bg-yellow-400' : 'bg-green-400'} ${strength === 0 ? 'w-0' : strength === 1 ? 'w-1/4' : strength === 2 ? 'w-2/4' : strength === 3 ? 'w-3/4' : 'w-full'}`}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">Password strength: {['Very weak', 'Weak', 'Okay', 'Good', 'Strong'][strength]}</div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-2 bg-indigo-600 hover:shadow-md text-white py-2 rounded-md transition">
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>
          <div className="mt-4 text-sm">
            Already have an account? <a href="/login" className="text-indigo-600">Sign in</a>
          </div>
        </Card>
      </div>
    </div>
  )
}
