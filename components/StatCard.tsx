import React from 'react'

export default function StatCard({ title, value, trend, icon, className = '' }: { title: string; value: string | number; trend?: string; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm flex items-start gap-4 ${className}`}>
      {icon ? <div className="w-12 h-12 rounded-md bg-indigo-50 flex items-center justify-center">{icon}</div> : null}
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
        {trend ? <div className="text-sm text-slate-500 mt-1">{trend}</div> : null}
      </div>
    </div>
  )
}
