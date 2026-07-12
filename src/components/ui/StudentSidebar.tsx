import { NavLink } from 'react-router-dom'
import {
  Briefcase,
  FileInput,
  GraduationCap,
  LayoutDashboard,
  MailOpen,
  LogOut,
  ScrollText,
  User,
} from 'lucide-react'

interface StudentSidebarProps {
}

const StudentSidebar = (_props: StudentSidebarProps) => {
  const navBase =
    'group grid h-10 min-h-10 w-full grid-cols-[24px_minmax(0,1fr)] items-center gap-3 rounded-md px-2 text-[13px] font-medium text-[#2a2f39] transition-colors hover:bg-[#eef4ff] hover:text-[#0d6efd]'
  const navActive = 'bg-[#dfe9ff] text-[#0d6efd]'

  return (
    <aside className="flex h-full shrink-0 w-55 flex-col border-r border-[#d7dbe3] bg-white">
      <div className="flex items-center gap-3 border-b border-[#d7dbe3] px-4 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#0d6efd] text-white" aria-hidden="true">
          <GraduationCap size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[16px] font-semibold leading-none text-[#0f1728]">Careering</p>
          <p className="mt-1 text-[12px] text-[#6d7480]">Mahasiswa</p>
        </div>
      </div>

      <nav className="grid gap-1 px-2 py-3" aria-label="Student navigation">
        <NavLink to="/student" end className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <LayoutDashboard size={18} strokeWidth={2} aria-hidden="true" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/student/job-matching" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <Briefcase size={18} strokeWidth={2} aria-hidden="true" />
          <span>Rekomendasi Pekerjaan</span>
        </NavLink>
        <NavLink to="/student/job-apply" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <FileInput size={18} strokeWidth={2} aria-hidden="true" />
          <span>Lamaran Pekerjaan</span>
        </NavLink>
        <NavLink to="/student/invitation" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <MailOpen size={18} strokeWidth={2} aria-hidden="true" />
          <span>Undangan</span>
        </NavLink>
        <NavLink to="/student/certification" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <ScrollText size={18} strokeWidth={2} aria-hidden="true" />
          <span>Sertifikasi</span>
        </NavLink>
        <NavLink to="/student/competency-profile" className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}>
          <User size={18} strokeWidth={2} aria-hidden="true" />
          <span>Profil Kompetensi</span>
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-[#d7dbe3] p-3">
        <div className="flex items-center gap-3 rounded-xl bg-[#f7f9fc] px-3 py-3">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#d9e5ff] text-[12px] font-semibold text-[#0d6efd]">
            SH
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#0f1728]">Sigit Kurnia Hartawan</p>
            <p className="text-[12px] text-[#6d7480]">Teknik Informatika</p>
          </div>
        </div>

        <button
          className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#0d6efd] text-[13px] font-semibold text-white transition-colors hover:bg-[#0b5ed7]"
          type="button"
        >
          <LogOut size={15} strokeWidth={2} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default StudentSidebar
