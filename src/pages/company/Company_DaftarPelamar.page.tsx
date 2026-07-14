import { useState, useMemo, useRef, useEffect } from 'react'
import { 
  Users, Clock, UserCheck, Download, Plus, MoreVertical, RotateCcw, Lightbulb, CheckCircle2, XCircle, AlertCircle 
} from 'lucide-react'
import { initialApplicants } from './CompanyData' // Import Data Di Sini

const Company_DaftarPelamar = () => {
  const [applicants, setApplicants] = useState(initialApplicants)
  const [positionFilter, setPositionFilter] = useState('Semua Posisi')
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
    <div className="max-w-7xl mx-auto px-6 py-8 bg-[#f8faff] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Daftar Pelamar</h1>
          <p className="text-sm text-[#5b6170] mt-1">Pantau dan kelola seluruh berkas lamaran yang masuk.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-semibold text-white hover:bg-[#0d4ebf] transition shadow-sm">
            <Plus size={18} />
            Undang Kandidat
          </button>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Total Pelamar</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.total}</p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-[10px] text-[#0f5ce0]"><Users size={20} /></div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Menunggu Review</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.pending}</p>
          </div>
          <div className="bg-[#fffbe6] p-2.5 rounded-[10px] text-amber-500"><Clock size={20} /></div>
        </div>
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[#7b8191]">Kandidat Terpilih</p>
            <p className="text-3xl font-bold text-[#111827] mt-2">{stats.diterima}</p>
          </div>
          <div className="bg-[#e6f9f0] p-2.5 rounded-[10px] text-[#10b981]"><UserCheck size={20} /></div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#f1f4f9]">
          <div className="flex items-center gap-3">
            <select value={positionFilter} onChange={(e) => { setPositionFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 bg-white border border-[#e4e9f4] rounded-xl text-sm font-medium text-[#5b6170] focus:outline-none">
              <option>Semua Posisi</option>
              <option>Software Engineer</option>
              <option>Data Analyst</option>
              <option>Product Designer</option>
              <option>Marketing Associate</option>
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 bg-white border border-[#e4e9f4] rounded-xl text-sm font-medium text-[#5b6170] focus:outline-none">
              <option>Semua Status</option>
              <option>Pending</option>
              <option>Diterima</option>
              <option>Ditolak</option>
            </select>
            <button onClick={handleResetFilter} className="p-2 border border-[#e4e9f4] rounded-xl text-[#7b8191] hover:bg-gray-50"><RotateCcw size={16} /></button>
          </div>
          <div className="text-sm text-[#7b8191] font-medium">
            Menampilkan <span className="text-[#111827] font-semibold">{startIndex}-{endIndex}</span> dari {filteredApplicants.length} pelamar
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f1f4f9] bg-[#f8faff] text-[12px] font-bold text-[#7b8191] uppercase tracking-wider">
                <th className="px-6 py-4">Nama Kandidat</th>
                <th className="px-6 py-4">Posisi Tujuan</th>
                <th className="px-6 py-4 text-center">Match Score</th>
                <th className="px-6 py-4">Tgl Melamar</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {displayedApplicants.map((applicant) => (
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
                    <p className="text-sm font-semibold text-[#111827]">{applicant.role}</p>
                    <p className="text-[12px] text-[#7b8191]">{applicant.type}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="text-sm font-bold text-[#0f5ce0]">{applicant.match}%</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5b6170] font-medium">{applicant.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(applicant.status)}`}>{applicant.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === applicant.id ? null : applicant.id)} className="text-[#7b8191] hover:text-[#111827] p-1 rounded-lg transition hover:bg-gray-100"><MoreVertical size={18} /></button>
                    {activeMenuId === applicant.id && (
                      <div ref={menuRef} className="absolute right-6 mt-1 w-44 bg-white border border-[#e4e9f4] rounded-xl shadow-lg py-1.5 z-50 text-left animate-in fade-in duration-100">
                        <p className="text-[11px] font-bold text-[#7b8191] px-3 py-1 uppercase">Ubah Status</p>
                        <button onClick={() => handleUpdateStatus(applicant.id, 'Pending')} className="w-full px-3 py-2 text-sm text-[#f59e0b] hover:bg-[#fffbeb] font-medium flex items-center gap-2"><AlertCircle size={16} />Set Pending</button>
                        <button onClick={() => handleUpdateStatus(applicant.id, 'Diterima')} className="w-full px-3 py-2 text-sm text-[#10b981] hover:bg-[#e6f9f0] font-medium flex items-center gap-2"><CheckCircle2 size={16} />Set Diterima</button>
                        <button onClick={() => handleUpdateStatus(applicant.id, 'Ditolak')} className="w-full px-3 py-2 text-sm text-[#ef4444] hover:bg-[#fee2e2] font-medium flex items-center gap-2"><XCircle size={16} />Set Ditolak</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="text-sm font-semibold text-[#7b8191] disabled:opacity-40">Sebelumnya</button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${currentPage === pageNum ? 'bg-[#0f5ce0] text-white' : 'text-[#5b6170] hover:bg-gray-50'}`}>{pageNum}</button>
            ))}
          </div>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="text-sm font-semibold text-[#0f5ce0] disabled:opacity-40">Selanjutnya</button>
        </div>
      </div>
    </div>
  )
}

export default Company_DaftarPelamar 