import type { ReactNode } from 'react'
import { Briefcase, Calendar, Coins, MapPin } from 'lucide-react'
import Tag from './Tag'

interface JobCardProps {
  title: string
  category: string
  icon: ReactNode
  tags: string[]
  location: string
  type: string
  salary: string
  posted: string
  actionLabel?: string
}

const JobCard = ({
  title,
  category,
  icon,
  tags,
  location,
  type,
  salary,
  posted,
  actionLabel = 'Detail',
}: JobCardProps) => {
  return (
    <article className="grid min-w-0 gap-5">
      <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3.5">
        <div className="grid h-12 w-12 place-items-center rounded-[5px] bg-[#0d6efd] text-white [&_svg]:h-6 [&_svg]:w-6" aria-hidden="true">
          {icon}
        </div>
        <div>
          <h3 className="text-[clamp(16px,1.15vw,18px)] font-bold text-[#050505]">{title}</h3>
          <p className="mt-1 text-sm text-[#050505]">{category}</p>
        </div>
        <button className="rounded-[5px] bg-[#0d6efd] px-3 py-1.5 text-sm font-semibold text-white" type="button">
          {actionLabel}
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-[18px] gap-y-2.5 text-xs text-[#696d76]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} strokeWidth={2} />
          {location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={14} strokeWidth={2} />
          {type}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Coins size={14} strokeWidth={2} />
          {salary}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={14} strokeWidth={2} />
          {posted}
        </span>
      </div>
    </article>
  )
}

export default JobCard
