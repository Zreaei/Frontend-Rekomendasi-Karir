import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, User, GraduationCap, Building2, Play, Eye, Bookmark, FileText, Filter, ChevronDown, RotateCcw } from 'lucide-react'
import { adminAnalyticsApi, getInitialsOf } from '../../services/admin.service'
import type { AdminActivityLog } from '../../services/admin.service'
import Toast from './components/Toast'

type TabKey = 'mahasiswa' | 'universitas' | 'perusahaan'

// tab UI -> group di backend
const TAB_GROUP: Record<TabKey, 'student' | 'university' | 'company'> = {
  mahasiswa: 'student',
  universitas: 'university',
  perusahaan: 'company',
}

// Opsi filter per tab — nilainya sama dengan nama aktivitas dari backend
const activityLogFilterOptions: Record<TabKey, { label: string; value: string }[]> = {
  mahasiswa: [
    { label: 'Semua Aktivitas', value: 'all' },
    { label: 'Apply Job', value: 'Apply Job' },
    { label: 'Save Job', value: 'Save Job' },
    { label: 'View Job', value: 'View Job' },
  ],
  universitas: [
    { label: 'Semua Aktivitas', value: 'all' },
    { label: 'Verifikasi Berkas', value: 'VERIFIKASI BERKAS' },
    { label: 'Tambah Mahasiswa', value: 'TAMBAH MAHASISWA' },
  ],
  perusahaan: [
    { label: 'Semua Aktivitas', value: 'all' },
    { label: 'Post Lowongan', value: 'Post Lowongan' },
    { label: 'Kirim Undangan', value: 'Kirim Undangan' },
  ],
}

// "2026-08-12T07:15:00Z" -> { time: "14:15:00", date: "12 Ags 2026" }
const splitDateTime = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { time: '-', date: '-' }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  return {
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
  }
}

// Lama mahasiswa berada di halaman detail lowongan, dalam satuan detik.
const formatDuration = (ms?: number | null) => {
  if (ms == null || ms <= 0) return null
  return `${Math.round(ms / 1000)} detik`
}

