import { NavLink } from 'react-router-dom'
import {
  Briefcase,
  FileInput,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
} from 'lucide-react'

interface StudentSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const StudentSidebar = ({ collapsed, onToggle }: StudentSidebarProps) => {
  const navBase =
    `group grid h-11 min-h-11 w-full grid-cols-[44px_minmax(0,1fr)] items-center overflow-hidden rounded-md px-0 text-[15px] font-medium leading-none !text-white transition-[width,background-color,margin] duration-300 ease-in-out hover:bg-white/10 hover:!text-white`
  const navState = collapsed ? 'mx-auto w-11' : ''
  const navActive = '!bg-[#0d6efd] !text-white hover:!bg-[#0d6efd] hover:!text-white'
  const iconBase =
    'grid h-auto w-auto flex-none place-items-center !text-white transition-colors group-hover:!text-white'
  const labelClass = `whitespace-nowrap text-sm text-left transition-[max-width,opacity,transform] duration-300 ease-in-out ${
    collapsed ? 'max-w-0 opacity-0 translate-x-0' : 'max-w-[180px] opacity-100 translate-x-0'
  }`

  return (
    <aside
      className={`sticky rounded-l-xl top-0 flex h-full shrink-0 flex-col gap-9 overflow-hidden bg-[#052960] px-4 pb-5 pt-4 m-1 transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-19' : 'w-60'
      }`}
    >
      {!collapsed ? (
        <button
          className="absolute right-4 top-6 grid h-8 w-8 place-items-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          type="button"
          aria-label="Collapse sidebar"
          onClick={onToggle}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      ) : null}

      <div className={`grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 pr-8 transition-all duration-300 ease-in-out ${collapsed ? 'mx-0' : ''}`}>
        <div className="group/brand relative flex h-11 w-11 min-w-11 max-w-11 flex-none items-center justify-center rounded-lg bg-[#0d6efd] text-white" aria-hidden="true">
          <GraduationCap size={20} strokeWidth={2} />
          {collapsed ? (
            <button
              className="absolute grid h-10 w-10 place-items-center rounded-lg bg-[#0d6efd] text-white opacity-0 transition-opacity group-hover/brand:opacity-100"
              type="button"
              aria-label="Expand sidebar"
              onClick={onToggle}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
        <div className={labelClass}>
          <p className="text-[17px] font-semibold text-white!">CareerSync</p>
          <p className="mt-0.5 text-[15px] text-white!">Mahasiswa</p>
        </div>
      </div>

      <nav className="grid gap-2 transition-all duration-300 ease-in-out max-[1200px]:flex max-[1200px]:gap-2" aria-label="Student navigation">
        <NavLink
          to="/student"
          end
          className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <LayoutDashboard size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Dashboard</span>
        </NavLink>
        <NavLink
          to="/student/job-matching"
          className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <Briefcase size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Job Matching</span>
        </NavLink>
        <NavLink
          to="/student/job-apply"
          className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <FileInput size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Job Apply</span>
        </NavLink>
        <NavLink
          to="/student/competency-profile"
          className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <User size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Competency Profile</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default StudentSidebar
