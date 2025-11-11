"use client"
import React from 'react'
import { Sun, Moon, User, Menu } from 'lucide-react'

export default function Navbar() {
  function toggleSidebar() {
    document.body.classList.toggle('sidebar-open')
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b">
      <div className="flex items-center gap-4">
        <button aria-label="Open sidebar" onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <button aria-label="Toggle theme" className="p-2 rounded-md hover:bg-gray-100">
          <Sun className="w-5 h-5 text-slate-600" />
        </button>
        <div className="text-sm text-slate-600">Welcome back</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <div className="text-sm text-slate-700">Magnus Admin</div>
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  )
}
