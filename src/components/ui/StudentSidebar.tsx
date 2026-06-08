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
  const navBase =
    'group flex min-h-9 items-center gap-2 rounded px-2 py-1.5 text-[15px] font-medium leading-none !text-white transition-colors hover:bg-white/10 hover:!text-white'
  const navActive = '!bg-[#0d6efd] !text-white hover:!bg-[#0d6efd] hover:!text-white'
  const iconBase = 'grid h-4 w-4 flex-none place-items-center !text-white transition-colors group-hover:!text-white'

  return (
    <aside className="sticky top-0 flex h-[100svh] flex-col gap-9 overflow-y-auto border-r border-[#0a2c66] bg-[#052960] px-4 pb-5 pt-4 max-[1200px]:static max-[1200px]:h-auto max-[1200px]:flex-row max-[1200px]:items-center max-[1200px]:overflow-x-auto">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0d6efd] text-white" aria-hidden="true">
          <GraduationCap size={22} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[17px] font-semibold !text-white">CareerSync</p>
          <p className="mt-0.5 text-[15px] !text-white">Mahasiswa</p>
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
            <Briefcase size={20} strokeWidth={2} />
          </span>
          Job Matching
        </NavLink>
        <NavLink
          to="/student/job-apply"
          className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <FileInput size={20} strokeWidth={2} />
          </span>
          Job Apply
        </NavLink>
        <NavLink
          to="/student/competency-profile"
          className={({ isActive }) => `${navBase} ${isActive ? navActive : ''}`}
        >
          <span className={iconBase} aria-hidden="true">
            <User size={20} strokeWidth={2} />
          </span>
          Competency Profile
        </NavLink>
      </nav>

      <div className="mt-auto grid gap-3 max-[1200px]:mt-0 max-[1200px]:flex max-[1200px]:gap-2">
        <button className={navBase} type="button">
          <span className={iconBase} aria-hidden="true">
            <Bell size={17} strokeWidth={2} />
          </span>
          Notification
        </button>
        <button className={navBase} type="button">
          <span className={iconBase} aria-hidden="true">
            <CircleQuestionMark size={17} strokeWidth={2} />
          </span>
          Help
        </button>
        <button className={navBase} type="button">
          <span className={iconBase} aria-hidden="true">
            <LogOut size={17} strokeWidth={2} />
          </span>
          Exit
        </button>
      </div>
    </aside>
  )
}

export default StudentSidebar
