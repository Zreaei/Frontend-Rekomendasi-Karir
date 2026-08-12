import { NavLink, useNavigate } from 'react-router-dom'
import {
  Award,
  Bookmark,
  Briefcase,
  CircleUserRound,
  FileText,
  LineSquiggle,
  LayoutDashboard,
  Mail,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'

const StudentSidebar = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navBase =
    'group flex h-14 w-full items-center gap-3 border-l-[3px] border-transparent px-5 text-[13px] leading-none font-semibold text-[#4a5160] transition-colors hover:bg-[#f5f7fd] hover:text-[#1a5ec8]'
  const navActive = 'border-l-[#0f5ec7] bg-[#e5ecff] !text-[#004395]'
  const iconClass = 'h-5 w-5 shrink-0 stroke-[2.1px]'

  return (
    <aside className="flex h-full w-70.5 shrink-0 flex-col border-r border-[#d8dde8] bg-white">
      <div className="px-6 pt-8 pb-7">
        <div className="flex items-start gap-3">
          <LineSquiggle className="h-13 w-13 text-[#0f5ec7]" strokeWidth={2.1} aria-hidden="true" />
          <div>
            <p className="text-3xl leading-none font-bold text-[#162a4b]">Talentry</p>
            <p className="mt-2 text-[12px] leading-none font-medium text-[#505866]">Mahasiswa</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col" aria-label="Student navigation">
        <NavLink to="/student" end className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <LayoutDashboard className={iconClass} aria-hidden="true" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/student/job-matching" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <Briefcase className={iconClass} aria-hidden="true" />
          <span>Rekomendasi Pekerjaan</span>
        </NavLink>
        <NavLink to="/student/job-apply" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <FileText className={iconClass} aria-hidden="true" />
          <span>Lamaran Pekerjaan</span>
        </NavLink>
        <NavLink to="/student/invitation" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <Mail className={iconClass} aria-hidden="true" />
          <span>Undangan</span>
        </NavLink>
        <NavLink to="/student/certification" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <Award className={iconClass} aria-hidden="true" />
          <span>Sertifikasi</span>
        </NavLink>
        <NavLink to="/student/saved-jobs" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <Bookmark className={iconClass} aria-hidden="true" />
          <span>Pekerjaan Tersimpan</span>
        </NavLink>
        <NavLink to="/student/competency-profile" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <CircleUserRound className={iconClass} aria-hidden="true" />
          <span>Profil Kompetensi</span>
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-[#d8dde8] px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-[#90cb58] bg-[radial-gradient(circle_at_35%_30%,#ffd66f_2px,#83b65a_48%,#4f7f3f_100%)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M6.5 19c.8-2.9 2.8-4.3 5.5-4.3s4.7 1.4 5.5 4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-none font-semibold text-[#18263f]">{user?.name ?? 'Mahasiswa'}</p>
            <p className="mt-1 truncate text-[13px] leading-none font-medium text-[#4f5664]">{user?.email ?? ''}</p>
          </div>
        </div>

        <button
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#145bc6] text-[13px] leading-none font-semibold text-white transition-colors hover:bg-[#0f4fab]"
          type="button"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default StudentSidebar
