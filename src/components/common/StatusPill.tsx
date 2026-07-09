interface StatusPillProps {
  label: string
  tone?: 'warning' | 'danger' | 'success' | 'info'
}

const StatusPill = ({ label, tone = 'info' }: StatusPillProps) => {
  const toneClass = {
    warning: 'text-[#ff8500]',
    danger: 'text-[#ff3b30]',
    success: 'text-[#047857]',
    info: 'text-[#0d6efd]',
  }[tone]

  return <span className={`inline-flex items-center justify-start text-[13px] font-semibold ${toneClass}`}>{label}</span>
}

export default StatusPill
