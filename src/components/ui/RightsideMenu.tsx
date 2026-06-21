import { NavLink } from 'react-router-dom'
import IconBase from '../common/IconBase'
import {
  Bell,
  ChevronRight,
  CircleQuestionMark,
  LogOut,
  Menu,
} from 'lucide-react'

interface RightsideMenuProps {
  collapsed: boolean
  onToggle: () => void
}

const RightsideMenu = ({ collapsed, onToggle }: RightsideMenuProps) => {
  const itemClass =
    'grid h-9 w-10 place-items-center rounded-lg transition-colors hover:bg-white/10'

  return (
    <div
      className={`fixed right-8 top-8 z-20 flex w-fit rounded-xl bg-[#052960] p-1 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-auto gap-0' : 'w-auto gap-2'
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          collapsed
            ? 'max-w-0 opacity-0 transition-all duration-300 ease-in-out pointer-events-none'
            : 'max-w-44 opacity-100 transition-all duration-300 ease-in-out'
        }`}
        aria-hidden={collapsed}
      >
        <NavLink
          to="/student/notification"
          className={itemClass}
          tabIndex={collapsed ? -1 : undefined}
        >
          <IconBase icon={Bell} size={20} strokeWidth={2} />
        </NavLink>
        <NavLink
          to="/student/help"
          className={itemClass}
          tabIndex={collapsed ? -1 : undefined}
        >
          <IconBase icon={CircleQuestionMark} size={20} strokeWidth={2} />
        </NavLink>
        <NavLink
          to="/student/logout"
          className={itemClass}
          tabIndex={collapsed ? -1 : undefined}
        >
          <IconBase icon={LogOut} size={20} strokeWidth={2} />
        </NavLink>
      </div>

      <button
        type="button"
        className={itemClass}
        aria-label={collapsed ? 'Expand right side menu' : 'Collapse right side menu'}
        aria-expanded={!collapsed}
        onClick={onToggle}
      >
        {collapsed ? (
          <Menu className="text-white" size={20} strokeWidth={2} />
        ) : (
          <ChevronRight className="text-white" size={20} strokeWidth={2.5} />
        )}
      </button>
    </div>
  )
}

export default RightsideMenu
