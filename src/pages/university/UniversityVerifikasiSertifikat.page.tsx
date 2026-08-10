import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ClipboardList, CheckCircle2, XCircle, Download, Search, Loader2, AlertTriangle } from 'lucide-react'
import { certificateApi } from '../../services/university.service'

type DisplayStatus = 'Pending' | 'Verified' | 'Rejected'

// Status backend -> status tampilan. Beberapa nilai diterima agar tetap cocok
// bila konstanta di backend memakai "approved" atau "verified".
const STATUS_MAP: Record<string, DisplayStatus> = {
  pending: 'Pending',
  approved: 'Verified',
  verified: 'Verified',
  rejected: 'Rejected',
}

interface CertificateRow {
  id: string
  title: string
  issuer: string
  date: string
  status: DisplayStatus
  studentName: string
  studentNim: string
  studentInitial: string
  studentBgColor: string
}

const AVATAR_COLORS = [
  'bg-[#eef4ff] text-[#0f5ce0]',
  'bg-[#e6f9f0] text-[#10b981]',
  'bg-[#fffbeb] text-[#f59e0b]',
  'bg-[#f4f3ff] text-[#6366f1]',
  'bg-[#fee2e2] text-[#ef4444]',
  'bg-[#ecfeff] text-[#06b6d4]',
]
const colorFromName = (name: string) => {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}
const initialFromName = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

