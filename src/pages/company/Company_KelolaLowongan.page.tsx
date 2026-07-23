import { useState, useMemo, useEffect } from 'react'
import { Briefcase, Users, Archive, Plus, Trash2, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { initialLowongan, getApplicantCountForRole, getAvgMatchForRole, CompanyService, type Lowongan } from './CompanyData' 

const Company_KelolaLowongan = () => {
  const navigate = useNavigate()
  
  const [jobs, setJobs] = useState<Lowongan[]>([])
  const [activeTab, setActiveTab] = useState<'Aktif' | 'Draft' | 'Selesai'>('Aktif')
  const [sortBy, setSortBy] = useState<'Terbaru' | 'Terlama'>('Terbaru')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    CompanyService.getJobs().then(data => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < data.length; i++) {
        const job = data[i]
        if (job.status === 'Aktif' && job.tanggalBatas) {
          const batas = new Date(job.tanggalBatas)
          if (!isNaN(batas.getTime()) && batas < today) {
            data[i] = { ...job, status: 'Selesai' }
          }
        }
      }

      setJobs([...data])
    })
  }, [])

  const handleDeleteJob = (id: number) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus lowongan ini?')
    if (confirmDelete) {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id))
      
      const index = initialLowongan.findIndex(job => job.id === id)
      if (index > -1) {
        initialLowongan.splice(index, 1)
      }
    }
  }

  const stats = useMemo(() => {
    const total = jobs.length
    const pelamarBaru = jobs.reduce((acc, job) => acc + (job.status !== 'Draft' ? getApplicantCountForRole(job.role) : 0), 0)
    const ditutup = jobs.filter(j => j.status === 'Selesai').length
    return { total, pelamarBaru, ditutup }
  }, [jobs])

  const filteredJobs = useMemo(() => {
    const result = jobs.filter(job => job.status === activeTab)

    return result.sort((a, b) => {
      const getTimestamp = (dateStr: string) => {
        if (!dateStr) return 0
        
        const mapBulan: Record<string, string> = {
          januari: 'Jan', februari: 'Feb', maret: 'Mar', april: 'Apr', mei: 'May', juni: 'Jun',
          juli: 'Jul', agustus: 'Aug', september: 'Sep', oktober: 'Oct', november: 'Nov', desember: 'Dec',
          jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', jun: 'Jun', jul: 'Jul', 
          agu: 'Aug', agt: 'Aug', sep: 'Sep', okt: 'Oct', nov: 'Nov', des: 'Dec'
        }
        
        let parsedStr = dateStr.toLowerCase()
        Object.keys(mapBulan).forEach(k => { 
          parsedStr = parsedStr.replace(k, mapBulan[k]) 
        })
        
        const time = new Date(parsedStr).getTime()
        return isNaN(time) ? 0 : time
      }

      const timeA = getTimestamp(a.date)
      const timeB = getTimestamp(b.date)

      if (timeA === 0 || timeB === 0) {
        const idA = String(a.id)
        const idB = String(b.id)
        return sortBy === 'Terbaru' 
          ? idB.localeCompare(idA, undefined, { numeric: true })
          : idA.localeCompare(idB, undefined, { numeric: true })
      }

      return sortBy === 'Terbaru' ? timeB - timeA : timeA - timeB
    })
  }, [jobs, activeTab, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, sortBy])

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getPaginationGroup = () => {
    if (totalPages <= 0) return [1]
    const start = currentPage
    const end = Math.min(currentPage + 1, totalPages)
    let pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

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
    <div className="w-full flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Kelola Lowongan</h1>
          <p className="text-sm text-[#5b6170] mt-1">Pantau performa lowongan dan kelola proses rekrutmen Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Total Lowongan</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.total}</p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-[10px] text-[#0f5ce0]">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Pelamar Baru</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.pelamarBaru}</p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-[10px] text-[#0f5ce0]">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start shadow-sm">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
        <h2 className="text-lg font-bold text-[#111827]">Daftar Lowongan</h2>
        <button 
          onClick={() => navigate('/company/tambah-lowongan')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5ce0] rounded-full text-sm font-bold text-white hover:bg-[#0d4ebf] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:scale-95 shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          Tambah Lowongan Baru
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">

        <div className="flex flex-wrap items-center justify-between border-b border-[#f1f4f9] px-6 py-2 gap-4 bg-white">
          <div className="flex gap-6">
            {(['Aktif', 'Draft', 'Selesai'] as const).map((tab) => {
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
              onChange={(e) => setSortBy(e.target.value as 'Terbaru' | 'Terlama')}
              className="px-3 py-1.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm font-semibold text-[#5b6170] focus:outline-none cursor-pointer hover:border-[#cbd5e1] transition-colors"
            >
              <option value="Terbaru">Terbaru</option>
              <option value="Terlama">Terlama</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f1f4f9] bg-[#f8faff] text-[10px] font-bold text-[#7b8191] tracking-widest uppercase">
                <th className="px-6 py-4 w-[35%]">Informasi Lowongan</th>
                <th className="px-4 py-4 w-[15%] text-center">Status</th>
                <th className="px-4 py-4 w-[15%] text-center">Pelamar</th>
                <th className="px-4 py-4 w-[15%] text-center">Avg Match</th>
                <th className="px-6 py-4 w-[20%] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#fafbfe] transition">
                    
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

                    <td className="px-4 py-5 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span className={`flex items-center justify-center gap-1.5 w-[85px] py-1 rounded-[6px] text-[11px] font-bold tracking-wide ${getStatusStyle(job.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {job.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5 text-center whitespace-nowrap text-sm font-bold text-[#111827]">
                      {job.status !== 'Draft' ? (
                        <div>
                          {getApplicantCountForRole(job.role)}{' '}
                          <span className="text-[10px] text-[#7b8191] font-bold tracking-wider block sm:inline">ORANG</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-normal">—</span>
                      )}
                    </td>

                    <td className="px-4 py-5 text-center whitespace-nowrap">
                      {job.status !== 'Draft' && getAvgMatchForRole(job.role) !== null ? (
                        <span className="text-sm font-bold text-[#0f5ce0] border-b-2 border-[#0f5ce0]/30 pb-0.5">
                          {getAvgMatchForRole(job.role)}%
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#a0a6b5] font-semibold">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        
                        {job.status === 'Aktif' && (
                          <button 
                            onClick={() => navigate('/company/daftar-pelamar', { state: { filterRole: job.role } })}
                            className="w-[110px] py-1.5 bg-[#eef4ff] text-[#0f5ce0] hover:bg-[#dbe7ff] text-[12px] font-bold rounded-[8px] transition active:scale-95 flex justify-center items-center"
                          >
                            Lihat Pelamar
                          </button>
                        )}

                        {job.status === 'Draft' && (
                          <button 
                            onClick={() => navigate('/company/tambah-lowongan', { state: { editJob: job } })}
                            className="w-[110px] py-1.5 bg-black text-white hover:bg-zinc-800 text-[12px] font-bold rounded-[8px] transition active:scale-95 flex justify-center items-center"
                          >
                            Lanjutkan Post
                          </button>
                        )}

                        {job.status === 'Selesai' && (
                          <button className="w-[110px] py-1.5 bg-white border border-[#e4e9f4] text-[#5b6170] hover:bg-gray-50 hover:border-[#cbd5e1] text-[12px] font-bold rounded-[8px] transition active:scale-95 flex justify-center items-center">
                            Archive
                          </button>
                        )}

                        {job.status !== 'Selesai' ? (
                          <button 
                            onClick={() => navigate('/company/tambah-lowongan', { state: { editJob: job } })}
                            className="w-8 h-8 flex items-center justify-center text-[#7b8191] hover:text-[#0f5ce0] hover:bg-[#eef4ff] rounded-[8px] transition"
                            title="Edit Lowongan"
                          >
                            <Edit size={16} />
                          </button>
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}

                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="w-8 h-8 flex items-center justify-center text-[#7b8191] hover:text-[#ef4444] hover:bg-[#fee2e2] rounded-[8px] transition"
                          title="Hapus Lowongan"
                        >
                          <Trash2 size={16} />
                        </button>
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

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm">
          <div className="text-xs text-[#7b8191] font-medium">
            Menampilkan <span className="text-[#111827] font-semibold">
              {filteredJobs.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredJobs.length)}
            </span> dari {filteredJobs.length} lowongan
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-sm font-semibold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#7b8191] disabled:opacity-40 transition mr-2"
            >
              Sebelumnya
            </button>
            
            {getPaginationGroup().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                  currentPage === pageNum 
                    ? 'bg-[#0f5ce0] text-white shadow-sm' 
                    : 'text-[#5b6170] hover:bg-gray-50 border border-transparent'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="text-sm font-semibold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#7b8191] disabled:opacity-40 transition ml-2"
            >
              Selanjutnya
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Company_KelolaLowongan