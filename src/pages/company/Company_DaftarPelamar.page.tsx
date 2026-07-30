import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Users, Clock, UserCheck, RotateCcw, Download,
  MoreVertical, CheckCircle2, XCircle, AlertCircle, Loader2, Ban
} from 'lucide-react'
import { applicationApi, invitationApi } from '../../services/company.service'

// ============================================================
// HELPER
// ============================================================

// Status lamaran -> label tampilan
const STATUS_LABEL: Record<string, string> = {
  submitted: 'Terkirim',
  processing: 'Diproses',
  accepted: 'Diterima',
  rejected: 'Ditolak',
}

// Status undangan -> label tampilan (jawaban ada di tangan mahasiswa)
const INVITATION_LABEL: Record<string, string> = {
  pending: 'Menunggu Jawaban',
  accepted: 'Diterima Kandidat',
  declined: 'Ditolak Kandidat',
  cancelled: 'Dibatalkan',
}

const pickName = (app: any): string =>
  app?.student?.user?.name ?? app?.student?.name ?? 'Tanpa Nama'

// Skor kecocokan dihitung backend saat menyusun daftar; matchSnapshot dipakai
// sebagai cadangan bila suatu saat skornya hanya tersimpan di sana.
const pickMatch = (app: any): number => {
  if (typeof app?.matchScore === 'number') return Math.round(app.matchScore)
  let snap = app?.matchSnapshot
  if (typeof snap === 'string') {
    try { snap = JSON.parse(snap) } catch { snap = null }
  }
  const score = snap?.score ?? snap?.matchScore ?? snap?.matchPercentage
  return typeof score === 'number' ? Math.round(score) : 0
}

const pickUniversity = (app: any): string =>
  app?.student?.university?.name ?? app?.student?.major ?? app?.student?.nim ?? '-'