const formatDate = (raw?: string | null): string => {
  if (!raw) return '-'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const UniversityVerifikasiSertifikat = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [certificates, setCertificates] = useState<CertificateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [activeTab, setActiveTab] = useState<'Semua Status' | DisplayStatus>('Semua Status')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      // Seluruh status diambil sekali agar hitungan tiap tab langsung tersedia.
      const rows = await certificateApi.list()
      setCertificates(
        (rows ?? []).map((c: any) => {
          const name = c?.student?.user?.name ?? 'Tanpa Nama'
          return {
            id: c.id,
            title: c.title ?? '-',
            issuer: c.issuer ?? '-',
            date: formatDate(c.created_at ?? c.createdAt),
            status: STATUS_MAP[String(c.status ?? '').toLowerCase()] ?? 'Pending',
            studentName: name,
            studentNim: c?.student?.nim ?? '-',
            studentInitial: initialFromName(name),
            studentBgColor: colorFromName(name),
          }
        }),
      )
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat data sertifikat. Pastikan server berjalan.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Dimuat ulang saat kembali dari halaman detail, agar status terbaru ikut terbawa.
  useEffect(() => {
    loadData()
  }, [loadData, location.key])

  const stats = useMemo(() => ({
    pending: certificates.filter(c => c.status === 'Pending').length,
    verified: certificates.filter(c => c.status === 'Verified').length,
    rejected: certificates.filter(c => c.status === 'Rejected').length,
  }), [certificates])

  const filteredCertificates = useMemo(() => {
    let filtered = certificates
    if (activeTab !== 'Semua Status') {
      filtered = filtered.filter(c => c.status === activeTab)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.studentName.toLowerCase().includes(query) || 
        c.studentNim.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.issuer.toLowerCase().includes(query)
      )
    }
    return filtered
  }, [certificates, activeTab, searchQuery])

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE) || 1
  const startIndex = filteredCertificates.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredCertificates.length)
  
  const displayedCertificates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCertificates.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredCertificates, currentPage])

  const getPaginationGroup = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

  const handleExportCSV = () => {
    if (filteredCertificates.length === 0) return
    const headers = ['Nama Mahasiswa', 'NIM', 'Nama Sertifikat', 'Penerbit', 'Tanggal', 'Status']
    const csvData = filteredCertificates.map(c => [
      `"${c.studentName}"`, `"${c.studentNim}"`, `"${c.title}"`, `"${c.issuer}"`, `"${c.date}"`, `"${c.status}"`
    ])
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Data_Sertifikat.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-[#f1f4f9] text-[#5b6170] text-[11px] font-bold rounded-full w-[100px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a0a6b5]"></span> Pending
          </span>
        )
      case 'Verified':
        return (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-[#e6f9f0] text-[#10b981] text-[11px] font-bold rounded-full w-[100px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> Verified
          </span>
        )
      case 'Rejected':
        return (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-[#fef2f2] text-red-500 text-[11px] font-bold rounded-full w-[100px]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Rejected
          </span>
        )
      default:
        return null
    }
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat data sertifikat...</p>
      </div>
    )
  }

  // ---------- Error ----------
  if (loadError && certificates.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl max-w-md">
          <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
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
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">
      
      {/* header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">Verifikasi Sertifikat</h1>
        <p className="text-[14px] text-[#5b6170] mt-1.5 max-w-3xl leading-relaxed">
          Kelola dan validasi sertifikat kompetensi yang diunggah oleh mahasiswa untuk memastikan standar kualitas akademik dan profesional.
        </p>
      </div>

      {/* card statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center border border-[#d0e0ff]">
            <ClipboardList size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#7b8191]">Antrian Verifikasi</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1.5">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#e6f9f0] text-[#10b981] flex items-center justify-center border border-[#d1f4e0]">
            <CheckCircle2 size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#7b8191]">Total Terverifikasi</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1.5">{stats.verified}</p>
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#fef2f2] text-red-500 flex items-center justify-center border border-[#fee2e2]">
            <XCircle size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#7b8191]">Total Ditolak</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1.5">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* wadah tabel */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden mt-2">
        
        {/* toolbar filter dan aksi */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-[#e4e9f4]">
          <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
            {(['Semua Status', 'Pending', 'Verified', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`relative pb-2 text-[13px] font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'text-[#0f5ce0]' : 'text-[#7b8191] hover:text-[#111827]'
                }`}
              >
                {tab === 'Semua Status' ? 'Semua Status' : tab === 'Pending' ? 'Menunggu' : tab === 'Verified' ? 'Terverifikasi' : 'Ditolak'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f5ce0] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" size={14} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari Nama / NIM..."
                className="w-full pl-9 pr-4 py-2 border border-[#e4e9f4] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>
            <button 
              onClick={handleExportCSV}
              disabled={filteredCertificates.length === 0}
              className="flex items-center justify-center px-3 py-2 border border-[#e4e9f4] bg-white text-[#5b6170] rounded-lg hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
              title="Unduh Data CSV"
            >
              <Download size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-widest">
                <th className="px-6 py-4 whitespace-nowrap w-[25%]">Mahasiswa</th>
                <th className="px-6 py-4 whitespace-nowrap w-[25%]">Nama Sertifikat</th>
                <th className="px-6 py-4 whitespace-nowrap w-[15%]">Institusi Penerbit</th>
                <th className="px-6 py-4 whitespace-nowrap w-[15%]">Tanggal Unggah</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-[10%]">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-[10%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {displayedCertificates.length > 0 ? (
                displayedCertificates.map(cert => (
                  <tr key={cert.id} className="hover:bg-[#fafbfe] transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${cert.studentBgColor} flex items-center justify-center font-bold text-[13px] shrink-0`}>
                          {cert.studentInitial}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#111827]">{cert.studentName}</p>
                          <p className="text-[11px] font-semibold text-[#7b8191]">NIM: {cert.studentNim}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal">
                      <p className="text-[13px] font-bold text-[#111827] leading-relaxed">{cert.title}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-[13px] text-[#5b6170] font-medium">{cert.issuer}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-[13px] text-[#5b6170] font-medium">{cert.date}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(cert.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => navigate(`/university/detail-sertifikat/${cert.id}`)}
                        className="inline-flex items-center justify-center px-5 py-2 border border-[#0f5ce0] text-[#0f5ce0] text-[12px] font-bold rounded-lg hover:bg-[#f4f7ff] transition active:scale-95"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-[#a0a6b5] font-medium">
                    {certificates.length === 0
                      ? 'Belum ada sertifikat yang diunggah mahasiswa.'
                      : 'Tidak ada sertifikat yang ditemukan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* paginasi */}
        {filteredCertificates.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm rounded-b-[16px] gap-4">
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left w-full sm:w-auto">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex}-{endIndex}</span> dari <span className="text-[#111827] font-bold">{filteredCertificates.length}</span> data
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`font-semibold transition-colors mr-2 ${currentPage === 1 ? 'text-[#a0a6b5] cursor-not-allowed' : 'text-[#7b8191] hover:text-[#0f5ce0]'}`}>
                Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {getPaginationGroup().map((item, idx) => (
                  <button key={idx} onClick={() => typeof item === 'number' && setCurrentPage(item)} disabled={item === '...'} className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${item === currentPage ? 'bg-[#0f5ce0] text-white shadow-sm' : item === '...' ? 'cursor-default text-[#a0a6b5]' : 'text-[#5b6170] hover:bg-gray-100 border border-transparent'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`font-semibold transition-colors ml-2 ${currentPage === totalPages ? 'text-[#a0a6b5] cursor-not-allowed' : 'text-[#0f5ce0] hover:text-[#0d4ebf]'}`}>
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UniversityVerifikasiSertifikat