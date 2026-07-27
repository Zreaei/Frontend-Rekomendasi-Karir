import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Briefcase, X, Check, ChevronDown, ChevronUp, ExternalLink, User, Award } from 'lucide-react'
import { CompanyService, rejectRecommendation, acceptRecommendationAsApplicant, type Recommendation, type CandidateAcademicDetail } from './CompanyData'

const toTitleCase = (value: string): string => {
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const Company_DetailKandidat = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [kandidat, setKandidat] = useState<Recommendation | null>(null)
  const [detail, setDetail] = useState<CandidateAcademicDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    CompanyService.getCandidateDetailById(Number(id)).then(result => {
      setKandidat(result ? result.kandidat : null)
      setDetail(result ? result.detail : null)
      setLoading(false)
    })
  }, [id])

  const [openIds, setOpenIds] = useState<number[]>([1, 2, 3])

  const toggleItem = (itemId: number) => {
    setOpenIds(prev => prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId])
  }

  const inisial = useMemo(() => {
    if (!kandidat) return ''
    return kandidat.name
      .trim()
      .split(/\s+/)
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [kandidat])

  const handleTolak = () => {
    if (!kandidat) return
    rejectRecommendation(kandidat.id)
    navigate('/company/rekomendasi-kandidat')
  }

  const handleTerima = () => {
    if (!kandidat) return
    acceptRecommendationAsApplicant(kandidat)
    navigate('/company/daftar-pelamar')
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <User size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#111827]">Memuat data kandidat...</h2>
        </div>
      </div>
    )
  }

  if (!kandidat || !detail) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <User size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#111827]">Kandidat tidak ditemukan</h2>
          <p className="text-sm text-[#7b8191] mt-1">Kandidat ini mungkin sudah dipindahkan atau tidak lagi tersedia.</p>
        </div>
        <button
          onClick={() => navigate('/company/rekomendasi-kandidat')}
          className="px-5 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-sm font-bold rounded-xl transition shadow-sm active:scale-95"
        >
          Kembali ke Rekomendasi Kandidat
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12">

      <button
        onClick={() => navigate('/company/rekomendasi-kandidat')}
        className="flex items-center gap-2 text-sm font-semibold text-[#5b6170] hover:text-[#111827] transition w-fit"
        >
         Kembali ke Rekomendasi Kandidat
      </button>

      <div className="bg-white rounded-2xl border border-[#e4e9f4] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-[60px] h-[60px] rounded-2xl bg-[#eef4ff] border border-[#d0e0ff] text-[#0f5ce0] flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
            {inisial}
          </div>
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold text-[#111827] truncate">{kandidat.name}</h1>
            <div className="flex items-center gap-1.5 text-sm text-[#5b6170] mt-1">
              <GraduationCap size={15} />
              <span className="truncate">{kandidat.university}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#5b6170] mt-0.5">
              <Briefcase size={15} />
              <span className="truncate">Melamar untuk: {toTitleCase(kandidat.roleMatch)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleTolak}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition active:scale-95"
          >
            <X size={16} /> Tolak
          </button>
          <button
            onClick={handleTerima}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-md active:scale-95"
          >
            <Check size={16} /> Terima
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-1 bg-white rounded-2xl border border-[#e4e9f4] shadow-sm flex flex-col divide-y divide-[#f1f4f9]">
          <div className="p-6">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wide flex items-center gap-2">
              <User size={16} className="text-[#0f5ce0]" /> Profil Mahasiswa
            </h2>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-2">Biografi</h3>
            <p className="text-sm text-[#5b6170] leading-relaxed">{detail.bio}</p>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-3">Riwayat Pendidikan</h3>
            <div className="text-sm font-bold text-[#111827]">{detail.periode}</div>
            <div className="text-sm text-[#5b6170] mt-1">{detail.jenjang}</div>
            <div className="text-xs text-[#7b8191] mt-1">IPK: {detail.ipk}</div>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-3">Keahlian Teknis</h3>
            <div className="flex flex-wrap gap-2">
              {kandidat.skills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#f1f4f9] text-[#5b6170] text-[10px] font-bold rounded-md uppercase tracking-wider border border-[#e4e9f4]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-3">Sertifikat</h3>
            <div className="flex flex-col gap-2">
              {detail.sertifikat.map((sert, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <Award size={15} className="text-[#0f5ce0] shrink-0" />
                    <span className="text-xs font-semibold text-[#111827] truncate">{sert.nama}</span>
                  </div>
                  <a
                    href={sert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#0f5ce0] hover:underline shrink-0"
                  >
                    Lihat <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e4e9f4] shadow-sm flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[#f1f4f9]">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wide">Analisis Kesesuaian CLO</h2>
            <span className="px-3 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg">
              MATCH SCORE: {kandidat.matchScore}%
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[#f1f4f9]">
            {detail.cloAnalysis.map((item, idx) => {
              const isOpen = openIds.includes(item.id)
              return (
                <div key={item.id} className="p-6">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <h3 className="text-sm font-bold text-[#111827]">{idx + 1}. {item.matkul}</h3>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 bg-[#eef4ff] text-[#0f5ce0] text-xs font-bold rounded-lg">
                        {item.skor}%
                      </span>
                      {isOpen ? <ChevronUp size={18} className="text-[#7b8191]" /> : <ChevronDown size={18} className="text-[#7b8191]" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 bg-[#f8faff] border border-[#e4e9f4] rounded-xl p-4 flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-bold text-[#a0a6b5] uppercase tracking-wider">Matkul</div>
                          <div className="text-sm font-bold text-[#111827] mt-1">{item.matkul}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-[#a0a6b5] uppercase tracking-wider">Nilai</div>
                          <div className="text-sm font-bold text-[#111827] mt-1">{item.nilai}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[#a0a6b5] uppercase tracking-wider">{item.kode}</div>
                        <p className="text-sm text-[#5b6170] mt-1 leading-relaxed">{item.deskripsi}</p>
                      </div>
                      <p className="text-xs text-[#7b8191] italic">
                        Kontribusi {item.skor}% x nilai {item.nilai} = {item.skor}% kontribusi
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Company_DetailKandidat