import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Info, Search, Building2, FileText, Mail, Phone, MapPin, X, CheckCircle2, ClipboardList, RotateCcw } from 'lucide-react'
import { dummyCompanyList, companyStatusFilterOptions } from './AdminData'
import type { CompanyVerificationData } from './AdminData'
import StatusBadge from './components/StatusBadge'

const KelolaPerusahaan = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [companies, setCompanies] = useState<CompanyVerificationData[]>([])
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    setCompanies([...dummyCompanyList])

    const preset = (location.state as { presetFilter?: string } | null)?.presetFilter
    if (preset && companyStatusFilterOptions.some(opt => opt.value === preset)) {
      setFilterStatus(preset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const companyMetrics = useMemo(() => ({
    total: companies.length,
    pending: companies.filter(c => c.status === 'pending').length,
    verified: companies.filter(c => c.status === 'terverifikasi').length,
  }), [companies])

  const filteredData = useMemo(() => {
    return companies.filter((company) => {
      const matchSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchFilter = filterStatus === 'all' || company.status === filterStatus
      return matchSearch && matchFilter
    })
  }, [searchQuery, filterStatus, companies])

  // Reset page ke 1 kalau user ngetik pencarian atau ganti filter
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  // Logic Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getPaginationGroup = () => {
    if (totalPages <= 0) return [1]
    const start = currentPage
    const end = Math.min(currentPage + 1, totalPages)
    let pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const resetFilter = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <StatusBadge label="Pending" tone="warning" />
      case 'terverifikasi': return <StatusBadge label="Terverifikasi" tone="success" />
      case 'ditolak': return <StatusBadge label="Ditolak" tone="danger" />
      default: return <StatusBadge label={status} tone="neutral" />
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const handleRowClick = (company: CompanyVerificationData) => {
    if (company.status === 'pending') {
      navigate(`/admin/kelola-perusahaan/detail/${company.id}`)
    } else {
      navigate(`/admin/kelola-perusahaan/status/${company.id}`)
    }
  }

  return (
    <div className="w-full pb-10 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[22px] font-bold text-[#111827]">Verifikasi Pendaftaran Perusahaan</h1>
        <button onClick={() => setShowInfoModal(true)} className="text-[#0f5ce0] hover:bg-[#f4f7ff] p-1.5 rounded-full transition-colors flex items-center justify-center">
          <Info size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[12px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-2">Total Pendaftar</p>
            <p className="text-[32px] font-black text-[#111827]">{companyMetrics.total}</p>
          </div>
          <div className="w-12 h-12 rounded-[12px] bg-[#f4f7ff] text-[#0f5ce0] border border-[#eef2ff] flex items-center justify-center"><Building2 size={24} strokeWidth={2} /></div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[12px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-2">Menunggu Verifikasi</p>
            <div className="flex items-center gap-3"><p className="text-[32px] font-black text-[#111827]">{companyMetrics.pending}</p></div>
          </div>
          <div className="w-12 h-12 rounded-[12px] bg-[#fffbeb] text-[#f59e0b] border border-[#fde68a] flex items-center justify-center"><ClipboardList size={24} strokeWidth={2} /></div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[12px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-2">Perusahaan Terverifikasi</p>
            <div className="flex items-center gap-3"><p className="text-[32px] font-black text-[#111827]">{companyMetrics.verified}</p></div>
          </div>
          <div className="w-12 h-12 rounded-[12px] bg-[#e6f9f0] text-[#10b981] border border-[#d1f4e0] flex items-center justify-center"><CheckCircle2 size={24} strokeWidth={2} /></div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#e4e9f4] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm w-full sm:w-fit outline-none">
              {companyStatusFilterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {(filterStatus !== 'all' || searchQuery !== '') && (
              <button onClick={resetFilter} className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#7b8191] hover:text-[#111827] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-transparent">
                <RotateCcw size={16} strokeWidth={2.5} /> Reset
              </button>
            )}
          </div>
          <div className="relative w-full sm:w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari nama perusahaan..." className="w-full pl-10 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm" />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {paginatedData.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-widest">
                  <th className="px-6 py-4 whitespace-nowrap w-[25%]">Perusahaan</th>
                  <th className="px-6 py-4 whitespace-nowrap w-[25%]">Data Registrasi</th>
                  <th className="px-6 py-4 whitespace-nowrap w-[20%]">Dokumen</th>
                  <th className="px-6 py-4 whitespace-nowrap w-[15%]">Tanggal Daftar</th>
                  <th className="px-6 py-4 whitespace-nowrap w-[15%] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f9]">
                {paginatedData.map((company) => (
                  <tr key={company.id} onClick={() => handleRowClick(company)} className="hover:bg-[#fafbfe] cursor-pointer transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-[#f8faff] text-[#0f5ce0] border border-[#e4e9f4] flex items-center justify-center font-black text-[13px]">
                          {getInitials(company.name)}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-[#111827] group-hover:text-[#0f5ce0] transition-colors">{company.name}</h4>
                          <p className="text-[12px] text-[#7b8191] mt-0.5">{company.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 text-[12px] font-medium text-[#5b6170]">
                        <div className="flex items-center gap-2"><Mail size={14} className="text-[#a0a6b5] shrink-0" /> {company.email}</div>
                        <div className="flex items-center gap-2"><Phone size={14} className="text-[#a0a6b5] shrink-0" /> {company.phone}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} className="text-[#a0a6b5] shrink-0" /> {company.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 text-[12px] font-bold text-[#0f5ce0]">
                        {company.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 hover:underline cursor-pointer w-fit">
                            <FileText size={14} strokeWidth={2.5} /> {doc}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#111827] font-semibold">{company.date}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(company.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-[#7b8191]">
              <Search size={40} className="mb-4 text-[#e4e9f4]" />
              <p className="text-[14px] font-bold">Tidak ada perusahaan yang ditemukan</p>
            </div>
          )}
        </div>

        {/* Paginasi Footer */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm gap-4">
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="text-[#111827] font-bold">{filteredData.length}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:opacity-50 transition mr-2"
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
                      : 'text-[#5b6170] hover:bg-[#f8faff] border border-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:opacity-50 transition ml-2"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-full max-w-[600px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#e4e9f4] flex justify-between items-center bg-white">
              <div className="flex items-center gap-3 text-[#111827]">
                <Info size={24} strokeWidth={2.5} className="text-[#0f5ce0]" />
                <h2 className="text-[18px] font-bold">Alur Verifikasi Perusahaan</h2>
              </div>
              <button onClick={() => setShowInfoModal(false)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1"><X size={20} strokeWidth={2.5} /></button>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex gap-4 items-start bg-[#f8faff] p-4 rounded-xl border border-[#e4e9f4]">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#0f5ce0] text-white flex items-center justify-center font-black text-[14px]">1</div>
                  <div><h4 className="text-[15px] font-bold text-[#111827] mb-1">Tinjau Dokumen</h4><p className="text-[13px] text-[#5b6170] leading-relaxed">Periksa kelengkapan dan keabsahan dokumen legal (NIB/SIUP) yang diunggah oleh pendaftar melalui tombol preview.</p></div>
                </div>
                <div className="flex gap-4 items-start bg-[#f8faff] p-4 rounded-xl border border-[#e4e9f4]">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#0f5ce0] text-white flex items-center justify-center font-black text-[14px]">2</div>
                  <div><h4 className="text-[15px] font-bold text-[#111827] mb-1">Cek Kesesuaian Profil</h4><p className="text-[13px] text-[#5b6170] leading-relaxed">Pastikan profil perusahaan yang tertera sesuai dengan industri yang didaftarkan serta memiliki alamat kontak yang valid.</p></div>
                </div>
                <div className="flex gap-4 items-start bg-[#f8faff] p-4 rounded-xl border border-[#e4e9f4]">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#0f5ce0] text-white flex items-center justify-center font-black text-[14px]">3</div>
                  <div><h4 className="text-[15px] font-bold text-[#111827] mb-1">Eksekusi Keputusan</h4><p className="text-[13px] text-[#5b6170] leading-relaxed">Tekan tab <strong>'Verifikasi Akun'</strong> untuk menyetujui, atau tab <strong>'Tolak Pendaftaran'</strong> dengan menyertakan alasan yang jelas.</p></div>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-[#e4e9f4] bg-white flex justify-end">
              <button onClick={() => setShowInfoModal(false)} className="px-6 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Mengerti</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KelolaPerusahaan