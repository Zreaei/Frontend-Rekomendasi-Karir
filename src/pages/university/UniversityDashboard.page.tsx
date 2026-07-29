import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BookOpen, GraduationCap, Star, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { universityStats, pendingCourses } from './UniversityData'

const UniversityDashboard = () => {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>('1') // Default buka baris pertama

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

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Dashboard Universitas</h1>
          <p className="text-sm text-[#5b6170] mt-1">Memantau kinerja mahasiswa dan integrasi industri.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#0f5ce0] text-white text-sm font-bold rounded-xl hover:bg-[#0d4ebf] transition-all shadow-sm active:scale-95">
          Ekspor Laporan
        </button>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#f4f3ff] text-[#6366f1] flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Mahasiswa Terdaftar</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{universityStats.students}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Mata Kuliah</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{universityStats.courses}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Total CLO</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{universityStats.totalCLO}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#fffbeb] text-[#f59e0b] flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Nilai Terinput</p>
            <p className="text-3xl font-bold text-[#111827] mt-1">{universityStats.gradesInputted}</p>
          </div>
        </div>

      </div>

      {/* Tabel Penilaian Mata Kuliah */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm overflow-hidden">
        
        {/* Card Header */}
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

        {/* Tabel */}
        <div className="w-full">
          {/* Header Tabel */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#f8faff] border-b border-[#e4e9f4] text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">
            <div className="col-span-1"></div>
            <div className="col-span-4">Mata Kuliah</div>
            <div className="col-span-2 text-center">Kode</div>
            <div className="col-span-1 text-center">CLO</div>
            <div className="col-span-2 text-center">Mahasiswa Dinilai</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {/* Isi Tabel */}
          <div className="divide-y divide-[#e4e9f4]">
            {pendingCourses.map((course) => (
              <div key={course.id} className="flex flex-col">
                {/* Baris Utama Mata Kuliah */}
                <div 
                  onClick={() => toggleExpand(course.id)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="col-span-1 text-[#7b8191]">
                    {expandedId === course.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                    <span className="px-3 py-1 bg-[#eef4ff] text-[#0f5ce0] text-[10px] font-bold rounded-full">
                      {course.status}
                    </span>
                  </div>
                </div>

                {/* Area Expand (Detail CLO) */}
                {expandedId === course.id && (
                  <div className="bg-[#f8faff] px-12 py-5 border-t border-[#e4e9f4]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-[#5b6170]">Detail Penilaian CLO</h3>
                      <button className="px-4 py-1.5 bg-[#0f5ce0] text-white text-[12px] font-bold rounded-md hover:bg-[#0d4ebf] transition shadow-sm active:scale-95">
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
                              <button className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition w-16 text-right">
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
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}

export default UniversityDashboard