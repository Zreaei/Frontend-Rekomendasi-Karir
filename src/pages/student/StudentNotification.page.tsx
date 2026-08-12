import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import { studentNotificationApi, type NotificationItem } from '../../services/student.service'

const formatDate = (value?: string | null) => {
  if (!value) return ''
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const StudentNotification = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    let aktif = true
    studentNotificationApi
      .list()
      .then((data) => { if (aktif) setNotifications(data) })
      .catch(() => { /* biarkan kosong */ })
      .finally(() => { if (aktif) setLoading(false) })
    return () => { aktif = false }
  }, [])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/student')
  }

  const markAllRead = async () => {
    try {
      await studentNotificationApi.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      /* dibiarkan */
    }
  }

  const markRead = async (notification: NotificationItem) => {
    if (notification.isRead) return
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
    try {
      await studentNotificationApi.markRead(notification.id)
    } catch {
      /* dibiarkan */
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const visible = filter === 'all' ? notifications : notifications.filter((n) => !n.isRead)

  return (
    <main className="min-h-screen bg-gray-200 px-6 py-8">
      <button
        className="flex fixed top-8 left-8 py-2 items-center gap-2 rounded-md border border-[#d9dce5] bg-white px-3 text-[14px] font-semibold text-[#232342] shadow-sm transition-colors hover:bg-[#f4f6fb]"
        type="button"
        onClick={handleBack}
      >
        <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      <section className="mx-auto w-full max-w-132">
        <div className="mb-9">
          <h1 className="text-[30px] font-bold leading-tight text-[#050505]">Notifikasi</h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[#232342]">
            Ikuti perkembangan lamaran, undangan, dan aktivitas akun Anda.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-[#dedede] pb-4">
            <div className="flex items-center gap-6 text-[14px] font-semibold text-[#232342]">
              <button
                className={`border-none bg-transparent p-0 ${filter === 'all' ? 'font-bold text-[#050505]' : 'font-medium text-[#232342]'}`}
                type="button"
                onClick={() => setFilter('all')}
              >
                Semua
              </button>
              <button
                className={`border-none bg-transparent p-0 ${filter === 'unread' ? 'font-bold text-[#050505]' : 'font-medium text-[#232342]'}`}
                type="button"
                onClick={() => setFilter('unread')}
              >
                Belum Dibaca ({unreadCount})
              </button>
            </div>
            <button
              className="border-none bg-transparent p-0 text-[12px] font-medium text-[#5f5f73] hover:text-[#0d6efd]"
              type="button"
              onClick={markAllRead}
            >
              Tandai semua dibaca
            </button>
          </div>

          {loading ? (
            <div className="grid min-h-55 place-items-center text-center">
              <p className="text-[14px] text-[#5c6577]">Memuat notifikasi...</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="grid min-h-55 place-items-center text-center">
              <div>
                <Bell
                  className="mx-auto text-[#6f7787]"
                  size={40}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <p className="mt-4 text-[16px] font-medium text-[#232342]">
                  {filter === 'unread' ? 'Semua notifikasi sudah dibaca.' : 'Belum ada notifikasi.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-0">
              {visible.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={`border-b border-[#eef0f4] px-1 py-4 text-left last:border-b-0 ${notification.isRead ? '' : 'bg-[#f5f9ff]'}`}
                  onClick={() => markRead(notification)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? 'bg-transparent' : 'bg-[#0d6efd]'}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#050505]">
                        {notification.title ?? 'Notifikasi'}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-[#4f5a6d]">
                        {notification.message ?? notification.body ?? ''}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8b93a5]">
                        {formatDate(notification.created_at ?? notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default StudentNotification
