import { NavLink, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  FileInput,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'

interface StudentSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const StudentSidebar = ({ collapsed, onToggle }: StudentSidebarProps) => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const navBase =
    `group grid h-11 min-h-11 w-full grid-cols-[44px_minmax(0,1fr)] items-center overflow-hidden rounded-xl px-0 text-[15px] font-medium leading-none !text-white transition-[width,background-color,margin] duration-300 ease-in-out hover:bg-white/10 hover:!text-white`
  const navActive = '!bg-[#0f5ce0] !text-white hover:!bg-[#0d4ebf] hover:!text-white'
  const iconBase =
    'grid h-full w-11 flex-none place-items-center !text-white transition-colors group-hover:!text-white'
  const labelClass = `whitespace-nowrap text-sm text-left transition-[max-width,opacity,transform] duration-300 ease-in-out ${
    collapsed ? 'max-w-0 opacity-0 translate-x-0' : 'max-w-[180px] opacity-100 translate-x-0'
  }`

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`sticky top-0 left-0 flex h-screen shrink-0 flex-col overflow-hidden bg-[#031635] transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-19' : 'w-60'
      }`}
    >
      {!collapsed ? (
        <button
          className="absolute right-4 top-6 z-10 grid h-8 w-8 place-items-center rounded-xl text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          type="button"
          aria-label="Collapse sidebar"
          onClick={onToggle}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      ) : null}

      <div className="flex h-20 w-full shrink-0 items-center border-b border-white/10 px-4">
        <div className="flex w-full items-center gap-3 overflow-hidden">
          <div className="group/brand relative flex h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f5ce0] text-white">
            <GraduationCap size={20} strokeWidth={2} />
            {collapsed ? (
              <button
                className="absolute inset-0 grid place-items-center rounded-xl bg-[#0f5ce0] opacity-0 transition-opacity group-hover/brand:opacity-100"
                type="button"
                aria-label="Expand sidebar"
                onClick={onToggle}
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            ) : null}
          </div>
          <div className={labelClass}>
            <p className="text-[18px] font-semibold text-white">Talentry</p>
            <p className="mt-0.5 text-[15px] text-white/70">Mahasiswa</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-4 pt-6" aria-label="Student navigation">
        <NavLink to="/student" end className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <LayoutDashboard size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Dashboard</span>
        </NavLink>

        <NavLink to="/student/job-matching" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <Briefcase size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Job Matching</span>
        </NavLink>

        <NavLink to="/student/job-apply" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <FileInput size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Job Apply</span>
        </NavLink>

        <NavLink to="/student/competency-profile" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <User size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Competency Profile</span>
        </NavLink>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-4 py-5">
        <button
          type="button"
          onClick={handleLogout}
          className={`${navBase} !text-white/70`}
        >
          <span className={iconBase} aria-hidden="true">
            <LogOut size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Log Out</span>
        </button>
      </div>
    </aside>
  )
}

export default StudentSidebar