import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Filter, CheckCircle2, XCircle } from 'lucide-react'
import { matchingApi, invitationApi } from '../../services/company.service'

// Bentuk data disamakan dengan yang dipakai tampilan (sebelumnya dari CompanyData),
// supaya seluruh UI tidak perlu diubah.
interface Recommendation {
  id: string
  name: string
  major: string
  university: string
  skills: string[]
  matchScore: number
  roleMatch: string
  status: 'Pending' | 'Diterima' | 'Ditolak'
  hasApplied: boolean
  bestJobId: string | null
  invitationStatus: string | null
}

// Status lamaran backend -> status tampilan
const toDisplayStatus = (applicationStatus: string | null): Recommendation['status'] => {
  if (applicationStatus === 'accepted') return 'Diterima'
  if (applicationStatus === 'rejected') return 'Ditolak'
  return 'Pending'
}

const Company_RekomendasiKandidat = () => {
  const navigate = useNavigate()
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [emptyMessage, setEmptyMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState<'Pending' | 'Diterima' | 'Ditolak'>('Pending')
  const [sortOrder, setSortOrder] = useState<'Tertinggi' | 'Terendah'>('Tertinggi')
  const [invitingId, setInvitingId] = useState<string | null>(null)
  const [invitedIds, setInvitedIds] = useState<string[]>([])

  // Menampilkan 10 kandidat per halaman
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    let aktif = true

    const muat = async () => {
      try {
        // Kandidat lintas seluruh lowongan aktif perusahaan, sudah terurut match desc.
        const { candidates } = await matchingApi.companyCandidates()
        if (!aktif) return

        const mapped: Recommendation[] = (candidates ?? []).map((c: any) => ({
          id: c.studentId,
          name: c.name ?? 'Tanpa Nama',
          major: c.major ?? '-',
          university: c.university ?? '-',
          // skill yang dimiliki DAN diminta lowongan (bukan seluruh skill mahasiswa)
          skills: (c.matchedSkills ?? []).map((s: any) => s?.name).filter(Boolean).slice(0, 6),
          matchScore: Math.round(c.matchScore ?? 0),
          roleMatch: c.roleMatch ?? '-',
          status: toDisplayStatus(c.applicationStatus ?? null),
          hasApplied: !!c.applicationStatus,
          bestJobId: c.bestJobId ?? null,
          invitationStatus: c.invitationStatus ?? null,
        }))

        setRecommendations(mapped)
        setEmptyMessage('')
      } catch (err: any) {
        if (!aktif) return
        const pesan =
          err?.response?.data?.message ??
          'Gagal memuat rekomendasi kandidat. Pastikan server berjalan.'
        console.error('[RekomendasiKandidat] gagal memuat:', err?.response?.status, pesan)
        setRecommendations([])
        setEmptyMessage(pesan)
      }
    }

    muat()
    return () => { aktif = false }
  }, [])