const LogAktifitasPengguna = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('mahasiswa')
  const [searchQuery, setSearchQuery] = useState('')

  const [logs, setLogs] = useState<AdminActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // State untuk Filter Value
  const [filterActivity, setFilterActivity] = useState('all')

  // State untuk Buka/Tutup Custom Dropdown
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const activityDropdownRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning'} | null>(null)

  const filterOptions = activityLogFilterOptions

  // Ambil log dari backend setiap pindah tab
  useEffect(() => {
    setCurrentPage(1)
    setFilterActivity('all')
    setSearchQuery('')
    setIsActivityOpen(false)

    let cancelled = false
    setIsLoading(true)
    adminAnalyticsApi
      .activityLogs({ group: TAB_GROUP[activeTab], limit: 100 })
      .then(({ logs: list }) => { if (!cancelled) { setLogs(list); setLoadError('') } })
      .catch(() => { if (!cancelled) setLoadError('Gagal memuat log aktivitas.') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [activeTab])

  // Reset page ke 1 jika filter atau pencarian diubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterActivity])

  // Deteksi klik di luar dropdown untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activityDropdownRef.current && !activityDropdownRef.current.contains(event.target as Node)) {
        setIsActivityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper Warna & Render Badge Aktivitas (Fix Width & Center)
  const renderActivityBadge = (activity: string, tab: string) => {
    const act = activity.toLowerCase()
    let theme = 'bg-[#f8faff] text-[#7b8191] border border-[#e4e9f4]' // Gray Default
    let Icon = null

    // Theme logic
    if (act.includes('apply') || act.includes('verifikasi') || act.includes('post')) {
      theme = 'bg-[#eef4ff] text-[#0f5ce0] border border-[#d0e0ff]'
    } else if (act.includes('save') || act.includes('tambah') || act.includes('undang')) {
      theme = 'bg-[#fffbeb] text-[#f59e0b] border border-[#fde68a]'
    }

    // Icon logic (Hanya di tab mahasiswa berdasarkan desain)
    if (tab === 'mahasiswa') {
      if (act.includes('apply')) Icon = <Play size={13} fill="currentColor" />
      if (act.includes('save')) Icon = <Bookmark size={13} />
      if (act.includes('view')) Icon = <Eye size={13} />
    }

    return (
      <div className="flex justify-center">
        <span className={`inline-flex items-center justify-center gap-1.5 min-w-[140px] px-3 py-1.5 rounded-full text-[12px] font-bold ${theme}`}>
          {Icon}
          {activity}
        </span>
      </div>
    )
  }

  // Logic Filtering Utama (client-side di atas data yang sudah diambil)
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return logs.filter(log =>
      ((log.actorName ?? '').toLowerCase().includes(query) ||
        (log.orgName ?? '').toLowerCase().includes(query) ||
        (log.detail ?? '').toLowerCase().includes(query) ||
        (log.subDetail ?? '').toLowerCase().includes(query)) &&
      (filterActivity === 'all' || log.activity === filterActivity)
    )
  }, [logs, searchQuery, filterActivity])

  // Paginasi
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getPaginationGroup = () => {
    if (totalPages <= 0) return [1]
    const start = currentPage
    const end = Math.min(currentPage + 1, totalPages)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  // Notifikasi
  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Function Reset Filter
  const handleResetFilter = () => {
    setFilterActivity('all')
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Export CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      showNotification('Tidak ada data yang bisa diekspor berdasarkan filter saat ini.', 'warning')
      return
    }

    const headers = ['Waktu', 'Tanggal', 'Nama', activeTab === 'perusahaan' ? 'Perusahaan' : 'Universitas', 'Aktivitas', 'Detail', 'Sub Detail']
    const csvRows = filteredData.map(log => {
      const dt = splitDateTime(log.time)
      return [dt.time, dt.date, log.actorName ?? '-', log.orgName ?? '-', log.activity, log.detail ?? '-', log.subDetail ?? '-']
    })

    const csvContent = [headers.join(','), ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Log_Aktivitas_${activeTab}_${new Date().toISOString().slice(0,10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification(`File CSV ${activeTab} berhasil diunduh.`, 'success')
  }

  const activeFilterLabel = filterOptions[activeTab].find(opt => opt.value === filterActivity)?.label || 'Semua Aktivitas'

  return (
    <div className="w-full pb-10 animate-in fade-in duration-300">

      <Toast notification={notification} onClose={() => setNotification(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Log Aktivitas Pengguna</h1>
          <p className="text-[14px] text-[#5b6170] mt-1">Pantau dan ekspor riwayat aktivitas mahasiswa, universitas, dan perusahaan.</p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#052960] rounded-xl text-[13px] font-bold text-white hover:bg-[#031635] transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto justify-center"
        >
          <FileText size={16} strokeWidth={2.5} />
          Ekspor ke CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e4e9f4] mb-6 overflow-x-auto hide-scrollbar relative z-0">
        <button onClick={() => setActiveTab('mahasiswa')} className={`flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold border-b-[3px] whitespace-nowrap transition-colors ${activeTab === 'mahasiswa' ? 'border-[#0f5ce0] text-[#0f5ce0]' : 'border-transparent text-[#7b8191] hover:text-[#111827]'}`}>
          <User size={18} strokeWidth={2.5} /> Aktivitas Mahasiswa
        </button>
        <button onClick={() => setActiveTab('universitas')} className={`flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold border-b-[3px] whitespace-nowrap transition-colors ${activeTab === 'universitas' ? 'border-[#0f5ce0] text-[#0f5ce0]' : 'border-transparent text-[#7b8191] hover:text-[#111827]'}`}>
          <GraduationCap size={18} strokeWidth={2.5} /> Admin Universitas
        </button>
        <button onClick={() => setActiveTab('perusahaan')} className={`flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold border-b-[3px] whitespace-nowrap transition-colors ${activeTab === 'perusahaan' ? 'border-[#0f5ce0] text-[#0f5ce0]' : 'border-transparent text-[#7b8191] hover:text-[#111827]'}`}>
          <Building2 size={18} strokeWidth={2.5} /> Admin Perusahaan
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-visible">

        {/* Filter & Search Bar */}
        <div className="p-5 border-b border-[#e4e9f4] flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-t-[16px]">

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

            {/* Custom Dropdown Filter Aktivitas */}
            <div className="relative w-full sm:w-[220px]" ref={activityDropdownRef}>
              <button
                type="button"
                onClick={() => setIsActivityOpen(!isActivityOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-semibold text-[#111827] hover:bg-gray-50 focus:outline-none transition-all shadow-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter size={16} className={filterActivity !== 'all' ? 'text-[#0f5ce0]' : 'text-[#a0a6b5]'} />
                  <span className="truncate">{activeFilterLabel}</span>
                </div>
                <ChevronDown size={16} className={`text-[#a0a6b5] transition-transform ${isActivityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isActivityOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#e4e9f4] rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                  {filterOptions[activeTab].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFilterActivity(opt.value)
                        setIsActivityOpen(false)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                        filterActivity === opt.value
                          ? 'bg-[#eef4ff] text-[#0f5ce0] font-bold'
                          : 'text-[#5b6170] hover:bg-[#f8faff] hover:text-[#111827] font-medium'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tombol Reset Filter */}
            {(filterActivity !== 'all' || searchQuery !== '') && (
              <button
                onClick={handleResetFilter}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#7b8191] hover:text-[#111827] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-transparent w-full sm:w-auto justify-center"
              >
                <RotateCcw size={16} strokeWidth={2.5} /> Reset
              </button>
            )}

          </div>

          <div className="relative w-full md:w-[350px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau aktivitas..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm placeholder:text-[#a0a6b5]"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#7b8191]">
              <p className="text-[15px] font-bold text-[#5b6170]">Memuat log aktivitas...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#ef4444]">
              <p className="text-[15px] font-bold">{loadError}</p>
            </div>
          ) : paginatedData.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] tracking-widest uppercase">
                  {/* Kolom Mahasiswa */}
                  {activeTab === 'mahasiswa' && (
                    <>
                      <th className="px-6 py-4 w-[15%]">Waktu & Tanggal</th>
                      <th className="px-6 py-4 w-[25%]">Nama Mahasiswa</th>
                      <th className="px-6 py-4 w-[15%] text-center">Aktivitas</th>
                      <th className="px-6 py-4 w-[12%] text-center">Durasi</th>
                      <th className="px-6 py-4 w-[33%]">Detail Aktivitas</th>
                    </>
                  )}
                  {/* Kolom Universitas */}
                  {activeTab === 'universitas' && (
                    <>
                      <th className="px-6 py-4 w-[15%]">Waktu & Tanggal</th>
                      <th className="px-6 py-4 w-[25%]">Nama Admin</th>
                      <th className="px-6 py-4 w-[20%]">Universitas</th>
                      <th className="px-6 py-4 w-[15%] text-center">Aktivitas</th>
                      <th className="px-6 py-4 w-[25%]">Detail Aktivitas</th>
                    </>
                  )}
                  {/* Kolom Perusahaan */}
                  {activeTab === 'perusahaan' && (
                    <>
                      <th className="px-6 py-4 w-[15%]">Waktu & Tanggal</th>
                      <th className="px-6 py-4 w-[25%]">Nama Admin</th>
                      <th className="px-6 py-4 w-[25%]">Perusahaan</th>
                      <th className="px-6 py-4 w-[15%] text-center">Aktivitas</th>
                      <th className="px-6 py-4 w-[20%]">Detail Aktivitas</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f9]">

                {/* --- MAHASISWA --- */}
                {activeTab === 'mahasiswa' && paginatedData.map((log) => {
                  const dt = splitDateTime(log.time)
                  const duration = formatDuration(log.durationMs)
                  return (
                    <tr key={log.id} className="hover:bg-[#fafbfe] transition-colors group">
                      <td className="px-6 py-5">
                        <p className="text-[13px] text-[#111827] font-bold leading-tight">{dt.time}</p>
                        <p className="text-[12px] text-[#7b8191] mt-0.5">{dt.date}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[10px] bg-[#f8faff] text-[#0f5ce0] flex items-center justify-center font-black text-[13px] shrink-0 border border-[#e4e9f4]">
                            {getInitialsOf(log.actorName)}
                          </div>
                          <span className="text-[14px] font-bold text-[#111827] group-hover:text-[#0f5ce0] transition-colors">{log.actorName ?? '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {renderActivityBadge(log.activity, activeTab)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {duration ? (
                          <span className="text-[13px] font-bold text-[#111827]">{duration}</span>
                        ) : (
                          <span className="text-[13px] text-[#a0a6b5]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[14px] font-bold text-[#111827] line-clamp-1">{log.detail ?? '-'}</p>
                          <p className="text-[12px] text-[#7b8191] mt-1 flex items-center gap-1.5 font-medium">
                            <Building2 size={13} className="shrink-0 text-[#a0a6b5]" /> {log.subDetail ?? '-'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {/* --- UNIVERSITAS --- */}
                {activeTab === 'universitas' && paginatedData.map((log) => {
                  const dt = splitDateTime(log.time)
                  return (
                    <tr key={log.id} className="hover:bg-[#fafbfe] transition-colors group">
                      <td className="px-6 py-5">
                        <p className="text-[13px] font-bold text-[#111827] leading-tight">{dt.time}</p>
                        <p className="text-[12px] text-[#7b8191] mt-0.5">{dt.date}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-[10px] bg-[#f8faff] text-[#0f5ce0] flex items-center justify-center font-black text-[13px] shrink-0 border border-[#e4e9f4]">
                             {getInitialsOf(log.actorName ?? log.orgName)}
                           </div>
                          <span className="text-[14px] font-bold text-[#111827] group-hover:text-[#0f5ce0] transition-colors">{log.actorName ?? 'Sistem Kampus'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[13.5px] text-[#5b6170] font-medium">
                        {log.orgName ?? '-'}
                      </td>
                      <td className="px-6 py-5">
                        {renderActivityBadge(log.activity, activeTab)}
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[14px] font-bold text-[#111827] leading-tight line-clamp-1">{log.detail ?? '-'}</p>
                          <p className="text-[12px] text-[#7b8191] mt-1 flex items-center gap-1.5 font-medium">
                            <FileText size={13} className="shrink-0 text-[#a0a6b5]" /> {log.subDetail ?? '-'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {/* --- PERUSAHAAN --- */}
                {activeTab === 'perusahaan' && paginatedData.map((log) => {
                  const dt = splitDateTime(log.time)
                  return (
                    <tr key={log.id} className="hover:bg-[#fafbfe] transition-colors group">
                      <td className="px-6 py-5">
                        <p className="text-[13px] font-bold text-[#111827] leading-tight">{dt.time}</p>
                        <p className="text-[12px] text-[#7b8191] mt-0.5">{dt.date}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-[10px] bg-[#f8faff] text-[#0f5ce0] flex items-center justify-center font-black text-[13px] shrink-0 border border-[#e4e9f4]">
                             {getInitialsOf(log.actorName ?? log.orgName)}
                           </div>
                          <span className="text-[14px] font-bold text-[#111827] group-hover:text-[#0f5ce0] transition-colors">{log.actorName ?? '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[13.5px] text-[#5b6170] font-medium">
                        {log.orgName ?? '-'}
                      </td>
                      <td className="px-6 py-5">
                         {renderActivityBadge(log.activity, activeTab)}
                      </td>
                      <td className="px-6 py-5 text-[14px] font-bold text-[#111827] line-clamp-2">
                        {log.detail ?? '-'}
                      </td>
                    </tr>
                  )
                })}

              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-[#7b8191]">
              <Search size={48} className="mb-4 text-[#e4e9f4]" />
              <p className="text-[15px] font-bold text-[#5b6170]">Tidak ada data yang cocok</p>
              <p className="text-[13px] mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>

        {/* Paginasi Footer */}
        {!isLoading && !loadError && filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white gap-4 rounded-b-[16px]">
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left">
              Menampilkan <span className="font-bold text-[#111827]">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="font-bold text-[#111827]">{filteredData.length}</span> data
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:hover:text-[#a0a6b5] transition-colors mr-2 px-2 py-1"
              >
                Sebelumnya
              </button>

              {getPaginationGroup().map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold text-[13px] flex items-center justify-center transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#0f5ce0] text-white shadow-sm'
                      : 'text-[#5b6170] hover:bg-[#f8faff] border border-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:hover:text-[#a0a6b5] transition-colors ml-2 px-2 py-1"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogAktifitasPengguna
