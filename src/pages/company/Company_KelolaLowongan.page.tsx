import { useState, useMemo } from 'react'
import { Briefcase, Users, Archive, Plus, Eye, Edit3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { initialLowongan } from './CompanyData' // Satu file manajemen data tunggal

const Company_KelolaLowongan = () => {
  const navigate = useNavigate()
  const [jobs] = useState(initialLowongan)
  const [activeTab, setActiveTab] = useState<'Semua' | 'Aktif' | 'Draft' | 'Selesai'>('Semua')
  const [sortBy, setSortBy] = useState('Terbaru')

  // Menghitung angka untuk Metric Cards 
  const stats = useMemo(() => {
    const total = jobs.length
    const pelamarBaru = jobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0)
    const ditutup = jobs.filter(j => j.status === 'Selesai').length
    return { total, pelamarBaru, ditutup }
  }, [jobs])

  // Filter Data berdasarkan Tab yang dipilih
  const filteredJobs = useMemo(() => {
    if (activeTab === 'Semua') return jobs
    return jobs.filter(job => job.status === activeTab)
  }, [jobs, activeTab])

  const getStatusStyle = (status: 'Aktif' | 'Draft' | 'Selesai') => {
    switch (status) {
      case 'Aktif':
        return 'bg-[#e6f9f0] text-[#10b981]'
      case 'Draft':
        return 'bg-[#eef4ff] text-[#0f5ce0]'
      case 'Selesai':
        return 'bg-[#fee2e2] text-[#ef4444]'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-[#f8faff] min-h-screen">
      
      {/* Header Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Kelola Lowongan</h1>
          <p className="text-sm text-[#5b6170] mt-1">Pantau performa lowongan dan kelola proses rekrutmen Anda.</p>
        </div>
      </div>

      {/* Tiga Metric Cards Atas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Total Lowongan</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.total}</p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-[10px] text-[#0f5ce0]">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Pelamar Baru</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.pelamarBaru}</p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-[10px] text-[#0f5ce0]">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Lowongan Ditutup</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.ditutup}</p>
            <p className="text-xs text-[#7b8191] mt-2">Bulan ini</p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-[10px] text-[#0f5ce0]">
            <Archive size={20} />
          </div>
        </div>
      </div>

      {/* Bagian Navigasi Filter Tab dan Tombol Tambah Lowongan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#111827]">Daftar Lowongan</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5ce0] rounded-full text-sm font-bold text-white hover:bg-[#0d4ebf] transition shadow-sm self-start sm:self-auto">
          <Plus size={18} />
          Tambah Lowongan Baru
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">
        
        {/* Kontrol Kategori Tab Atas */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#f1f4f9] px-6 py-2 gap-4 bg-white">
          <div className="flex gap-6">
            {(['Semua', 'Aktif', 'Draft', 'Selesai'] as const).map((tab) => {
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold border-b-2 transition relative ${
                    activeTab === tab 
                      ? 'border-[#0f5ce0] text-[#0f5ce0]' 
                      : 'border-transparent text-[#7b8191] hover:text-[#111827]'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm font-semibold text-[#5b6170] focus:outline-none cursor-pointer"
            >
              <option>Terbaru</option>
              <option>Populer</option>
            </select>
          </div>
        </div>

        {/* Tabel Data List Lowongan Pekerjaan */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f1f4f9] bg-[#f8faff] text-[10px] font-bold text-[#7b8191] tracking-widest uppercase">
                <th className="px-6 py-4 w-[45%]">Informasi Lowongan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Pelamar</th>
                <th className="px-6 py-4 text-center">Avg Match</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#fafbfe] transition">
                    
                    {/* Kolom Info Lowongan */}
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center shrink-0 border border-[#d0e0ff]">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{job.role}</p>
                          <p className="text-[12px] text-[#7b8191] font-medium mt-0.5">
                            {job.department} • {job.type} • {job.location}
                          </p>
                          <p className="text-[10px] text-[#a0a6b5] font-bold uppercase mt-1 tracking-wider">
                            {job.date}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom Badge Status */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold tracking-wide ${getStatusStyle(job.status)}`}>
                        • {job.status}
                      </span>
                    </td>

                    {/* Kolom Jumlah Pelamar */}
                    <td className="px-6 py-5 text-center whitespace-nowrap text-sm font-bold text-[#111827]">
                      {job.applicantsCount !== null ? (
                        <div>
                          {job.applicantsCount}{' '}
                          <span className="text-[10px] text-[#7b8191] font-bold tracking-wider block sm:inline">ORANG</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-normal">—</span>
                      )}
                    </td>

                    {/* Kolom Rata-rata Match Score */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      {job.avgMatch !== null ? (
                        <span className="text-sm font-bold text-[#0f5ce0] border-b-2 border-[#0f5ce0]/30 pb-0.5">
                          {job.avgMatch}%
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#a0a6b5] font-semibold">N/A</span>
                      )}
                    </td>

                    {/* Kolom Tombol Aksi Kontekstual */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {job.status === 'Aktif' && (
                          <>
                            <button 
                              onClick={() => navigate('/company/daftar-pelamar')}
                              className="px-3 py-1.5 bg-[#eef4ff] text-[#0f5ce0] hover:bg-[#dbe7ff] text-[12px] font-bold rounded-[8px] transition"
                            >
                              Lihat Pelamar
                            </button>
                            <button className="p-2 border border-[#e4e9f4] text-[#7b8191] hover:text-[#111827] hover:bg-gray-50 rounded-[8px] transition">
                              <Edit3 size={15} />
                            </button>
                          </>
                        )}

                        {job.status === 'Draft' && (
                          <>
                            <button className="px-4 py-1.5 bg-black text-white hover:bg-zinc-800 text-[12px] font-bold rounded-[8px] transition">
                              Lanjutkan Post
                            </button>
                            <button className="p-2 border border-[#e4e9f4] text-[#7b8191] hover:text-[#111827] hover:bg-gray-50 rounded-[8px] transition">
                              <Edit3 size={15} />
                            </button>
                          </>
                        )}

                        {job.status === 'Selesai' && (
                          <>
                            <button className="px-4 py-1.5 bg-white border border-[#e4e9f4] text-[#5b6170] hover:bg-gray-50 text-[12px] font-bold rounded-[8px] transition">
                              Archive
                            </button>
                            <button className="p-2 border border-[#e4e9f4] text-[#7b8191] hover:text-[#111827] hover:bg-gray-50 rounded-[8px] transition">
                              <Eye size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-sm text-gray-400 font-medium">
                    Tidak ada data lowongan pada kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Navigasi Halaman (Pagination) */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm">
          <div className="text-xs text-[#7b8191] font-medium">
            Menampilkan <span className="text-[#111827] font-semibold">1-10</span> dari {filteredJobs.length} lowongan
          </div>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg text-[#5b6170] hover:bg-gray-50 font-bold text-xs flex items-center justify-center border border-[#e4e9f4] opacity-50 cursor-not-allowed">‹</button>
            <button className="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center bg-[#0f5ce0] text-white">1</button>
            <button className="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center text-[#5b6170] hover:bg-gray-50">2</button>
            <button className="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center text-[#5b6170] hover:bg-gray-50">3</button>
            <span className="px-1 text-[#7b8191] text-xs font-bold">...</span>
            <button className="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center text-[#5b6170] hover:bg-gray-50">6</button>
            <button className="w-8 h-8 rounded-lg text-[#5b6170] hover:bg-gray-50 font-bold text-xs flex items-center justify-center border border-[#e4e9f4]">›</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Company_KelolaLowongan