const filteredCandidates = useMemo(() => {
    // "Semua Kandidat" = yang belum diputuskan; yang sudah diterima/ditolak
    // punya tabnya sendiri.
    const filtered = recommendations.filter((cand) => cand.status === activeFilter)
    return [...filtered].sort((a, b) =>
      sortOrder === 'Tertinggi' ? b.matchScore - a.matchScore : a.matchScore - b.matchScore,
    )
  }, [recommendations, activeFilter, sortOrder])

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleFilterChange = (filter: 'Pending' | 'Diterima' | 'Ditolak') => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const getPaginationGroup = () => {
    if (totalPages <= 0) return [1]
    const start = currentPage
    const end = Math.min(currentPage + 1, totalPages)
    let pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  // Mengundang kandidat ke lowongan dengan kecocokan tertinggi (bestJobId).
  // Kandidat yang sudah melamar diarahkan ke Daftar Pelamar; terima/tolak
  // lamaran dilakukan di halaman tersebut.
  const handleUndangMelamar = async (kandidat: Recommendation) => {
    if (kandidat.hasApplied) {
      navigate('/company/daftar-pelamar', { state: { filterRole: kandidat.roleMatch } })
      return
    }
    if (!kandidat.bestJobId) {
      window.alert('Tidak ada lowongan aktif yang cocok untuk mengundang kandidat ini.')
      return
    }
    if (!window.confirm(`Undang ${kandidat.name} untuk melamar posisi ${kandidat.roleMatch}?`)) return

    setInvitingId(kandidat.id)
    try {
      await invitationApi.invite(kandidat.bestJobId, kandidat.id)
      setInvitedIds((prev) => [...prev, kandidat.id])
    } catch (err: any) {
      window.alert(err?.response?.data?.message ?? 'Gagal mengirim undangan.')
    } finally {
      setInvitingId(null)
    }
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
        
        <button 
          onClick={() => setSortOrder(prev => prev === 'Tertinggi' ? 'Terendah' : 'Tertinggi')}
          className="w-10 h-10 rounded-xl bg-[#f8faff] border border-[#e4e9f4] text-[#7b8191] hover:text-[#111827] hover:border-[#cbd5e1] flex items-center justify-center shrink-0 transition mr-1"
          title="Urutkan berdasarkan Match Score"
        >
          <Filter size={18} />
        </button>
      </div>

      {activeFilter === 'Pending' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="text-sm font-bold text-[#111827]">
              Kandidat Teratas <span className="text-[#7b8191] font-medium ml-1">({filteredCandidates.length} ditemukan)</span>
            </div>
            <div className="text-sm text-[#7b8191]">
              Urutkan berdasarkan: <span className="font-bold text-[#111827]">Match {sortOrder} %</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
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
                  {/* Tombol mengikuti status kandidat, bukan tab yang aktif —
                      karena tab "Semua Kandidat" kini berisi semua status. */}
                  {candidate.status === 'Diterima' ? (
                    <button className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-default">
                      <CheckCircle2 size={16} /> Telah Diterima
                    </button>
                  ) : candidate.status === 'Ditolak' ? (
                    <button className="w-full py-2.5 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-default">
                      <XCircle size={16} /> Ditolak
                    </button>
                  ) : candidate.hasApplied ? (
                    <button
                      onClick={() => handleUndangMelamar(candidate)}
                      className="w-full py-2.5 bg-[#eef4ff] border border-[#d0e0ff] text-[#0f5ce0] text-sm font-bold rounded-xl hover:bg-[#dbe7ff] transition active:scale-95"
                    >
                      Sudah Melamar
                    </button>
                  ) : candidate.invitationStatus === 'pending' ? (
                    <button
                      disabled
                      title="Kandidat ini sudah diundang dan menunggu jawaban"
                      className="w-full py-2.5 bg-[#fffbe6] border border-amber-200 text-[#f59e0b] text-sm font-bold rounded-xl cursor-not-allowed"
                    >
                      Sudah Diundang
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUndangMelamar(candidate)}
                      disabled={invitingId === candidate.id || invitedIds.includes(candidate.id)}
                      className="w-full py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-sm font-bold rounded-xl transition shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {invitedIds.includes(candidate.id) ? 'Undangan Terkirim' : 'Undang Melamar'}
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/company/detail-kandidat/${candidate.id}`)}
                    className="w-full py-2.5 bg-white hover:bg-gray-50 border border-[#e4e9f4] text-[#5b6170] hover:text-[#111827] text-sm font-bold rounded-xl transition shadow-sm active:scale-95"
                  >
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
                {emptyMessage ||
                  (activeFilter === 'Pending'
                    ? 'Belum ada mahasiswa yang dapat ditampilkan. Pastikan perusahaan Anda memiliki lowongan aktif.'
                    : `Belum ada kandidat dengan status "${activeFilter}" pada saat ini.`)}
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