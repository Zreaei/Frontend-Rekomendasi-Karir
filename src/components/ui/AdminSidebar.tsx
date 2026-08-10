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
    `group grid h-11 min-h-11 w-full grid-cols-[44px_minmax(0,1fr)] items-center overflow-hidden rounded-lg px-0 text-[14px] font-medium leading-none transition-all duration-300 ease-in-out hover:bg-[#eef4ff]`
  const navActive = 'bg-[#dfe9ff]'

  const labelClass = `whitespace-nowrap text-left transition-[max-width,opacity,transform] duration-300 ease-in-out ${
    collapsed ? 'max-w-0 opacity-0 translate-x-0' : 'max-w-[180px] opacity-100 translate-x-0'
  }`

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`sticky top-0 left-0 flex h-screen shrink-0 flex-col overflow-hidden bg-white border-r border-[#d7dbe3] transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-19' : 'w-60'
      }`}
    >
      {!collapsed ? (
        <button
          className="absolute right-4 top-6 z-10 grid h-8 w-8 place-items-center rounded-lg text-[#6d7480] border border-transparent transition-colors hover:bg-[#eef4ff] hover:text-[#0d6efd]"
          type="button"
          aria-label="Collapse sidebar"
          onClick={onToggle}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      ) : null}

      <div className="flex h-20 w-full shrink-0 items-center border-b border-[#d7dbe3] px-4">
        <div className="flex w-full items-center gap-3 overflow-hidden">
          <div className="group/brand relative flex h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-xl bg-[#0d6efd] text-white">
            <ShieldCheck size={20} strokeWidth={2} />
            {collapsed ? (
              <button
                className="absolute inset-0 grid place-items-center rounded-xl bg-[#0d6efd] opacity-0 transition-opacity group-hover/brand:opacity-100"
                type="button"
                aria-label="Expand sidebar"
                onClick={onToggle}
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            ) : null}
          </div>
          <div className={labelClass}>
            <p className="text-[18px] font-semibold text-[#0f1728]">Talentry</p>
            <p className="mt-0.5 text-[14px] text-[#6d7480]">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden px-4 pt-6" aria-label="Admin navigation">
        <NavLink to="/admin" end className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          {({ isActive }) => (
            <>
              <span className={`grid h-full w-11 flex-none place-items-center transition-colors ${isActive ? 'text-[#0d6efd]' : 'text-[#6d7480] group-hover:text-[#0d6efd]'}`} aria-hidden="true">
                <LayoutDashboard size={18} strokeWidth={2} />
              </span>
              <span className={`${labelClass} ${isActive ? 'text-[#0d6efd]' : 'text-[#2a2f39] group-hover:text-[#0d6efd]'}`}>Dashboard</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/kelola-perusahaan" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          {({ isActive }) => (
            <>
              <span className={`grid h-full w-11 flex-none place-items-center transition-colors ${isActive ? 'text-[#0d6efd]' : 'text-[#6d7480] group-hover:text-[#0d6efd]'}`} aria-hidden="true">
                <Building2 size={18} strokeWidth={2} />
              </span>
              <span className={`${labelClass} ${isActive ? 'text-[#0d6efd]' : 'text-[#2a2f39] group-hover:text-[#0d6efd]'}`}>Kelola Perusahaan</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/kelola-universitas" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          {({ isActive }) => (
            <>
              <span className={`grid h-full w-11 flex-none place-items-center transition-colors ${isActive ? 'text-[#0d6efd]' : 'text-[#6d7480] group-hover:text-[#0d6efd]'}`} aria-hidden="true">
                <GraduationCap size={18} strokeWidth={2} />
              </span>
              <span className={`${labelClass} ${isActive ? 'text-[#0d6efd]' : 'text-[#2a2f39] group-hover:text-[#0d6efd]'}`}>Kelola Universitas</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/log-aktivitas" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          {({ isActive }) => (
            <>
              <span className={`grid h-full w-11 flex-none place-items-center transition-colors ${isActive ? 'text-[#0d6efd]' : 'text-[#6d7480] group-hover:text-[#0d6efd]'}`} aria-hidden="true">
                <ClipboardList size={18} strokeWidth={2} />
              </span>
              <span className={`${labelClass} ${isActive ? 'text-[#0d6efd]' : 'text-[#2a2f39] group-hover:text-[#0d6efd]'}`}>Log Aktivitas Pengguna</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/manajemen-pengguna" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          {({ isActive }) => (
            <>
              <span className={`grid h-full w-11 flex-none place-items-center transition-colors ${isActive ? 'text-[#0d6efd]' : 'text-[#6d7480] group-hover:text-[#0d6efd]'}`} aria-hidden="true">
                <Users size={18} strokeWidth={2} />
              </span>
              <span className={`${labelClass} ${isActive ? 'text-[#0d6efd]' : 'text-[#2a2f39] group-hover:text-[#0d6efd]'}`}>Manajemen Pengguna</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/master-data" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          {({ isActive }) => (
            <>
              <span className={`grid h-full w-11 flex-none place-items-center transition-colors ${isActive ? 'text-[#0d6efd]' : 'text-[#6d7480] group-hover:text-[#0d6efd]'}`} aria-hidden="true">
                <Database size={18} strokeWidth={2} />
              </span>
              <span className={`${labelClass} ${isActive ? 'text-[#0d6efd]' : 'text-[#2a2f39] group-hover:text-[#0d6efd]'}`}>Master Data</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="shrink-0 border-t border-[#d7dbe3] p-4">
        <div className={`mb-3 flex items-center gap-3 rounded-xl bg-[#f7f9fc] transition-all duration-300 ${collapsed ? 'justify-center p-2' : 'px-3 py-3'}`}>
          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#d9e5ff] text-[13px] font-bold text-[#0d6efd]">
            SA
          </div>
          <div className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'}`}>
            <p className="truncate text-[13px] font-semibold text-[#0f1728]">Super Admin</p>
            <p className="truncate text-[12px] text-[#6d7480]">Administrator</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0d6efd] text-[13px] font-semibold text-white transition-colors hover:bg-[#0b5ed7] ${collapsed ? 'px-0' : 'px-4'}`}
        >
          <LogOut size={16} strokeWidth={2} aria-hidden="true" />
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[100px] opacity-100'}`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar