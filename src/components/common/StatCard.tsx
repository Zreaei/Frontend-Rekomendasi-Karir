import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  subtitle?: string
}

const StatCard = ({ title, value, icon, subtitle }: StatCardProps) => {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3.5 rounded-xl bg-white p-4 shadow-md">
      <div className="grid w-14 h-14 flex-none place-items-center rounded-full bg-[#0d6efd] text-white [&_svg]:h-6 [&_svg]:w-6" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="text-lg font-medium">{title}</p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
        {subtitle ? <p className="text-xs text-[#6d6f78]">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default StatCard
