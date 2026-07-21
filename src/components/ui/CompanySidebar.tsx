import { NavLink, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  LayoutDashboard,
  Users,
  FileInput,
  User,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'

interface CompanySidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const CompanySidebar = ({ collapsed, onToggle }: CompanySidebarProps) => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const navBase =
    `group grid h-11 min-h-11 w-full grid-cols-[44px_minmax(0,1fr)] items-center overflow-hidden rounded-md px-0 text-[15px] font-medium leading-none !text-white transition-[width,background-color,margin] duration-300 ease-in-out hover:bg-white/10 hover:!text-white`
  const navState = collapsed ? 'mx-auto w-11' : ''
  const navActive = '!bg-[#0d6efd] !text-white hover:!bg-[#0d6efd] hover:!text-white'
  const iconBase =
    'grid h-auto w-auto flex-none place-items-center !text-white transition-colors group-hover:!text-white'
  const labelClass = `whitespace-nowrap text-sm text-left transition-[max-width,opacity,transform] duration-300 ease-in-out ${
    collapsed ? 'max-w-0 opacity-0 translate-x-0' : 'max-w-[180px] opacity-100 translate-x-0'
  }`

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`sticky top-0 left-0 flex h-screen shrink-0 flex-col gap-9 overflow-hidden bg-[#052960] px-4 pb-5 pt-6 transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-19' : 'w-60'
      }`}
    >
      {!collapsed ? (
        <button
          className="absolute right-4 top-7 grid h-8 w-8 place-items-center rounded-md text-white/95 transition-colors hover:bg-white/10 hover:text-white"
          type="button"
          aria-label="Collapse sidebar"
          onClick={onToggle}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      ) : null}

      <div className={`grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 pr-8 transition-all duration-300 ease-in-out ${collapsed ? 'mx-0' : ''}`}>
        <div className="group/brand relative flex h-11 w-11 min-w-11 max-w-11 flex-none items-center justify-center rounded-lg bg-[#0d6efd] text-white" aria-hidden="true">
          <Briefcase size={20} strokeWidth={2} />
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
          <p className="text-[17px] font-semibold text-white">CareerSync</p>
          <p className="mt-0.5 text-[13px] text-white/70">Perusahaan</p>
        </div>
      </div>

      <nav className="grid gap-2 transition-all duration-300 ease-in-out flex-1 content-start" aria-label="Company navigation">
        <NavLink to="/company" end className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <LayoutDashboard size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Dashboard</span>
        </NavLink>

        <NavLink to="/company/daftar-pelamar" className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <Users size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Daftar Pelamar</span>
        </NavLink>

        <NavLink to="/company/kelola-lowongan" className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <FileInput size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Kelola Lowongan</span>
        </NavLink>

        <NavLink to="/company/rekomendasi-kandidat" className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <User size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Rekomendasi Kandidat</span>
        </NavLink>

        <NavLink to="/company/profil-perusahaan" className={({ isActive }) => `${navBase} ${navState} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <Building2 size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Profil Perusahaan</span>
        </NavLink>
      </nav>

      <div className={`mt-auto border-t border-white/10 pt-4 ${collapsed ? 'w-11 mx-auto' : 'w-full'}`}>
        <button
          type="button"
          onClick={handleLogout}
          className={`group grid h-11 w-full grid-cols-[44px_minmax(0,1fr)] items-center overflow-hidden rounded-md px-0 text-[15px] font-medium leading-none !text-white/70 transition-[width,background-color,margin] duration-300 ease-in-out hover:bg-white/10 hover:!text-white ${navState}`}
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

export default CompanySidebar