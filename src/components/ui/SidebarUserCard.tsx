import { useEffect } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { authApi } from '../../services/api.service'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Super Admin',
  university: 'Admin Kampus',
  university_staff: 'Kaprodi',
  company: 'Direktur Perusahaan',
  company_staff: 'HRD / Rekruter',
  student: 'Mahasiswa',
}

const initialFromName = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'

interface SidebarUserCardProps {
  collapsed: boolean
  /** Warna teks & latar inisial, agar cocok dengan tema tiap sidebar. */
  accentClass?: string
}

const SidebarUserCard = ({
  collapsed,
  accentClass = 'bg-[#d9e5ff] text-[#0d6efd]',
}: SidebarUserCardProps) => {
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.role)
  const setUser = useAuthStore((state) => state.setUser)

  // Sesi lama (sebelum data user disimpan di store) tidak punya nama;
  // ambil sekali dari server agar kartu tetap terisi.
  useEffect(() => {
    if (user) return
    let aktif = true
    authApi
      .me()
      .then((res: any) => {
        const u = res?.data ?? res
        if (aktif && u?.id) setUser(u)
      })
      .catch(() => {
        /* dibiarkan: kartu memakai teks cadangan */
      })
    return () => { aktif = false }
  }, [user, setUser])

  const nama = user?.name ?? 'Pengguna'
  const label = ROLE_LABEL[role ?? ''] ?? 'Akun Pengguna'

  return (
    <div
      className={`mb-3 flex items-center gap-3 rounded-xl bg-[#f7f9fc] transition-all duration-300 ${
        collapsed ? 'justify-center p-2' : 'px-3 py-3'
      }`}
      title={collapsed ? `${nama} — ${label}` : undefined}
    >
      <div className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-[13px] font-bold ${accentClass}`}>
        {initialFromName(nama)}
      </div>
      <div
        className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${
          collapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
        }`}
      >
        <p className="truncate text-[13px] font-semibold text-[#0f1728]">{nama}</p>
        <p className="truncate text-[12px] text-[#6d7480]">{label}</p>
      </div>
    </div>
  )
}

export default SidebarUserCard