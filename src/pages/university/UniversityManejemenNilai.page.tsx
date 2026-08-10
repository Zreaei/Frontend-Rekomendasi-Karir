import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, BookOpen, CheckCircle2, ClipboardList, RotateCcw, Loader2, AlertTriangle } from 'lucide-react'
import { universityDashboardApi, type CourseProgress } from '../../services/university.service'

type GradingStatus = 'COMPLETED' | 'IN PROGRESS' | 'WAITING REVIEW'

// Status progres dari backend -> label pada halaman ini.
const STATUS_LABEL: Record<string, GradingStatus> = {
  Selesai: 'COMPLETED',
  Sebagian: 'IN PROGRESS',
  Belum: 'WAITING REVIEW',
}

interface SubjectRow extends CourseProgress {
  gradingStatus: GradingStatus
}

const UniversityManajemenNilai = () => {
  const navigate = useNavigate()

  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Progres penilaian sudah dihitung backend, jadi cukup satu permintaan.
  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const { courses } = await universityDashboardApi.get()
      setSubjects(
        (courses ?? []).map((c) => ({
          ...c,
          gradingStatus: STATUS_LABEL[c.status] ?? 'WAITING REVIEW',
        })),
      )
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat data mata kuliah. Pastikan server berjalan.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const [searchQuery, setSearchQuery] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('Semua Semester')
  const [statusFilter, setStatusFilter] = useState('Semua Status')
  
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const availableSemesters = useMemo(
    () => Array.from(new Set(subjects.map(s => s.semester))).filter((s): s is number => !!s).sort((a, b) => a - b),
    [subjects],
  )

  const availableStatuses = useMemo(
    () => Array.from(new Set(subjects.map(s => s.gradingStatus))).sort(),
    [subjects],
  )

  const dynamicStats = useMemo(() => {
    const total = subjects.length
    if (total === 0) return { activeCourses: 0, completionRate: '0%', needsVerification: 0 }
    const completedCount = subjects.filter(s => s.gradingStatus === 'COMPLETED').length
    const reviewCount = subjects.filter(s => s.gradingStatus === 'WAITING REVIEW').length
    return {
      activeCourses: total,
      completionRate: `${Math.round((completedCount / total) * 100)}%`,
      needsVerification: reviewCount,
    }
  }, [subjects])

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchSemester = semesterFilter === 'Semua Semester' || String(subject.semester ?? '') === semesterFilter
      const matchStatus = statusFilter === 'Semua Status' || subject.gradingStatus === statusFilter
      
      const searchLower = searchQuery.toLowerCase()
      const matchSearch = subject.name.toLowerCase().includes(searchLower) || subject.code.toLowerCase().includes(searchLower)
      
      return matchSemester && matchStatus && matchSearch
    })
  }, [subjects, semesterFilter, statusFilter, searchQuery])

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE) || 1
  const startIndex = filteredSubjects.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)
  
  const displayedSubjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredSubjects.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredSubjects, currentPage])

  const getPaginationGroup = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSemesterFilter('Semua Semester')
    setStatusFilter('Semua Status')
    setCurrentPage(1)
  }

  const isFilterActive = searchQuery !== '' || semesterFilter !== 'Semua Semester' || statusFilter !== 'Semua Status'

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'IN PROGRESS':
        return 'text-[#0f5ce0] bg-[#eef4ff]'
      case 'COMPLETED':
        return 'text-[#10b981] bg-[#e6f9f0]'
      case 'WAITING REVIEW':
        return 'text-[#f59e0b] bg-[#fffbeb]'
      default:
        return 'text-[#7b8191] bg-[#f8faff]'
    }
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat daftar mata kuliah...</p>
      </div>
    )
  }

  // ---------- Error ----------
  if (loadError && subjects.length === 0) {
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
      <div>
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">Manajemen Nilai</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#f4f7ff] text-[#0f5ce0] flex items-center justify-center border border-[#eef2ff]">
            <BookOpen size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#a0a6b5] uppercase tracking-widest">Mata Kuliah Aktif</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1">{dynamicStats.activeCourses}</p>
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#10b981] flex items-center justify-center border border-[#e6f9f0]">
            <CheckCircle2 size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#a0a6b5] uppercase tracking-widest">Penilaian Selesai</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1">{dynamicStats.completionRate}</p>
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-red-500 flex items-center justify-center border border-[#fee2e2]">
            <ClipboardList size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#a0a6b5] uppercase tracking-widest">Perlu Verifikasi</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1">{dynamicStats.needsVerification}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 border-b border-[#e4e9f4]">
          <h2 className="text-[16px] font-bold text-[#111827] whitespace-nowrap">Daftar Mata Kuliah</h2>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" size={14} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari Mata Kuliah"
                className="w-full pl-9 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>
            <div className="relative">
              <select 
                value={semesterFilter}
                onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 pr-9 border border-[#e4e9f4] rounded-lg text-[13px] text-[#5b6170] font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[140px]"
              >
                <option value="Semua Semester">Semua Semester</option>
                {availableSemesters.map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 pr-9 border border-[#e4e9f4] rounded-lg text-[13px] text-[#5b6170] font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[140px]"
              >
                <option value="Semua Status">Semua Status</option>
                {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
            {isFilterActive && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw size={14} strokeWidth={2.5} /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-widest">
                <th className="px-6 py-5 whitespace-nowrap">Kode</th>
                <th className="px-6 py-5 whitespace-nowrap">Nama Mata Kuliah</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">SKS</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Jumlah CLO</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Semester</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Dinilai</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e9f4]">
              {displayedSubjects.length > 0 ? (
                displayedSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-[#fafbfe] transition group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-[13px] font-black text-[#0f5ce0] tracking-wide">{subject.code}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-[13px] font-bold text-[#111827]">{subject.name}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-bold text-[#5b6170]">{subject.sks}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-bold text-[#5b6170]">{subject.cloCount}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-bold text-[#5b6170]">{subject.semester ?? '-'}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-bold text-[#111827]">
                        {subject.gradedStudents}
                        <span className="text-[#7b8191] font-medium"> / {subject.totalStudents}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center justify-center w-[130px] px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${getStatusStyle(subject.gradingStatus)}`}>
                        {subject.gradingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <button 
                        onClick={() => navigate(`/university/kelola-nilai/${subject.id}`)}
                        className="px-5 py-2 bg-[#0f5ce0] text-white text-[12px] font-bold rounded-lg hover:bg-[#0d4ebf] transition-all shadow-sm active:scale-95"
                      >
                        Kelola Nilai
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-[#a0a6b5] font-medium">
                    {subjects.length === 0
                      ? 'Belum ada mata kuliah. Tambahkan lewat Manajemen CLO & Matakuliah.'
                      : 'Tidak ada mata kuliah yang sesuai dengan filter atau pencarian.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredSubjects.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm rounded-b-[16px] gap-4">
            
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left w-full sm:w-auto">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex}-{endIndex}</span> dari <span className="text-[#111827] font-bold">{filteredSubjects.length}</span> matakuliah
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1} 
                className={`font-semibold transition-colors mr-2 ${currentPage === 1 ? 'text-[#a0a6b5] cursor-not-allowed' : 'text-[#7b8191] hover:text-[#0f5ce0]'}`}
              >
                Sebelumnya
              </button>
              
              <div className="flex items-center gap-1">
                {getPaginationGroup().map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => typeof item === 'number' && setCurrentPage(item)} 
                    disabled={item === '...'}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                      item === currentPage 
                        ? 'bg-[#0f5ce0] text-white shadow-sm' 
                        : item === '...' ? 'cursor-default text-[#a0a6b5]' : 'text-[#5b6170] hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className={`font-semibold transition-colors ml-2 ${currentPage === totalPages ? 'text-[#a0a6b5] cursor-not-allowed' : 'text-[#0f5ce0] hover:text-[#0d4ebf]'}`}
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

export default UniversityManajemenNilai