import { NavLink } from 'react-router-dom'
import {
  Briefcase,
  FileInput,
  GraduationCap,
  LayoutDashboard,
  Bell,
  CircleQuestionMark,
  LogOut,
  User,
} from 'lucide-react'

const StudentSidebar = () => {
  const navBase = 'flex min-h-10 items-center gap-2.5 rounded px-2.5 py-2 text-base font-semibold leading-none text-[#050505] transition-colors hover:bg-white'
  const navActive = '!bg-[#0d6efd] !text-white hover:!bg-[#0d6efd] hover:!text-white'
  const iconBase = 'grid h-5 w-5 flex-none place-items-center'

  return (
    <aside className="sticky top-0 flex h-[100svh] flex-col gap-11 overflow-y-auto border-r border-[#d9dce2] bg-[#fafafa] px-[18px] pb-6 pt-5 max-[1200px]:static max-[1200px]:h-auto max-[1200px]:flex-row max-[1200px]:items-center max-[1200px]:overflow-x-auto">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#0d6efd] text-white" aria-hidden="true">
          <GraduationCap size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-lg font-semibold text-[#050505]">CareerSync</p>
          <p className="mt-0.5 text-base text-[#73737a]">Mahasiswa</p>
        </div>
      </div>

      <nav className="grid gap-2 max-[1200px]:flex max-[1200px]:gap-2" aria-label="Student navigation">
        <NavLink
          to="/student"
          end
          className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <LayoutDashboard size={18} strokeWidth={2} />
          </span>
          Dashboard
        </NavLink>
        <NavLink
          to="/student/job-matching"
          className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <Briefcase size={22} strokeWidth={2} />
          </span>
          Job Matching
        </NavLink>
        <NavLink
          to="/student/job-apply"
          className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <FileInput size={22} strokeWidth={2} />
          </span>
          Job Apply
        </NavLink>
        <button className={`${navBase} w-full bg-transparent`} type="button">
          <span className={iconBase} aria-hidden="true">
            <User size={22} strokeWidth={2} />
          </span>
          Competency Profile
        </button>
      </nav>

      <div className="mt-auto grid gap-[18px] max-[1200px]:mt-0 max-[1200px]:flex max-[1200px]:gap-2">
        <button className={navBase} type="button">
          <span className={iconBase} aria-hidden="true">
            <Bell size={18} strokeWidth={2} />
          </span>
          Notification
        </button>
        <button className={navBase} type="button">
          <span className={iconBase} aria-hidden="true">
            <CircleQuestionMark size={18} strokeWidth={2} />
          </span>
          Help
        </button>
        <button className={navBase} type="button">
          <span className={iconBase} aria-hidden="true">
            <LogOut size={18} strokeWidth={2} />
          </span>
          Exit
        </button>
      </div>
    </aside>
  )
}

export default StudentSidebar
