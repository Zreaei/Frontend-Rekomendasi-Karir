import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  subtitle?: string
}

const StatCard = ({ title, value, icon, subtitle }: StatCardProps) => {
  return (
    <div className="flex min-h-[clamp(104px,9vw,128px)] min-w-0 items-center gap-[clamp(14px,1.5vw,20px)] rounded-md bg-white p-[clamp(14px,1.25vw,18px)] shadow-[0_7px_16px_rgba(0,0,0,0.12)]">
      <div className="grid h-[clamp(42px,3.6vw,52px)] w-[clamp(42px,3.6vw,52px)] flex-none place-items-center rounded-[5px] bg-[#0d6efd] text-white [&_svg]:h-[clamp(21px,1.8vw,26px)] [&_svg]:w-[clamp(21px,1.8vw,26px)]" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="text-[clamp(15px,1.15vw,18px)] font-semibold text-[#050505]">{title}</p>
        <p className="mt-0.5 text-[clamp(23px,1.8vw,28px)] font-bold leading-none text-[#050505]">{value}</p>
        {subtitle ? <p className="text-xs text-[#6d6f78]">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default StatCard
