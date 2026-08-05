import { NavLink, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  GraduationCap,
  ClipboardList,
  Users,
  Database,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const AdminSidebar = ({ collapsed, onToggle }: AdminSidebarProps) => {
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
            <ShieldCheck size={20} strokeWidth={2} />
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
            <p className="mt-0.5 text-[15px] text-white/70">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-4 pt-6" aria-label="Admin navigation">
        <NavLink to="/admin" end className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <LayoutDashboard size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/kelola-perusahaan" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <Building2 size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Kelola Perusahaan</span>
        </NavLink>

        <NavLink to="/admin/kelola-universitas" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <GraduationCap size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Kelola Universitas</span>
        </NavLink>

        <NavLink to="/admin/log-aktivitas" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <ClipboardList size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Log Aktivitas Pengguna</span>
        </NavLink>

        <NavLink to="/admin/manajemen-pengguna" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <Users size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Manajemen Pengguna</span>
        </NavLink>

        <NavLink to="/admin/master-data" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase} aria-hidden="true">
            <Database size={20} strokeWidth={2} />
          </span>
          <span className={labelClass}>Master Data</span>
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

export default AdminSidebar