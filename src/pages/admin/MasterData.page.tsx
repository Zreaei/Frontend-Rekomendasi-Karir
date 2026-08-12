import { useState, useMemo, useEffect } from 'react'
import { Search, Download, BookOpen, Briefcase } from 'lucide-react'
import { adminAnalyticsApi, getInitialsOf, formatDateID } from '../../services/admin.service'
import type { MasterCourseRow, MasterIndustryRow } from '../../services/admin.service'
import Toast from './components/Toast'

const masterDataTabOptions = [
  { label: 'Mata Kuliah', value: 'course' },
  { label: 'Kebutuhan Industri', value: 'industry' },
]

const AdminMasterData = () => {
  const [activeTab, setActiveTab] = useState<'course' | 'industry'>('course')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [courses, setCourses] = useState<MasterCourseRow[]>([])
  const [industries, setIndustries] = useState<MasterIndustryRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'warning' } | null>(null)

  // Ambil kedua dataset sekali di awal
  useEffect(() => {
    let cancelled = false
    Promise.all([
      adminAnalyticsApi.masterCourses({ limit: 100 }),
      adminAnalyticsApi.masterIndustries({ limit: 100 }),
    ])
      .then(([c, i]) => {
        if (cancelled) return
        setCourses(c.courses)
        setIndustries(i.industries)
      })
      .catch(() => { if (!cancelled) setLoadError('Gagal memuat master data.') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Reset pagination saat pindah tab atau search
  useEffect(() => {
    setCurrentPage(1)
    setSearchQuery('')
  }, [activeTab])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Logic Filtering
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase()

    if (activeTab === 'course') {
      return courses.filter(course =>
        course.courseName.toLowerCase().includes(query) ||
        (course.universityName ?? '').toLowerCase().includes(query)
      )
    }
    return industries.filter(industry =>
      industry.companyName.toLowerCase().includes(query) ||
      industry.position.toLowerCase().includes(query)
    )
  }, [activeTab, searchQuery, courses, industries])

  // Pagination
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

  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setNotification(null), 4000)
  }

  // Export CSV Logic
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      showNotification('Tidak ada data yang bisa diekspor.', 'warning')
      return
    }

    // Teks CLO dan tanggung jawab sering memuat baris baru (mis. salinan RPS).
    // Diratakan jadi satu baris supaya satu record CSV = satu baris berkas.
    const satuBaris = (teks: string) => String(teks ?? '').replace(/\s+/g, ' ').trim()

    let headers: string[] = []
    let csvRows: string[][] = []

    if (activeTab === 'course') {
      headers = ['Nama Mata Kuliah', 'Kode', 'SKS', 'Universitas', 'Jumlah CLO', 'Rincian CLO', 'Skill', 'Terakhir Diperbarui']
      // Satu baris per CLO: kolom identitas mata kuliah diulang, sementara
      // rincian CLO dan skill berbeda di tiap baris.
      csvRows = (filteredData as MasterCourseRow[]).flatMap(c => {
        const identitas = [
          c.courseName,
          c.courseCode ?? '-',
          c.sks != null ? String(c.sks) : '-',
          c.universityName ?? '-',
          String(c.cloCount),
        ]
        if (c.clos.length === 0) {
          return [[...identitas, '-', '-', formatDateID(c.updatedAt)]]
        }
        return c.clos.map(clo => [
          ...identitas,
          satuBaris(`${clo.name}: ${clo.text}`),
          clo.skills.length > 0 ? clo.skills.join(' | ') : '-',
          formatDateID(c.updatedAt),
        ])
      })
    } else {
      headers = ['Nama Perusahaan', 'Industri', 'Posisi Pekerjaan', 'Tanggung Jawab', 'Skill', 'Terakhir Diperbarui']
      // Satu baris per tanggung jawab, skill dipisah delimiter "|".
      csvRows = (filteredData as MasterIndustryRow[]).flatMap(i => {
        const identitas = [i.companyName, i.industry ?? '-', i.position]
        if (i.responsibilities.length === 0) {
          return [[...identitas, '-', '-', formatDateID(i.updatedAt)]]
        }
        return i.responsibilities.map(r => [
          ...identitas,
          satuBaris(r.requirement),
          r.skills.length > 0 ? r.skills.join(' | ') : '-',
          formatDateID(i.updatedAt),
        ])
      })
    }

    // Tanda kutip di dalam sel digandakan sesuai aturan CSV.
    const escapeCell = (cell: string) => `"${String(cell ?? '').replace(/"/g, '""')}"`
    const csvContent = [headers.join(','), ...csvRows.map(row => row.map(escapeCell).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Master_Data_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification('File CSV berhasil diunduh.', 'success')
  }

  return (
    <div className="w-full pb-10 animate-in fade-in duration-300">

      <Toast notification={notification} onClose={() => setNotification(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="max-w-2xl">
          <h1 className="text-[24px] font-bold text-[#111827]">Master Data</h1>
          <p className="text-[14px] text-[#5b6170] mt-1 leading-relaxed">
            Repositori data referensi capaian pembelajaran (CLO) dan kualifikasi industri. Ekspor dataset ini untuk kebutuhan analisis gap kompetensi, riset, atau integrasi sistem eksternal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#052960] rounded-xl text-[13px] font-bold text-white hover:bg-[#031635] transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto justify-center shrink-0"
        >
          <Download size={16} strokeWidth={2.5} />
          Ekspor ke CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[12px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-2">Total Mata Kuliah</p>
            <p className="text-[32px] font-black text-[#111827]">{courses.length}</p>
          </div>
          <div className="w-12 h-12 rounded-[12px] bg-[#f4f7ff] text-[#0f5ce0] border border-[#eef2ff] flex items-center justify-center"><BookOpen size={24} strokeWidth={2} /></div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[12px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-2">Total Kebutuhan Industri</p>
            <p className="text-[32px] font-black text-[#111827]">{industries.length}</p>
          </div>
          <div className="w-12 h-12 rounded-[12px] bg-[#f4f7ff] text-[#0f5ce0] border border-[#eef2ff] flex items-center justify-center"><Briefcase size={24} strokeWidth={2} /></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e4e9f4] mb-6 overflow-x-auto hide-scrollbar">
        {masterDataTabOptions.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as 'course' | 'industry')}
            className={`px-6 py-3.5 text-[14px] font-bold border-b-[3px] whitespace-nowrap transition-colors ${activeTab === tab.value ? 'border-[#0f5ce0] text-[#0f5ce0]' : 'border-transparent text-[#7b8191] hover:text-[#111827]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-visible">

        {/* Search Bar */}
        <div className="p-5 border-b border-[#e4e9f4] bg-white rounded-t-[16px]">
          <div className="relative w-full sm:w-[380px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'course' ? 'Cari nama mata kuliah atau universitas...' : 'Cari nama perusahaan atau posisi pekerjaan...'}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm placeholder:text-[#a0a6b5]"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#7b8191]">
              <p className="text-[15px] font-bold text-[#5b6170]">Memuat master data...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#ef4444]">
              <p className="text-[15px] font-bold">{loadError}</p>
            </div>
          ) : paginatedData.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] tracking-widest uppercase">
                  {activeTab === 'course' && (
                    <>
                      <th className="px-6 py-4 w-[30%]">Nama Mata Kuliah</th>
                      <th className="px-6 py-4 w-[20%]">Universitas</th>
                      <th className="px-6 py-4 w-[15%] text-center">Jumlah CLO</th>
                      <th className="px-6 py-4 w-[25%]">Rincian CLO & Skill</th>
                      <th className="px-6 py-4 w-[10%]">Terakhir Diperbarui</th>
                    </>
                  )}
                  {activeTab === 'industry' && (
                    <>
                      <th className="px-6 py-4 w-[20%]">Nama Perusahaan</th>
                      <th className="px-6 py-4 w-[20%]">Posisi Pekerjaan</th>
                      <th className="px-6 py-4 w-[25%]">Tanggung Jawab</th>
                      <th className="px-6 py-4 w-[20%]">Skill</th>
                      <th className="px-6 py-4 w-[15%]">Terakhir Diperbarui</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f9]">

                {activeTab === 'course' && (paginatedData as MasterCourseRow[]).map((course) => (
                  <tr key={course.id} className="hover:bg-[#fafbfe] transition-colors group align-top">
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-bold text-[#0f5ce0] mb-1">{course.courseName}</p>
                      <p className="text-[12px] text-[#7b8191]">
                        {course.courseCode ?? '-'}{course.sks != null ? ` • ${course.sks} SKS` : ''}{course.semester != null ? ` • Semester ${course.semester}` : ''}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-[#111827]">{course.universityName ?? '-'}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="mx-auto w-12 h-12 rounded-[10px] bg-[#eef4ff] text-[#0f5ce0] flex flex-col items-center justify-center font-bold shadow-sm">
                        <span className="text-[15px] leading-none">{course.cloCount}</span>
                        <span className="text-[10px] leading-none mt-1">CLO</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-4">
                        {course.clos.length === 0 && (
                          <span className="text-[12px] text-[#a0a6b5]">Belum ada CLO terdaftar</span>
                        )}
                        {course.clos.map((clo, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5">
                            <p className="text-[12px] font-bold text-[#111827]">{clo.name}</p>
                            {clo.skills.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {clo.skills.map((skill, sIdx) => (
                                  <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#5b6170] border border-[#e4e9f4]">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-[#7b8191] line-clamp-1">{clo.text}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-[#111827] leading-tight">{formatDateID(course.updatedAt)}</p>
                    </td>
                  </tr>
                ))}

                {activeTab === 'industry' && (paginatedData as MasterIndustryRow[]).map((industry) => (
                  <tr key={industry.id} className="hover:bg-[#fafbfe] transition-colors group align-top">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-[10px] bg-white text-[#5b6170] flex items-center justify-center font-black text-[14px] shrink-0 border border-[#e4e9f4] shadow-sm mt-0.5">
                          {getInitialsOf(industry.companyName)}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#111827]">{industry.companyName}</p>
                          <p className="text-[12px] text-[#7b8191] mt-0.5">{industry.industry ?? '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-[#0f5ce0]">
                        {industry.position}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-4">
                        {industry.responsibilities.length === 0 && (
                          <span className="text-[12px] text-[#a0a6b5]">-</span>
                        )}
                        {industry.responsibilities.map((r, rIdx) => (
                          <p key={rIdx} className="text-[13px] text-[#5b6170] leading-relaxed pr-4">
                            {r.requirement}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {/* Sejajar dengan kolom tanggung jawab: satu blok skill per tanggung jawab. */}
                      <div className="flex flex-col gap-4">
                        {industry.responsibilities.length === 0 && (
                          <span className="text-[12px] text-[#a0a6b5]">-</span>
                        )}
                        {industry.responsibilities.map((r, rIdx) => (
                          <div key={rIdx} className="flex flex-wrap gap-1.5">
                            {r.skills.length === 0 ? (
                              <span className="text-[12px] text-[#a0a6b5]">-</span>
                            ) : (
                              r.skills.map((skill, sIdx) => (
                                <span key={sIdx} className="px-2 py-1 rounded bg-[#eef4ff] text-[#0f5ce0] text-[10px] font-bold tracking-wide">
                                  {skill.toUpperCase()}
                                </span>
                              ))
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-[#111827]">
                        {formatDateID(industry.updatedAt)}
                      </p>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-[#7b8191]">
              <Search size={48} className="mb-4 text-[#e4e9f4]" />
              <p className="text-[15px] font-bold text-[#5b6170]">Tidak ada data yang cocok</p>
              <p className="text-[13px] mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
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

export default AdminMasterData
