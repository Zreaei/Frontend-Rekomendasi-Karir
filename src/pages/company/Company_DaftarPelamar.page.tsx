import { useState, useMemo, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Users, Clock, UserCheck, Plus, MoreVertical, RotateCcw, CheckCircle2, XCircle, AlertCircle, Download 
} from 'lucide-react'
import { initialApplicants, initialLowongan } from './CompanyData' 

const Company_DaftarPelamar = () => {
  const location = useLocation()

  const passedRole = location.state?.filterRole

  const [applicants, setApplicants] = useState(initialApplicants)
  const [positionFilter, setPositionFilter] = useState(passedRole || 'Semua Posisi')
  const [statusFilter, setStatusFilter] = useState('Semua Status')
  
  const [currentPage, setCurrentPage] = useState(1)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const itemsPerPage = 10

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
    const roles = new Set(initialLowongan.map(job => job.role))
    return Array.from(roles)
  }, [])

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === id ? { ...applicant, status: newStatus } : applicant
    ))
    setActiveMenuId(null)
  }

  const stats = useMemo(() => {
    const total = applicants.length
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

  const handleResetFilter = () => {
    setPositionFilter('Semua Posisi')
    setStatusFilter('Semua Status')
    setCurrentPage(1)
  }

  const handleExportCSV = () => {
    if (filteredApplicants.length === 0) return

    const headers = ['Nama Kandidat', 'Posisi Tujuan', 'Tipe Pekerjaan', 'Match Score (%)', 'Tanggal Melamar', 'Status', 'Universitas']
    
    const csvData = filteredApplicants.map(app => [
      `"${app.name}"`,
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

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage) || 1
  
  const displayedApplicants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredApplicants.slice(start, end)
  }, [filteredApplicants, currentPage])

  const startIndex = filteredApplicants.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, filteredApplicants.length)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Diterima': return 'bg-[#e6f9f0] text-[#10b981]'
      case 'Ditolak': return 'bg-[#fee2e2] text-[#ef4444]'
      default: return 'bg-[#fffbeb] text-[#f59e0b]'
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
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
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-semibold text-white hover:bg-[#0d4ebf] transition shadow-sm active:scale-95">
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

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#f1f4f9]">
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={positionFilter} 
              onChange={(e) => { setPositionFilter(e.target.value); setCurrentPage(1); }} 
              className="px-4 py-2 bg-white border border-[#e4e9f4] rounded-xl text-sm font-medium text-[#5b6170] focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="Semua Posisi">Semua Posisi</option>
              {/* Opsi posisi didapat secara dinamis */}
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} 
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
          <div className="text-sm text-[#7b8191] font-medium">
            Menampilkan <span className="text-[#111827] font-semibold">{startIndex}-{endIndex}</span> dari {filteredApplicants.length} pelamar
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f1f4f9] bg-[#f8faff] text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">
                <th className="px-6 py-4 w-[25%]">Nama Kandidat</th>
                <th className="px-6 py-4 w-[25%]">Posisi Tujuan</th>
                <th className="px-6 py-4 text-center">Match Score</th>
                <th className="px-6 py-4">Tgl Melamar</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {displayedApplicants.length > 0 ? (
                displayedApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-[#fafbfe] transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${applicant.bgColor} text-white flex items-center justify-center font-bold text-xs`}>{applicant.initial}</div>
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{applicant.name}</p>
                          <p className="text-[12px] text-[#7b8191]">{applicant.university}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-[#111827] truncate max-w-[180px]">{applicant.role}</p>
                      <p className="text-[12px] text-[#7b8191]">{applicant.type}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-[#0f5ce0]">{applicant.match}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5b6170] font-medium">{applicant.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(applicant.status)}`}>{applicant.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center relative">
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
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1} 
            className="text-sm font-semibold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#7b8191] disabled:opacity-40 transition"
          >
            Sebelumnya
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
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
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages || totalPages === 0} 
            className="text-sm font-semibold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#7b8191] disabled:opacity-40 transition"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  )
}

export default Company_DaftarPelamar