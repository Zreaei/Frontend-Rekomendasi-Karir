import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users, UserCheck, GraduationCap, Plus, Download, Eye, Edit2, Trash2, Search, CheckCircle2, AlertTriangle, X, ChevronDown, Ban, Loader2, AlertCircle } from 'lucide-react'
import { studentApi } from '../../services/university.service'

// Bentuk data yang dipakai tampilan (sebelumnya dari UniversityData).
interface Student {
  id: string
  nim: string
  name: string
  email: string
  faculty: string
  major: string
  year: string
  gpa: string
  status: 'Active' | 'Inactive' | 'Graduated'
  initial: string
  bgColor: string
}

// Warna avatar konsisten per nama (bukan acak tiap render)
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

// Status akun backend -> status tampilan.
// Catatan: backend belum memiliki penanda kelulusan, sehingga 'Graduated'
// baru akan muncul setelah kolom graduatedAt ditambahkan.
const toDisplayStatus = (s: any): Student['status'] => {
  if (s?.graduatedAt) return 'Graduated'
  if (s?.user?.status === 'suspended') return 'Inactive'
  return 'Active'
}

const UniversityManajemenMahasiswa = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const studentStats = useMemo(() => ({
    total: students.length,
    active: students.filter(s => s.status === 'Active').length,
    graduated: students.filter(s => s.status === 'Graduated').length,
  }), [students])

  const [notification, setNotification] = useState<string | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (location.state?.successMessage) {
      setNotification(location.state.successMessage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState({}, document.title)
      setTimeout(() => setNotification(null), 4000)
    }
  }, [location])

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const rows = await studentApi.list()
      setStudents(
        (rows ?? []).map((s: any) => {
          const name = s?.user?.name ?? 'Tanpa Nama'
          return {
            id: s.id,
            nim: s.nim ?? '-',
            name,
            email: s?.user?.email ?? '-',
            faculty: s.faculty ?? '-',
            major: s.major ?? '-',
            year: s.entryYear ? String(s.entryYear) : '-',
            gpa: s.gpa !== null && s.gpa !== undefined ? String(s.gpa) : '-',
            status: toDisplayStatus(s),
            initial: initialFromName(name),
            bgColor: colorFromName(name),
          }
        }),
      )
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat data mahasiswa. Pastikan server berjalan.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const [facultyFilter, setFacultyFilter] = useState('Semua Fakultas')
  const [majorFilter, setMajorFilter] = useState('Semua Program Studi')
  const [yearFilter, setYearFilter] = useState('Semua Angkatan')
  const [searchQuery, setSearchQuery] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  // Pilihan filter diturunkan dari data yang ada, bukan daftar tetap.
  const availableFaculties = useMemo(
    () => Array.from(new Set(students.map(s => s.faculty))).filter(f => f && f !== '-').sort(),
    [students],
  )
  const availableMajors = useMemo(() => {
    const pool = facultyFilter === 'Semua Fakultas'
      ? students
      : students.filter(s => s.faculty === facultyFilter)
    return Array.from(new Set(pool.map(s => s.major))).filter(m => m && m !== '-').sort()
  }, [students, facultyFilter])
  const uniqueYears = useMemo(
    () => Array.from(new Set(students.map(s => s.year))).filter(y => y && y !== '-').sort().reverse(),
    [students],
  )

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchFaculty = facultyFilter === 'Semua Fakultas' || student.faculty === facultyFilter
      const matchMajor = majorFilter === 'Semua Program Studi' || student.major === majorFilter
      const matchYear = yearFilter === 'Semua Angkatan' || student.year === yearFilter
      const searchLower = searchQuery.toLowerCase()
      const matchSearch = student.name.toLowerCase().includes(searchLower) || student.nim.toLowerCase().includes(searchLower)
      return matchFaculty && matchMajor && matchYear && matchSearch
    })
  }, [students, facultyFilter, majorFilter, yearFilter, searchQuery])

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFacultyFilter(e.target.value)
    setMajorFilter('Semua Program Studi')
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1
  const startIndex = filteredStudents.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)

  const displayedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredStudents.slice(start, end)
  }, [filteredStudents, currentPage])

  const getPaginationGroup = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

  const confirmDelete = async () => {
    if (!studentToDelete) return
    setDeleting(true)
    try {
      await studentApi.remove(studentToDelete)
      await loadStudents()
      setStudentToDelete(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setNotification('Akun mahasiswa berhasil dinonaktifkan.')
      setTimeout(() => setNotification(null), 4000)
    } catch (err: any) {
      setStudentToDelete(null)
      setLoadError(err?.response?.data?.message ?? 'Gagal menghapus data mahasiswa.')
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'Graduated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f3ff] text-[#6366f1] font-bold text-[11px] rounded uppercase">
            <GraduationCap size={12} /> Lulus
          </span>
        )
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f1f4f9] text-[#7b8191] font-bold text-[11px] rounded uppercase">
            <Ban size={12} /> Nonaktif
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f9f0] text-[#10b981] font-bold text-[11px] rounded uppercase">
            <UserCheck size={12} /> Aktif
          </span>
        )
    }
  }

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return
    const headers = ['NIM', 'Nama Mahasiswa', 'Email', 'Fakultas', 'Program Studi', 'Angkatan', 'IPK', 'Status']
    const csvData = filteredStudents.map(s => [
      `"${s.nim}"`, `"${s.name}"`, `"${s.email}"`, `"${s.faculty}"`, `"${s.major}"`, `"${s.year}"`, `"${s.gpa}"`, `"${s.status}"`
    ])
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Data_Mahasiswa.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat data mahasiswa...</p>
      </div>
    )
  }

  // ---------- Error ----------
  if (loadError && students.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl max-w-md">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Gagal memuat data</p>
            <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
          </div>
        </div>
        <button onClick={loadStudents} className="px-6 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] transition">
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative">
      {notification && (
        <div className="fixed top-8 right-8 z-[100] flex items-start gap-4 p-4 bg-white border border-[#10b981]/40 border-l-4 border-l-[#10b981] rounded-xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-10 fade-in duration-500 ease-out overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-[#e6f9f0] flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} className="text-[#10b981]" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-[14px] font-bold text-[#111827]">Berhasil!</h3>
            <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1 shrink-0">
            <X size={18} />
          </button>
        </div>
      )}

      {loadError && students.length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{loadError}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-[26px] font-bold text-[#111827]">Manajemen Mahasiswa</h1>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleExportCSV}
            disabled={filteredStudents.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#e4e9f4] bg-white text-[#5b6170] text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={() => navigate('/university/edit-mahasiswa')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5ce0] text-white text-sm font-bold rounded-xl hover:bg-[#0d4ebf] transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} /> Tambah Mahasiswa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#7b8191]">Total Mahasiswa</p>
            <p className="text-[32px] font-bold text-[#111827] mt-1">{studentStats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#7b8191]">Mahasiswa Aktif</p>
            <p className="text-[32px] font-bold text-[#111827] mt-1">{studentStats.active}</p>
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#7b8191]">Mahasiswa Lulus</p>
            <p className="text-[32px] font-bold text-[#111827] mt-1">{studentStats.graduated}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col">
        <div className="p-5 border-b border-[#e4e9f4] flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative">
              <select 
                value={facultyFilter}
                onChange={handleFacultyChange}
                className="px-4 py-2.5 pr-10 border border-[#e4e9f4] rounded-xl text-sm text-[#5b6170] font-medium bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[160px]"
              >
                <option value="Semua Fakultas">Semua Fakultas</option>
                {availableFaculties.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={majorFilter}
                onChange={(e) => { setMajorFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 pr-10 border border-[#e4e9f4] rounded-xl text-sm text-[#5b6170] font-medium bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[180px]"
              >
                <option value="Semua Program Studi">Semua Program Studi</option>
                {availableMajors.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={yearFilter}
                onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 pr-10 border border-[#e4e9f4] rounded-xl text-sm text-[#5b6170] font-medium bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[140px]"
              >
                <option value="Semua Angkatan">Semua Angkatan</option>
                {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
          </div>
          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari siswa berdasarkan NIM atau nama..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f8faff] border-b border-[#e4e9f4] text-xs font-bold text-[#7b8191]">
                <th className="px-6 py-4 whitespace-nowrap">NIM</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Mahasiswa</th>
                <th className="px-6 py-4 whitespace-nowrap">Program Studi</th>
                <th className="px-6 py-4 whitespace-nowrap">Angkatan</th>
                <th className="px-6 py-4 whitespace-nowrap">IPK</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e9f4]">
              {displayedStudents.length > 0 ? (
                displayedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-[#fafbfe] transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111827]">
                      {student.nim}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${student.bgColor} flex items-center justify-center font-bold text-xs`}>
                          {student.initial}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{student.name}</p>
                          <p className="text-[11px] text-[#7b8191]">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5b6170]">
                      {student.major}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5b6170]">
                      {student.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-[#e6f9f0] text-[#10b981] font-bold text-[11px] rounded uppercase">
                        {student.gpa}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3 text-[#7b8191]">
                        <button onClick={() => navigate(`/university/detail-mahasiswa/${student.id}`)} className="hover:text-[#0f5ce0] transition p-1"><Eye size={18} /></button>
                        <button onClick={() => navigate(`/university/edit-mahasiswa/${student.id}`)} className="hover:text-[#0f5ce0] transition p-1"><Edit2 size={18} /></button>
                        <button onClick={() => setStudentToDelete(student.id)} className="hover:text-red-500 transition p-1"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm text-[#a0a6b5] font-medium">
                    {students.length === 0
                      ? 'Belum ada mahasiswa terdaftar. Tambahkan lewat tombol "Tambah Mahasiswa" atau impor CSV.'
                      : 'Tidak ada data mahasiswa yang sesuai dengan pencarian atau filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm rounded-b-[16px]">
            <div className="text-sm text-[#7b8191] font-medium">
              Menampilkan <span className="text-[#111827] font-semibold">{startIndex}-{endIndex}</span> dari {filteredStudents.length} mahasiswa
            </div>
            
            <div className="flex items-center gap-2">
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
      {studentToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#111827]">Nonaktifkan Akun?</h3>
              <p className="text-sm text-[#5b6170] mt-2">
                Akun mahasiswa ini tidak akan bisa digunakan lagi. Data nilai dan riwayatnya tetap tersimpan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => setStudentToDelete(null)}
                disabled={deleting}
                className="py-2.5 text-sm font-bold text-[#5b6170] bg-white border border-[#e4e9f4] rounded-xl hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-sm transition active:scale-95 disabled:opacity-60"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Ya, Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UniversityManajemenMahasiswa