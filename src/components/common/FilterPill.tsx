import { ChevronDown } from 'lucide-react'

interface FilterPillProps {
  label: string
  active?: boolean
  caret?: boolean
}

const FilterPill = ({ label, active, caret }: FilterPillProps) => {
  return (
    <button
      className={`inline-flex h-7 min-w-[68px] items-center justify-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold ${
        active ? 'border-transparent bg-[#5aa2ff] text-white' : 'border-[#aeb4bf] bg-white text-[#050505]'
      }`}
      type="button"
    >
      <span>{label}</span>
      {caret ? <ChevronDown className="text-[#6d6f78]" size={14} strokeWidth={2} /> : null}
    </button>
  )
}

export default FilterPill
