import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Filter, CheckCircle2, XCircle } from 'lucide-react'
import { CompanyService, initialApplicants, initialRecommendations, type Recommendation } from './CompanyData'

const Company_RekomendasiKandidat = () => {
  const navigate = useNavigate()
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [activeFilter, setActiveFilter] = useState<'Pending' | 'Diterima' | 'Ditolak'>('Pending')
  
  // Menampilkan 10 kandidat per halaman
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    CompanyService.getRecommendations().then((data: Recommendation[]) => setRecommendations(data))
  }, [])

  const filteredCandidates = useMemo(() => {
    const filtered = recommendations.filter(cand => cand.status === activeFilter)
    return filtered.sort((a, b) => b.matchScore - a.matchScore)
  }, [recommendations, activeFilter])

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleFilterChange = (filter: 'Pending' | 'Diterima' | 'Ditolak') => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const getPaginationGroup = () => {
    let pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // Logika saat tombol "Undang Melamar" diklik
  const handleUndangMelamar = (kandidat: Recommendation) => {
    // 1. Format nama jadi inisial (contoh: Budi Santoso -> BS)
    const initials = kandidat.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    // 2. Buat objek Applicant baru
    const newApplicant = {
      id: initialApplicants.length > 0 ? Math.max(...initialApplicants.map(a => a.id)) + 1 : 1,
      name: kandidat.name,
      university: kandidat.university,
      role: kandidat.roleMatch, 
      type: 'Full-time', // Tipe default
      match: kandidat.matchScore,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ' '),
      status: 'Pending',
      initial: initials,
      bgColor: 'bg-[#0f5ce0]',
      source: 'Undangan',
      major: kandidat.major,   
      skills: kandidat.skills
    }

    // 3. Masukkan ke daftar pelamar di memori (CompanyData)
    initialApplicants.unshift(newApplicant)

    // 4. Hapus kandidat ini dari daftar rekomendasi agar tidak muncul 2 kali
    const index = initialRecommendations.findIndex(r => r.id === kandidat.id)
    if (index > -1) {
      initialRecommendations.splice(index, 1)
    }

    // 5. Arahkan ke halaman Daftar Pelamar
    navigate('/company/daftar-pelamar')
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12">
      
      <div>
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">Rekomendasi Kandidat</h1>
        <p className="text-sm text-[#5b6170] mt-1">Pencarian kandidat untuk posisi yang sedang dibuka</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e4e9f4] p-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleFilterChange('Pending')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeFilter === 'Pending' 
                ? 'bg-[#0f5ce0] text-white shadow-md' 
                : 'text-[#5b6170] hover:bg-[#f8faff] hover:text-[#111827]'
            }`}
          >
            Semua Kandidat
          </button>
          <button 
            onClick={() => handleFilterChange('Diterima')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeFilter === 'Diterima' 
                ? 'bg-[#0f5ce0] text-white shadow-md' 
                : 'text-[#5b6170] hover:bg-[#f8faff] hover:text-[#111827]'
            }`}
          >
            Diterima
          </button>
          <button 
            onClick={() => handleFilterChange('Ditolak')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeFilter === 'Ditolak' 
                ? 'bg-[#0f5ce0] text-white shadow-md' 
                : 'text-[#5b6170] hover:bg-[#f8faff] hover:text-[#111827]'
            }`}
          >
            Ditolak
          </button>
        </div>
        
        <button className="w-10 h-10 rounded-xl bg-[#f8faff] border border-[#e4e9f4] text-[#7b8191] hover:text-[#111827] hover:border-[#cbd5e1] flex items-center justify-center shrink-0 transition mr-1">
          <Filter size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="text-sm font-bold text-[#111827]">
            Kandidat Teratas <span className="text-[#7b8191] font-medium ml-1">({filteredCandidates.length} ditemukan)</span>
          </div>
          <div className="text-sm text-[#7b8191]">
            Urutkan berdasarkan: <span className="font-bold text-[#111827]">Match Tertinggi %</span>
          </div>
        </div>

        <div className="flex flex-col bg-white rounded-2xl border border-[#e4e9f4] shadow-sm">
          {paginatedCandidates.length > 0 ? (
            paginatedCandidates.map((candidate, index) => (
              <div 
                key={candidate.id} 
                className={`flex flex-col lg:flex-row lg:items-center justify-between p-6 gap-6 transition hover:bg-[#fafbfe] ${
                  index !== paginatedCandidates.length - 1 ? 'border-b border-[#f1f4f9]' : ''
                }`}
              >
                
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  <div className="w-[60px] h-[60px] rounded-2xl bg-[#eef4ff] border border-[#d0e0ff] text-[#0f5ce0] flex items-center justify-center shrink-0 shadow-sm">
                    <User size={28} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#111827] truncate">{candidate.name}</h3>
                    <p className="text-sm text-[#5b6170] mt-0.5 truncate">
                      {candidate.major} • {candidate.university}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#f1f4f9] text-[#5b6170] text-[10px] font-bold rounded-md uppercase tracking-wider border border-[#e4e9f4]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0 w-[160px] lg:px-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#f1f4f9]">
                  <div className="text-[32px] font-extrabold text-[#0f5ce0] leading-none">
                    {candidate.matchScore}%
                  </div>
                  <div className="text-[9px] font-bold text-[#a0a6b5] uppercase tracking-[0.2em] mt-1 mb-2">
                    Match For
                  </div>
                  <div className="px-3 py-1.5 bg-[#eef4ff] text-[#0f5ce0] text-[10px] font-bold rounded-lg uppercase tracking-wider text-center w-full truncate">
                    {candidate.roleMatch}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 w-[150px]">
                  {activeFilter === 'Pending' && (
                    <button 
                      onClick={() => handleUndangMelamar(candidate)}
                      className="w-full py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-sm font-bold rounded-xl transition shadow-md active:scale-95"
                    >
                      Undang Melamar
                    </button>
                  )}
                  {activeFilter === 'Diterima' && (
                    <button className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-default">
                      <CheckCircle2 size={16} /> Telah Diterima
                    </button>
                  )}
                  {activeFilter === 'Ditolak' && (
                    <button className="w-full py-2.5 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-default">
                      <XCircle size={16} /> Ditolak
                    </button>
                  )}
                  <button className="w-full py-2.5 bg-white hover:bg-gray-50 border border-[#e4e9f4] text-[#5b6170] hover:text-[#111827] text-sm font-bold rounded-xl transition shadow-sm active:scale-95">
                    Lihat Detail
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <User size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Tidak ada kandidat</h3>
              <p className="text-sm text-[#7b8191] mt-1 max-w-sm">
                Belum ada kandidat dengan status "{activeFilter}" pada saat ini.
              </p>
            </div>
          )}

          {filteredCandidates.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-[#f1f4f9] bg-white text-sm rounded-b-2xl">
              
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`font-semibold transition-colors ${
                  currentPage === 1 
                    ? 'text-[#a0a6b5] cursor-not-allowed' 
                    : 'text-[#7b8191] hover:text-[#0f5ce0]'
                }`}
              >
                Sebelumnya
              </button>
              
              <div className="flex items-center gap-2">
                {getPaginationGroup().map((item) => (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                      currentPage === item 
                        ? 'bg-[#0f5ce0] text-white shadow-sm' 
                        : 'bg-transparent text-[#5b6170] hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`font-semibold transition-colors ${
                  (currentPage === totalPages || totalPages === 0) 
                    ? 'text-[#a0a6b5] cursor-not-allowed' 
                    : 'text-[#0f5ce0] hover:text-[#0d4ebf]'
                }`}
              >
                Selanjutnya
              </button>

            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Company_RekomendasiKandidat