const pickDate = (app: any): string => {
  const raw = app?.created_at ?? app?.createdAt
  if (!raw) return '-'
  return new Date(raw).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Warna avatar konsisten per nama (bukan acak tiap render)
const AVATAR_COLORS = ['bg-[#0f5ce0]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#8b5cf6]', 'bg-[#ef4444]', 'bg-[#06b6d4]']
const colorFromName = (name: string) => {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}
const initialFromName = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

// Dipakai dua tabel: id berisi applicationId (tabel Lamar) atau
// invitationId (tabel Undangan), sesuai sumbernya.
interface ApplicantRow {
  id: string
  studentId: string  
  name: string
  email: string
  university: string
  major: string
  nim: string
  role: string            // judul lowongan
  type: string            // jenis pekerjaan
  match: number
  date: string
  status: string          // status mentah backend
  source: 'Lamar' | 'Undangan'
  initial: string
  bgColor: string
}

const Company_DaftarPelamar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const passedRole = location.state?.filterRole

  const [applicants, setApplicants] = useState<ApplicantRow[]>([])
  const [invitationRows, setInvitationRows] = useState<ApplicantRow[]>([])
  const [summary, setSummary] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const [positionFilter, setPositionFilter] = useState(passedRole || 'Semua Posisi')
  const [statusFilter, setStatusFilter] = useState('Semua Status')

  const [currentPageLamar, setCurrentPageLamar] = useState(1)
  const [currentPageUndangan, setCurrentPageUndangan] = useState(1)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dua sumber terpisah: Application (melamar sendiri) dan JobInvitation (diundang).
  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const [appData, invData] = await Promise.all([
        applicationApi.listByCompany(),
        invitationApi.listByCompany().catch((e) => {
          console.warn('[DaftarPelamar] gagal ambil undangan:', e?.response?.status, e?.response?.data?.message)
          return { invitations: [] as any[], summary: {} as Record<string, number> }
        }),
      ])

      setApplicants(
        (appData?.applications ?? []).map((app: any) => {
          const name = pickName(app)
          return {
            id: app.id,
            studentId: app?.student?.id ?? '',
            name,
            email: app?.student?.user?.email ?? '-',
            university: pickUniversity(app),
            major: app?.student?.major ?? '-',
            nim: app?.student?.nim ?? '-',
            role: app?.job?.title ?? '-',
            type: app?.job?.type ?? '-',
            match: pickMatch(app),
            date: pickDate(app),
            status: app.status,
            source: 'Lamar' as const,
            initial: initialFromName(name),
            bgColor: colorFromName(name),
          }
        }),
      )
      setSummary(appData?.summary ?? {})

      setInvitationRows(
        (invData?.invitations ?? []).map((inv: any) => {
          const name = pickName(inv)
          return {
            id: inv.id,
            studentId: inv?.student?.id ?? '',
            name,
            email: inv?.student?.user?.email ?? '-',
            university: pickUniversity(inv),
            major: inv?.student?.major ?? '-',
            nim: inv?.student?.nim ?? '-',
            role: inv?.job?.title ?? '-',
            type: inv?.job?.type ?? '-',
            match: pickMatch(inv),
            date: pickDate(inv),
            status: inv.status,
            source: 'Undangan' as const,
            initial: initialFromName(name),
            bgColor: colorFromName(name),
          }
        }),
      )
    } catch (err: any) {
      setLoadError(
        err?.response?.data?.message ??
          'Gagal memuat daftar pelamar. Pastikan server berjalan dan akun Anda terhubung dengan perusahaan.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Daftar posisi diturunkan dari kedua tabel.
  const uniqueRoles = useMemo(
    () =>
      Array.from(new Set([...applicants, ...invitationRows].map((a) => a.role)))
        .filter((r) => r && r !== '-'),
    [applicants, invitationRows],
  )

  // Ubah status lamaran (optimistic: UI berubah dulu, dibalikkan kalau gagal).
  const handleUpdateStatus = async (id: string, newStatus: 'processing' | 'accepted' | 'rejected') => {
    setActiveMenuId(null)
    setActionError('')
    const before = applicants
    setUpdatingId(id)
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
    try {
      await applicationApi.updateStatus(id, newStatus)
      // segarkan ringkasan dari server supaya kartu statistik ikut akurat
      const { summary: sum } = await applicationApi.listByCompany()
      setSummary(sum ?? {})
    } catch (err: any) {
      setApplicants(before)
      setActionError(err?.response?.data?.message ?? 'Gagal mengubah status lamaran.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Batalkan undangan yang masih menunggu jawaban.
  const handleCancelInvitation = async (id: string, name: string) => {
    setActiveMenuId(null)
    setActionError('')
    if (!window.confirm(`Batalkan undangan untuk ${name}?`)) return
    setUpdatingId(id)
    try {
      await invitationApi.cancel(id)
      setInvitationRows((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)))
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? 'Gagal membatalkan undangan.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Pakai ringkasan dari server bila tersedia; kalau tidak, hitung dari baris.
  const stats = useMemo(() => {
    const hasSummary = summary && Object.keys(summary).length > 0
    if (hasSummary) {
      return {
        total: summary.total ?? applicants.length,
        pending: (summary.submitted ?? 0) + (summary.processing ?? 0),
        diterima: summary.accepted ?? 0,
      }
    }
    return {
      total: applicants.length,
      pending: applicants.filter((a) => a.status === 'submitted' || a.status === 'processing').length,
      diterima: applicants.filter((a) => a.status === 'accepted').length,
    }
  }, [summary, applicants])

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchPosition = positionFilter === 'Semua Posisi' || applicant.role === positionFilter
      const matchStatus = statusFilter === 'Semua Status' || applicant.status === statusFilter
      return matchPosition && matchStatus
    })
  }, [applicants, positionFilter, statusFilter])

  const lamarApplicants = filteredApplicants

// Filter status tidak diterapkan ke undangan karena nilainya berbeda
  // (pending/accepted/declined/cancelled, bukan status lamaran).
  const undanganApplicants = useMemo(() => {
    const rank = (status: string) => (status === 'cancelled' ? 1 : 0)
    return invitationRows
      .filter((a) => positionFilter === 'Semua Posisi' || a.role === positionFilter)
      // undangan yang dibatalkan selalu di urutan paling bawah
      .sort((a, b) => rank(a.status) - rank(b.status))
  }, [invitationRows, positionFilter])

  const handleResetFilter = () => {
    setPositionFilter('Semua Posisi')
    setStatusFilter('Semua Status')
    setCurrentPageLamar(1)
    setCurrentPageUndangan(1)
  }

  const handleExportCSV = () => {
    if (filteredApplicants.length === 0) return

    const headers = ['Nama Kandidat', 'NIM', 'Email', 'Universitas', 'Jurusan', 'Posisi Tujuan', 'Tipe Pekerjaan', 'Match Score (%)', 'Tanggal Melamar', 'Status', 'Sumber']

    const csvData = filteredApplicants.map((app) => [
      `"${app.name}"`,
      `"${app.nim}"`,
      `"${app.email}"`,
      `"${app.university}"`,
      `"${app.major}"`,
      `"${app.role}"`,
      `"${app.type}"`,
      app.match,
      `"${app.date}"`,
      `"${STATUS_LABEL[app.status] ?? app.status}"`,
      `"${app.source}"`,
    ])

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Daftar_Pelamar.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const totalPagesLamar = Math.ceil(lamarApplicants.length / itemsPerPage) || 1
  const totalPagesUndangan = Math.ceil(undanganApplicants.length / itemsPerPage) || 1

  const displayedLamar = useMemo(() => {
    const start = (currentPageLamar - 1) * itemsPerPage
    return lamarApplicants.slice(start, start + itemsPerPage)
  }, [lamarApplicants, currentPageLamar])

  const displayedUndangan = useMemo(() => {
    const start = (currentPageUndangan - 1) * itemsPerPage
    return undanganApplicants.slice(start, start + itemsPerPage)
  }, [undanganApplicants, currentPageUndangan])

  const startIndexLamar = lamarApplicants.length === 0 ? 0 : (currentPageLamar - 1) * itemsPerPage + 1
  const endIndexLamar = Math.min(currentPageLamar * itemsPerPage, lamarApplicants.length)

  const startIndexUndangan = undanganApplicants.length === 0 ? 0 : (currentPageUndangan - 1) * itemsPerPage + 1
  const endIndexUndangan = Math.min(currentPageUndangan * itemsPerPage, undanganApplicants.length)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-[#e6f9f0] text-[#10b981]'
      case 'rejected':
      case 'declined': return 'bg-[#fee2e2] text-[#ef4444]'
      case 'processing':
      case 'pending': return 'bg-[#fffbeb] text-[#f59e0b]'
      case 'cancelled': return 'bg-[#f1f4f9] text-[#7b8191]'
      default: return 'bg-[#eef4ff] text-[#0f5ce0]'
    }
  }

  const getPaginationGroup = (page: number, totalPages: number) => {
    if (totalPages <= 0) return [1]
    const start = page
    const end = Math.min(page + 1, totalPages)
    const pages: number[] = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const renderApplicantsTable = (
    list: ApplicantRow[],
    page: number,
    setPage: (value: number | ((prev: number) => number)) => void,
    totalPages: number,
    startIndex: number,
    endIndex: number,
    total: number,
    emptyText: string,
    isInvitation = false,
  ) => (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[820px]">
          <thead>
            <tr className="border-b border-[#f1f4f9] bg-[#f8faff] text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">
              <th className="px-6 py-4 w-[30%]">Nama Kandidat</th>
              <th className="px-6 py-4 w-[20%]">Posisi Tujuan</th>
              <th className="px-6 py-4 text-center">Match Score</th>
              <th className="px-6 py-4">{isInvitation ? 'Tgl Diundang' : 'Tgl Melamar'}</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f4f9]">
            {list.length > 0 ? (
              list.map((applicant) => {
                const bisaDibatalkan = isInvitation && applicant.status === 'pending'
                const adaMenu = !isInvitation || bisaDibatalkan
                return (
                <tr
                  key={applicant.id}
                  onClick={() => {
                    if (!applicant.studentId) return
                    setActiveMenuId(null)
                    navigate(`/company/detail-kandidat/${applicant.studentId}`)
                  }}
                  title="Lihat detail kandidat"
                  className="hover:bg-[#fafbfe] transition cursor-pointer"
                >

                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${applicant.bgColor} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                        {applicant.initial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#111827] truncate">{applicant.name}</p>
                        <p className="text-[12px] text-[#7b8191] truncate">{applicant.university}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-sm font-semibold text-[#111827] truncate">{applicant.role}</p>
                    <p className="text-[12px] text-[#7b8191]">{applicant.type}</p>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className="text-[15px] font-bold text-[#0f5ce0]">{applicant.match}%</span>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap text-sm text-[#5b6170] font-medium">
                    {applicant.date}
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold ${getStatusStyle(applicant.status)}`}>
                      {isInvitation
                        ? INVITATION_LABEL[applicant.status] ?? applicant.status
                        : STATUS_LABEL[applicant.status] ?? applicant.status}
                    </span>
                  </td>

                  <td
                    className="px-6 py-5 whitespace-nowrap text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {adaMenu ? (
                      <>
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === applicant.id ? null : applicant.id)} 
                          disabled={updatingId === applicant.id}
                          className="text-[#7b8191] hover:text-[#0f5ce0] p-1.5 rounded-lg transition hover:bg-[#eef4ff] disabled:opacity-40"
                        >
                          {updatingId === applicant.id
                            ? <Loader2 size={18} className="animate-spin" />
                            : <MoreVertical size={18} />}
                        </button>
                        {activeMenuId === applicant.id && (
                          <div ref={menuRef} className="absolute right-6 top-8 mt-1 w-44 bg-white border border-[#e4e9f4] rounded-xl shadow-lg py-1.5 z-50 text-left animate-in fade-in duration-100">
                            {isInvitation ? (
                              <>
                                <p className="text-[10px] font-bold text-[#7b8191] px-3 py-1.5 uppercase tracking-wider">Undangan</p>
                                <button onClick={() => handleCancelInvitation(applicant.id, applicant.name)} className="w-full px-3 py-2 text-sm text-[#ef4444] hover:bg-[#fee2e2] font-medium flex items-center gap-2 transition"><Ban size={16} />Batalkan Undangan</button>
                              </>
                            ) : (
                              <>
                                <p className="text-[10px] font-bold text-[#7b8191] px-3 py-1.5 uppercase tracking-wider">Ubah Status</p>
                                <button onClick={() => handleUpdateStatus(applicant.id, 'processing')} className="w-full px-3 py-2 text-sm text-[#f59e0b] hover:bg-[#fffbeb] font-medium flex items-center gap-2 transition"><AlertCircle size={16} />Set Diproses</button>
                                <button onClick={() => handleUpdateStatus(applicant.id, 'accepted')} className="w-full px-3 py-2 text-sm text-[#10b981] hover:bg-[#e6f9f0] font-medium flex items-center gap-2 transition"><CheckCircle2 size={16} />Set Diterima</button>
                                <button onClick={() => handleUpdateStatus(applicant.id, 'rejected')} className="w-full px-3 py-2 text-sm text-[#ef4444] hover:bg-[#fee2e2] font-medium flex items-center gap-2 transition"><XCircle size={16} />Set Ditolak</button>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-[#a0a6b5]">—</span>
                    )}
                  </td>

                </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-sm text-[#a0a6b5] font-medium">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm">
        <div className="text-xs text-[#7b8191] font-medium">
          Menampilkan <span className="text-[#111827] font-semibold">{startIndex}-{endIndex}</span> dari {total} {isInvitation ? 'undangan' : 'pelamar'}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
            disabled={page === 1} 
            className="text-sm font-semibold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#7b8191] disabled:opacity-40 transition mr-2"
          >
            Sebelumnya
          </button>
          {getPaginationGroup(page, totalPages).map((pageNum) => (
            <button 
              key={pageNum} 
              onClick={() => setPage(pageNum)} 
              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                page === pageNum 
                  ? 'bg-[#0f5ce0] text-white shadow-sm' 
                  : 'text-[#5b6170] hover:bg-gray-50 border border-transparent'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button 
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={page === totalPages || totalPages === 0} 
            className="text-sm font-semibold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#7b8191] disabled:opacity-40 transition ml-2"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </>
  )

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat daftar pelamar...</p>
      </div>
    )
  }

  // ---------- Error ----------
  if (loadError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl max-w-md">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Gagal memuat data</p>
            <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
          </div>
        </div>
        <button onClick={loadData} className="px-6 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] transition">
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Daftar Pelamar</h1>
          <p className="text-sm text-[#5b6170] mt-1">Seluruh mahasiswa yang melamar ke lowongan perusahaan Anda.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleExportCSV}
            disabled={filteredApplicants.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e4e9f4] rounded-xl text-sm font-semibold text-[#5b6170] hover:bg-gray-50 transition shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Ekspor CSV
          </button>
          <button 
            onClick={() => navigate('/company/rekomendasi-kandidat')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-semibold text-white hover:bg-[#0d4ebf] transition shadow-sm active:scale-95"
          >
            <Users size={18} />
            Rekomendasi Kandidat
          </button>
        </div>
      </div>

      {/* Pesan error saat mengubah status / membatalkan undangan */}
      {actionError && (
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{actionError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Total Pelamar</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.total}</p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-[10px] text-[#0f5ce0]">
            <Users size={20} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Menunggu Review</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.pending}</p>
          </div>
          <div className="bg-[#fffbe6] p-2.5 rounded-[10px] text-amber-500">
            <Clock size={20} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Kandidat Terpilih</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.diterima}</p>
          </div>
          <div className="bg-[#e6f9f0] p-2.5 rounded-[10px] text-[#10b981]">
            <UserCheck size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={positionFilter} 
            onChange={(e) => { setPositionFilter(e.target.value); setCurrentPageLamar(1); setCurrentPageUndangan(1); }} 
            className="px-4 py-2 bg-white border border-[#e4e9f4] rounded-xl text-sm font-medium text-[#5b6170] focus:outline-none cursor-pointer max-w-[200px] truncate"
          >
            <option value="Semua Posisi">Semua Posisi</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPageLamar(1); setCurrentPageUndangan(1); }} 
            className="px-4 py-2 bg-white border border-[#e4e9f4] rounded-xl text-sm font-medium text-[#5b6170] focus:outline-none cursor-pointer"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="submitted">Terkirim</option>
            <option value="processing">Diproses</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
          
          <button 
            onClick={handleResetFilter} 
            className="p-2 border border-[#e4e9f4] rounded-xl text-[#7b8191] hover:bg-gray-50 hover:text-[#0f5ce0] transition"
            title="Reset Filter"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#f1f4f9]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center px-3 py-1 bg-[#eef4ff] text-[#0f5ce0] rounded-full text-[11px] font-bold">
              Lamar
            </span>
            <h3 className="text-sm font-bold text-[#111827]">Pelamar via Lamar Langsung <span className="text-[#7b8191] font-medium">({lamarApplicants.length})</span></h3>
          </div>
        </div>
        {renderApplicantsTable(
          displayedLamar,
          currentPageLamar,
          setCurrentPageLamar,
          totalPagesLamar,
          startIndexLamar,
          endIndexLamar,
          lamarApplicants.length,
          applicants.length === 0
            ? 'Belum ada mahasiswa yang melamar ke lowongan perusahaan Anda.'
            : 'Tidak ada data pelamar yang sesuai dengan filter.',
        )}
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#f1f4f9]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center px-3 py-1 bg-[#fffbe6] text-[#f59e0b] rounded-full text-[11px] font-bold">
              Undangan
            </span>
            <h3 className="text-sm font-bold text-[#111827]">Kandidat yang Diundang <span className="text-[#7b8191] font-medium">({undanganApplicants.length})</span></h3>
          </div>
        </div>
        {renderApplicantsTable(
          displayedUndangan,
          currentPageUndangan,
          setCurrentPageUndangan,
          totalPagesUndangan,
          startIndexUndangan,
          endIndexUndangan,
          undanganApplicants.length,
          invitationRows.length === 0
            ? 'Belum ada kandidat yang diundang. Kirim undangan dari halaman Rekomendasi Kandidat.'
            : 'Tidak ada undangan yang sesuai dengan filter.',
          true,
        )}
      </div>
    </div>
  )
}

export default Company_DaftarPelamar