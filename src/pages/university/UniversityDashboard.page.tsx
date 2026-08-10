import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BookOpen, GraduationCap, Star, ChevronDown, ArrowRight, Download, Loader2, AlertCircle } from 'lucide-react'
import {
  universityDashboardApi,
  type DashboardStats,
  type CourseProgress,
} from '../../services/university.service'

const UniversityDashboard = () => {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({ students: 0, courses: 0, totalCLO: 0, gradesInputted: 0 })
  const [pendingCourses, setPendingCourses] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const { stats: s, courses } = await universityDashboardApi.get()
      setStats(s)
      // hanya tampilkan matkul yang penilaiannya belum lengkap
      setPendingCourses(courses.filter((c) => c.status !== 'Selesai'))
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat data dashboard. Pastikan server berjalan.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const handleGoToKelolaNilai = (subjectId: string) => {
    navigate(`/university/kelola-nilai/${subjectId}`)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getCloStatusStyle = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-[#e6f9f0] text-[#10b981]'
      case 'Sebagian': return 'bg-[#eef4ff] text-[#0f5ce0]'
      case 'Belum': return 'bg-[#f1f4f9] text-[#7b8191]'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  const handleExportCSV = () => {
    if (pendingCourses.length === 0) return

    const headers = ['Mata Kuliah', 'Kode', 'Total CLO', 'Mahasiswa Dinilai', 'Total Mahasiswa', 'Status Penilaian']

    const csvData = pendingCourses.map(course => [
      `"${course.name}"`,
      `"${course.code}"`,
      course.cloCount,
      course.gradedStudents,
      course.totalStudents,
      `"${course.status}"`
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Laporan_Dashboard_Universitas.csv')
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
        <p className="text-sm font-medium">Memuat ringkasan universitas...</p>
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
        <button onClick={loadDashboard} className="px-6 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] transition">
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Dashboard Universitas</h1>
          <p className="text-sm text-[#5b6170] mt-1">Memantau kinerja mahasiswa dan integrasi industri.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={pendingCourses.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5ce0] text-white text-sm font-bold rounded-xl hover:bg-[#0d4ebf] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Ekspor Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#f4f3ff] text-[#6366f1] flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Mahasiswa Terdaftar</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{stats.students}</p>
          </div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Mata Kuliah</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{stats.courses}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Total CLO</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{stats.totalCLO}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#fffbeb] text-[#f59e0b] flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Nilai Terinput</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{stats.gradesInputted}</p>
          </div>
        </div>

      </div>
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm overflow-hidden">

        <div className="px-6 py-5 flex items-start justify-between border-b border-[#e4e9f4]">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Mata Kuliah Perlu Penilaian</h2>
            <p className="text-sm text-[#7b8191] mt-0.5">Hanya menampilkan mata kuliah yang penilaiannya belum lengkap. Klik baris untuk detail.</p>
          </div>
          <button
            onClick={() => navigate('/university/manajemen-nilai')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition"
          >
            Kelola Nilai <ArrowRight size={16} />
          </button>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#f8faff] border-b border-[#e4e9f4] text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">
            <div className="col-span-1"></div>
            <div className="col-span-4">Mata Kuliah</div>
            <div className="col-span-2 text-center">Kode</div>
            <div className="col-span-1 text-center">CLO</div>
            <div className="col-span-2 text-center">Mahasiswa Dinilai</div>
            <div className="col-span-2 text-center">Status</div>
          </div>
          <div className="divide-y divide-[#e4e9f4]">
            {pendingCourses.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-semibold text-[#5b6170]">Semua mata kuliah sudah dinilai</p>
                <p className="text-xs text-[#7b8191] mt-1">
                  Mata kuliah akan muncul di sini bila masih ada mahasiswa yang belum memiliki nilai.
                </p>
              </div>
            ) : pendingCourses.map((course) => (
              <div key={course.id} className="flex flex-col">
                <div
                  onClick={() => toggleExpand(course.id)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="col-span-1 text-[#7b8191] transition-transform duration-300">
                    <ChevronDown size={18} className={`transform transition-transform duration-300 ${expandedId === course.id ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="col-span-4 font-bold text-sm text-[#111827] truncate">
                    {course.name}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="px-2 py-1 bg-gray-100 text-[#5b6170] text-[10px] font-bold rounded uppercase tracking-wider">
                      {course.code}
                    </span>
                  </div>
                  <div className="col-span-1 text-center text-sm font-bold text-[#111827]">
                    {course.cloCount}
                  </div>
                  <div className="col-span-2 text-center text-sm font-bold text-[#111827]">
                    {course.gradedStudents} <span className="text-[#7b8191] font-medium">/ {course.totalStudents}</span>
                  </div>
                  <div className="col-span-2 text-center flex justify-center">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${getCloStatusStyle(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                </div>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    expandedId === course.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="bg-[#f8faff] px-12 py-5 border-t border-[#e4e9f4]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#5b6170]">Detail Penilaian CLO</h3>
                        <button
                          onClick={() => handleGoToKelolaNilai(course.id)}
                          className="px-4 py-1.5 bg-[#0f5ce0] text-white text-[12px] font-bold rounded-md hover:bg-[#0d4ebf] transition shadow-sm active:scale-95"
                        >
                          Kelola Semua Nilai
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {course.clos.length > 0 ? (
                          course.clos.map((clo) => (
                            <div key={clo.id} className="flex items-center justify-between bg-white border border-[#e4e9f4] p-3.5 rounded-lg shadow-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-[#111827]">{clo.name}</span>
                                <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-extrabold uppercase tracking-widest ${getCloStatusStyle(clo.status)}`}>
                                  {clo.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className="text-sm font-bold text-[#111827]">
                                  {clo.graded} <span className="text-[#7b8191] font-medium">/ {clo.total}</span>
                                </span>
                                <button
                                  onClick={() => handleGoToKelolaNilai(course.id)}
                                  className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition w-16 text-right"
                                >
                                  {clo.status === 'Selesai' ? 'Edit' : clo.status === 'Sebagian' ? 'Lanjutkan' : 'Mulai'}
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-[#7b8191] italic bg-white border border-[#e4e9f4] p-4 rounded-lg">
                            Tidak ada data detail CLO untuk mata kuliah ini.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}

export default UniversityDashboard