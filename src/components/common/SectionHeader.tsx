import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  action?: ReactNode
  description?: string
}

const SectionHeader = ({ title, action, description }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className={`${description ? 'text-[24px]' : 'text-[17px]'} font-bold leading-tight text-[#050505]`}>
          {title}
        </h2>
        {description ? <p className="mt-2 text-[14px] text-[#050505]">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export default SectionHeader
