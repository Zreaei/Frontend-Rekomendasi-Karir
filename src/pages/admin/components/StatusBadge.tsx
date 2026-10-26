export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral'

interface StatusBadgeProps {
  label: string
  tone: StatusTone
  icon?: React.ReactNode
  width?: number
}

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-[#e6f9f0] text-[#10b981] border-[#d1f4e0]',
  warning: 'bg-[#fffbeb] text-[#f59e0b] border-[#fde68a]',
  danger: 'bg-[#fef2f2] text-[#ef4444] border-[#fecaca]',
  neutral: 'bg-[#f1f4f9] text-[#7b8191] border-[#e4e9f4]',
}

const StatusBadge = ({ label, tone, icon, width = 110 }: StatusBadgeProps) => {
  return (
    <span
      style={{ width }}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold rounded uppercase tracking-wider border ${toneClasses[tone]}`}
    >
      {icon}
      {label}
    </span>
  )
}

export default StatusBadge
