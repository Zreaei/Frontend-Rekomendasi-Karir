import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  subtitle?: string
}

const StatCard = ({ title, value, icon, subtitle }: StatCardProps) => {
  return (
    <div className="flex min-h-[104px] min-w-0 items-center gap-3.5 rounded-md bg-white p-4 shadow-[0_7px_16px_rgba(0,0,0,0.12)]">
      <div className="grid h-10 w-10 flex-none place-items-center rounded-[5px] bg-[#0d6efd] text-white [&_svg]:h-5 [&_svg]:w-5" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#050505]">{title}</p>
        <p className="mt-0.5 text-[24px] font-bold leading-none text-[#050505]">{value}</p>
        {subtitle ? <p className="text-xs text-[#6d6f78]">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default StatCard
