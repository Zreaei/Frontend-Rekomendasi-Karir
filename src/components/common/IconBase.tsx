import type { LucideIcon } from "lucide-react"

interface IconBaseProps {
  icon: LucideIcon
  size?: number
  strokeWidth?: number
  color?: string
}

const IconBase = ({ icon: Icon, size, strokeWidth, color }: IconBaseProps) => {
  return(
    <span className="grid h-auto w-auto flex-none place-items-center text-white! transition-colors group-hover:text-white!">
      <Icon 
        size={size} 
        strokeWidth={strokeWidth} 
        color={color} 
      />
    </span>
  )
}

export default IconBase