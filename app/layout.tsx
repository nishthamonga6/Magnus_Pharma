import './globals.css'
import React from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Magnus Pharma',
  description: 'Inventory and billing dashboard'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen flex bg-gray-50">
          <Sidebar />
          <div className="flex-1 min-h-screen flex flex-col">
            <Navbar />
            <main className="p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
