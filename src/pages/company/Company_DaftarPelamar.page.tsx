import { useState, useMemo, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Users, Clock, UserCheck, Plus, RotateCcw, Download,
  MoreVertical, CheckCircle2, XCircle, AlertCircle 
} from 'lucide-react'
import { initialApplicants, initialRecommendations, getApplicantSource, CompanyService, type Applicant, type Lowongan } from './CompanyData' 

const Company_DaftarPelamar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const passedRole = location.state?.filterRole

  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobs, setJobs] = useState<Lowongan[]>([])
  const [positionFilter, setPositionFilter] = useState(passedRole || 'Semua Posisi')
  const [statusFilter, setStatusFilter] = useState('Semua Status')
  
  const [currentPageLamar, setCurrentPageLamar] = useState(1)
  const [currentPageUndangan, setCurrentPageUndangan] = useState(1)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    CompanyService.getApplicants().then(data => setApplicants(data))
    CompanyService.getJobs().then(data => setJobs(data))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const uniqueRoles = useMemo(() => {
    const roles = new Set(jobs.map(job => job.role))
    return Array.from(roles)
  }, [jobs])

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setApplicants(prev => {
      const updatedList = prev.map(applicant => {
        if (applicant.id === id) {
          const updatedApp = { ...applicant, status: newStatus }
          
          const appIndex = initialApplicants.findIndex(a => a.id === id)
          if (appIndex > -1) initialApplicants[appIndex].status = newStatus

          if (getApplicantSource(updatedApp) === 'Undangan') {
            const recIndex = initialRecommendations.findIndex(r => r.name === updatedApp.name)
            
            if (recIndex > -1) {
              initialRecommendations[recIndex].status = newStatus as 'Pending' | 'Diterima' | 'Ditolak'
            } else {
              initialRecommendations.push({
                id: Date.now() + id,
                name: updatedApp.name,
                major: updatedApp.major || 'Computer Science',
                university: updatedApp.university,
                skills: updatedApp.skills || ['REACT.JS', 'TYPESCRIPT'],
                matchScore: updatedApp.match,
                roleMatch: updatedApp.role,
                status: newStatus as 'Pending' | 'Diterima' | 'Ditolak'
              })
            }
          }
          return updatedApp
        }
        return applicant
      })
      return updatedList
    })
    setActiveMenuId(null)
  }

  const stats = useMemo(() => {
    const total = applicants.filter(a => getApplicantSource(a) === 'Lamar').length
    const pending = applicants.filter(a => a.status === 'Pending').length
    const diterima = applicants.filter(a => a.status === 'Diterima').length
    return { total, pending, diterima }
  }, [applicants])

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchPosition = positionFilter === 'Semua Posisi' || applicant.role === positionFilter
      const matchStatus = statusFilter === 'Semua Status' || applicant.status === statusFilter
      
      return matchPosition && matchStatus
    })
  }, [applicants, positionFilter, statusFilter])

  const lamarApplicants = useMemo(() => {
    return filteredApplicants.filter(a => getApplicantSource(a) === 'Lamar')
  }, [filteredApplicants])

  const undanganApplicants = useMemo(() => {
    return filteredApplicants.filter(a => getApplicantSource(a) === 'Undangan')
  }, [filteredApplicants])

  const handleResetFilter = () => {
    setPositionFilter('Semua Posisi')
    setStatusFilter('Semua Status')
    setCurrentPageLamar(1)
    setCurrentPageUndangan(1)
  }

  const handleExportCSV = () => {
    if (filteredApplicants.length === 0) return

    const headers = ['Nama Kandidat', 'Sumber', 'Posisi Tujuan', 'Tipe Pekerjaan', 'Match Score (%)', 'Tanggal Melamar', 'Status', 'Universitas']
    
    const csvData = filteredApplicants.map(app => [
      `"${app.name}"`,
      `"${getApplicantSource(app)}"`,
      `"${app.role}"`,
      `"${app.type}"`,
      app.match,
      `"${app.date}"`,
      `"${app.status}"`,
      `"${app.university}"`
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Daftar_Pelamar.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalPagesLamar = Math.ceil(lamarApplicants.length / itemsPerPage) || 1
  const totalPagesUndangan = Math.ceil(undanganApplicants.length / itemsPerPage) || 1

  const displayedLamar = useMemo(() => {
    const start = (currentPageLamar - 1) * itemsPerPage
    const end = start + itemsPerPage
    return lamarApplicants.slice(start, end)
  }, [lamarApplicants, currentPageLamar])

  const displayedUndangan = useMemo(() => {
    const start = (currentPageUndangan - 1) * itemsPerPage
    const end = start + itemsPerPage
    return undanganApplicants.slice(start, end)
  }, [undanganApplicants, currentPageUndangan])

  const startIndexLamar = lamarApplicants.length === 0 ? 0 : (currentPageLamar - 1) * itemsPerPage + 1
  const endIndexLamar = Math.min(currentPageLamar * itemsPerPage, lamarApplicants.length)

  const startIndexUndangan = undanganApplicants.length === 0 ? 0 : (currentPageUndangan - 1) * itemsPerPage + 1
  const endIndexUndangan = Math.min(currentPageUndangan * itemsPerPage, undanganApplicants.length)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Diterima': return 'bg-[#e6f9f0] text-[#10b981]'
      case 'Ditolak': return 'bg-[#fee2e2] text-[#ef4444]'
      default: return 'bg-[#fffbeb] text-[#f59e0b]'
    }
  }

  const getPaginationGroup = (page: number, totalPages: number) => {
    if (totalPages <= 0) return [1]
    const start = page
    const end = Math.min(page + 1, totalPages)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const renderApplicantsTable = (
    list: typeof applicants,
    page: number,
    setPage: (value: number | ((prev: number) => number)) => void,
    totalPages: number,
    startIndex: number,
    endIndex: number,
    total: number
  ) => (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[820px]">
          <thead>
            <tr className="border-b border-[#f1f4f9] bg-[#f8faff] text-[11px] font-bold text-[#7b8191] uppercase tracking-wider">
              <th className="px-6 py-4 w-[30%]">Nama Kandidat</th>
              <th className="px-6 py-4 w-[20%]">Posisi Tujuan</th>
              <th className="px-6 py-4 text-center">Match Score</th>
              <th className="px-6 py-4">Tgl Melamar</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f4f9]">
            {list.length > 0 ? (
              list.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-[#fafbfe] transition">

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
                      {applicant.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap text-center relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === applicant.id ? null : applicant.id)} 
                      className="text-[#7b8191] hover:text-[#0f5ce0] p-1.5 rounded-lg transition hover:bg-[#eef4ff]"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenuId === applicant.id && (
                      <div ref={menuRef} className="absolute right-6 top-8 mt-1 w-44 bg-white border border-[#e4e9f4] rounded-xl shadow-lg py-1.5 z-50 text-left animate-in fade-in duration-100">
                        <p className="text-[10px] font-bold text-[#7b8191] px-3 py-1.5 uppercase tracking-wider">Ubah Status</p>
                        <button onClick={() => handleUpdateStatus(applicant.id, 'Pending')} className="w-full px-3 py-2 text-sm text-[#f59e0b] hover:bg-[#fffbeb] font-medium flex items-center gap-2 transition"><AlertCircle size={16} />Set Pending</button>
                        <button onClick={() => handleUpdateStatus(applicant.id, 'Diterima')} className="w-full px-3 py-2 text-sm text-[#10b981] hover:bg-[#e6f9f0] font-medium flex items-center gap-2 transition"><CheckCircle2 size={16} />Set Diterima</button>
                        <button onClick={() => handleUpdateStatus(applicant.id, 'Ditolak')} className="w-full px-3 py-2 text-sm text-[#ef4444] hover:bg-[#fee2e2] font-medium flex items-center gap-2 transition"><XCircle size={16} />Set Ditolak</button>
                      </div>
                    )}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-sm text-[#a0a6b5] font-medium">
                  Tidak ada data pelamar yang sesuai dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm">
        <div className="text-xs text-[#7b8191] font-medium">
          Menampilkan <span className="text-[#111827] font-semibold">{startIndex}-{endIndex}</span> dari {total} pelamar
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

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Daftar Pelamar</h1>
          <p className="text-sm text-[#5b6170] mt-1">Pantau dan kelola seluruh berkas lamaran yang masuk.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e4e9f4] rounded-xl text-sm font-semibold text-[#5b6170] hover:bg-gray-50 transition shadow-sm active:scale-95"
          >
            <Download size={18} />
            Ekspor CSV
          </button>
          <button 
            onClick={() => navigate('/company/rekomendasi-kandidat')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-semibold text-white hover:bg-[#0d4ebf] transition shadow-sm active:scale-95"
          >
            <Plus size={18} />
            Undang Kandidat
          </button>
        </div>
      </div>

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
            <option value="Pending">Pending</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
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
        {renderApplicantsTable(displayedLamar, currentPageLamar, setCurrentPageLamar, totalPagesLamar, startIndexLamar, endIndexLamar, lamarApplicants.length)}
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#f1f4f9]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center px-3 py-1 bg-[#fffbe6] text-[#f59e0b] rounded-full text-[11px] font-bold">
              Undangan
            </span>
            <h3 className="text-sm font-bold text-[#111827]">Pelamar via Undangan <span className="text-[#7b8191] font-medium">({undanganApplicants.length})</span></h3>
          </div>
        </div>
        {renderApplicantsTable(displayedUndangan, currentPageUndangan, setCurrentPageUndangan, totalPagesUndangan, startIndexUndangan, endIndexUndangan, undanganApplicants.length)}
      </div>
    </div>
  )
}

export default Company_DaftarPelamar