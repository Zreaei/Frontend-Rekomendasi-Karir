import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Bell, CircleQuestionMark } from 'lucide-react'
import { studentNotificationApi } from '../../services/student.service'

const buttonClass =
  'relative grid h-10 w-10 place-items-center rounded-lg border border-[#d7dbe3] bg-white text-[#6d7480] transition-colors hover:bg-[#eef4ff] hover:text-[#0d6efd]'
const activeClass = 'border-[#0d6efd] bg-[#eef4ff] text-[#0d6efd]'

const StudentHeaderActions = () => {
  const location = useLocation()
  const [unread, setUnread] = useState(0)

  // Disegarkan tiap kali pindah halaman, supaya jumlahnya ikut turun
  // setelah notifikasi dibuka dan ditandai dibaca.
  useEffect(() => {
    let aktif = true
    studentNotificationApi
      .unreadCount()
      .then((n) => { if (aktif) setUnread(n) })
      .catch(() => { /* lencana disembunyikan bila gagal */ })
    return () => { aktif = false }
  }, [location.pathname])

  return (
    <>
      <NavLink
        to="/student/notification"
        className={({ isActive }) => `${buttonClass} ${isActive ? activeClass : ''}`}
        aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : 'Notifikasi'}
        title="Notifikasi"
      >
        <Bell size={18} strokeWidth={2} aria-hidden="true" />
        {unread > 0 ? (
          <span
            className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#d92d20] px-1 text-[10px] font-bold text-white"
            aria-hidden="true"
          >
            {unread > 99 ? '99+' : unread}
          </span>
        ) : null}
      </NavLink>

      <NavLink
        to="/student/help"
        className={({ isActive }) => `${buttonClass} ${isActive ? activeClass : ''}`}
        aria-label="Bantuan"
        title="Bantuan"
      >
        <CircleQuestionMark size={18} strokeWidth={2} aria-hidden="true" />
      </NavLink>
    </>
  )
}

export default StudentHeaderActions
