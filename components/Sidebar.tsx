"use client"
import React from 'react'
import Link from 'next/link'
import { Home, Box, ShoppingCart, FileText, Layers, BarChart2, Settings, LogOut } from 'lucide-react'

const items = [
  { title: 'Dashboard', href: '/', icon: Home },
  { title: 'Purchases', href: '/purchases', icon: Box },
  { title: 'Sales', href: '/sales', icon: ShoppingCart },
  { title: 'Inventory', href: '/inventory', icon: Layers },
  { title: 'Create Bill', href: '/create-bill', icon: FileText },
  { title: 'Reports', href: '/reports', icon: BarChart2 },
  { title: 'Setup', href: '/setup', icon: Settings }
]

export default function Sidebar() {
  // Desktop sidebar (visible on lg+)
  return (
    <>
      <aside className="hidden lg:block w-64 bg-[#0b1220] text-white min-h-screen shadow-sm">
        <div className="h-16 flex items-center justify-start px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">MP</div>
            <div className="font-semibold text-lg">Magnus</div>
          </div>
        </div>
        <nav className="mt-6 px-3">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="group flex items-center gap-3 py-3 px-2 rounded-md hover:bg-white/6">
              <it.icon className="w-5 h-5 text-white/90 group-hover:text-white" />
              <span className="inline-block">{it.title}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); window.location.href = '/login' }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/6">
            <LogOut className="w-4 h-4" />
            <span className="inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer (hidden on lg) - controlled by `body.sidebar-open` class */}
      <div className="sidebar-mobile lg:hidden">
        <div className="h-16 flex items-center justify-start px-4">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">MP</div>
            <div className="font-semibold">Magnus</div>
          </div>
          <button aria-label="Close sidebar" className="ml-auto text-white px-3" onClick={() => document.body.classList.remove('sidebar-open')}>✕</button>
        </div>
        <nav className="mt-4 px-3">
          {items.map((it) => (
            <Link key={it.href} href={it.href} onClick={() => document.body.classList.remove('sidebar-open')} className="group flex items-center gap-3 py-3 px-2 rounded-md hover:bg-white/6 text-white">
              <it.icon className="w-5 h-5 text-white/90 group-hover:text-white" />
              <span className="inline-block">{it.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* backdrop for mobile drawer */}
      <div className="sidebar-backdrop lg:hidden" onClick={() => document.body.classList.remove('sidebar-open')} />
    </>
  )
}

