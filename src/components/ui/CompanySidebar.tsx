import { NavLink, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  LayoutDashboard,
  Users,
  FileInput,
  User,
  LogOut,
  UserPlus,
  Building2,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'

const CompanySidebar = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const navBase =
    `group grid h-11 min-h-11 w-full grid-cols-[44px_minmax(0,1fr)] items-center overflow-hidden rounded-md px-0 text-[15px] font-medium leading-none !text-white transition-[width,background-color,margin] duration-300 ease-in-out hover:bg-white/10 hover:!text-white`
  const iconBase = 'grid h-auto w-auto flex-none place-items-center !text-white'
  const labelClass = 'whitespace-nowrap text-sm text-left'
  const navActive = '!bg-[#0d6efd] !text-white hover:!bg-[#0d6efd] hover:!text-white'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sticky top-0 flex h-full min-h-screen w-64 shrink-0 flex-col gap-6 overflow-hidden bg-[#052960] px-4 pb-5 pt-6">
      {/* Logo / Brand */}
      <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 pr-8">
        <div className="relative flex h-11 w-11 min-w-11 max-w-11 flex-none items-center justify-center rounded-lg bg-[#0d6efd] text-white">
          <Briefcase size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[17px] font-semibold text-white">CareerSync</p>
          <p className="mt-0.5 text-[13px] text-white/70">Perusahaan</p>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex flex-1 flex-col gap-1 mt-4" aria-label="Company navigation">
        <NavLink to="/company" end className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase}><LayoutDashboard size={20} strokeWidth={2} /></span>
          <span className={labelClass}>Dashboard</span>
        </NavLink>

        <NavLink to="/company/daftar-pelamar" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase}><Users size={20} strokeWidth={2} /></span>
          <span className={labelClass}>Daftar Pelamar</span>
        </NavLink>

        <NavLink to="/company/kelola-lowongan" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase}><FileInput size={20} strokeWidth={2} /></span>
          <span className={labelClass}>Kelola Lowongan</span>
        </NavLink>

        <NavLink to="/company/rekomendasi-kandidat" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase}><User size={20} strokeWidth={2} /></span>
          <span className={labelClass}>Rekomendasi Kandidat</span>
        </NavLink>

        <NavLink to="/company/kandidat-diundang" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase}><UserPlus size={20} strokeWidth={2} /></span>
          <span className={labelClass}>Kandidat Diundang</span>
        </NavLink>

        <NavLink to="/company/profil-perusahaan" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <span className={iconBase}><Building2 size={20} strokeWidth={2} /></span>
          <span className={labelClass}>Profil Perusahaan</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="group grid h-11 w-full grid-cols-[44px_minmax(0,1fr)] items-center rounded-md px-0 text-[15px] font-medium leading-none !text-white/70 transition hover:bg-white/10 hover:!text-white"
        >
          <span className={iconBase}><LogOut size={20} strokeWidth={2} /></span>
          <span className="text-sm text-left">Log Out</span>
        </button>
      </div>
    </aside>
  )
}

export default CompanySidebar