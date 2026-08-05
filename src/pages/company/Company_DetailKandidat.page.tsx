import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { GraduationCap, Briefcase, ChevronDown, ChevronUp, ExternalLink, User, Award, Loader2, AlertCircle,  X, Check, } from 'lucide-react'
import { matchingApi, invitationApi } from '../../services/company.service'

const toTitleCase = (value: string): string => {
  return String(value ?? '')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Satu baris analisis = satu CLO (bukan satu matkul).
interface CloItem {
  id: number
  matkul: string
  subjectCode: string
  cloCode: string
  nilai: string
  semester?: number | null
  deskripsi: string
  skor: number
  method: 'semantic' | 'skill'
  matchedRequirement: string | null
}

interface CandidateData {
  studentId: string
  name: string
  email: string | null
  nim: string | null
  major: string | null
  semester: number | null
  gpa: number | null
  bio: string | null
  university: string | null
  matchScore: number
  roleMatch: string
  applicationId: string | null
  applicationStatus: string | null
  jobId: string | null
}

interface CertItem {
  id: string
  title: string
  issuer: string | null
  status: string
  fileUrl: string | null
}

const Company_DetailKandidat = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId') ?? undefined

  const [kandidat, setKandidat] = useState<CandidateData | null>(null)
  const [certificates, setCertificates] = useState<CertItem[]>([])
  const [cloAnalysis, setCloAnalysis] = useState<CloItem[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [invited, setInvited] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data: any = await matchingApi.candidateDetail(id, jobId)
      setKandidat(data?.candidate ?? null)
      setCertificates(data?.certificates ?? [])
      setCloAnalysis(data?.cloAnalysis ?? [])
      setSkills((data?.candidate?.skills ?? []).map((s: any) => s?.name).filter(Boolean))
    } catch (err: any) {
      setKandidat(null)
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat detail kandidat.')
    } finally {
      setLoading(false)
    }
  }, [id, jobId])

  useEffect(() => {
    loadData()
  }, [loadData])

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

  const sudahMelamar = !!kandidat?.applicationId

  // Mengundang kandidat ke lowongan dengan kecocokan tertinggi (jobId).
  // Kandidat yang sudah melamar diarahkan ke Daftar Pelamar; terima/tolak
  // lamaran dilakukan di halaman tersebut.
  const handleUndangMelamar = async () => {
    if (!kandidat) return
    if (sudahMelamar) {
      navigate('/company/daftar-pelamar', { state: { filterRole: kandidat.roleMatch } })
      return
    }
    if (!kandidat.jobId) {
      setActionError('Tidak ada lowongan aktif yang cocok untuk mengundang kandidat ini.')
      return
    }
    if (!window.confirm(`Undang ${kandidat.name} untuk melamar posisi ${toTitleCase(kandidat.roleMatch)}?`)) return

    setBusy(true)
    setActionError('')
    try {
      await invitationApi.invite(kandidat.jobId, kandidat.studentId)
      setInvited(true)
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? 'Gagal mengirim undangan.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <Loader2 size={32} className="animate-spin text-[#0f5ce0]" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#111827]">Memuat data kandidat...</h2>
        </div>
      </div>
    )
  }

  if (!kandidat) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
          <User size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#111827]">Kandidat tidak ditemukan</h2>
          <p className="text-sm text-[#7b8191] mt-1">
            {loadError || 'Kandidat ini mungkin sudah dipindahkan atau tidak lagi tersedia.'}
          </p>
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

      {/* Pesan gagal saat mengirim undangan */}
      {actionError && (
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{actionError}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#e4e9f4] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-[60px] h-[60px] rounded-2xl bg-[#eef4ff] border border-[#d0e0ff] text-[#0f5ce0] flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
            {inisial}
          </div>
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold text-[#111827] truncate">{kandidat.name}</h1>
            <div className="flex items-center gap-1.5 text-sm text-[#5b6170] mt-1">
              <GraduationCap size={15} />
              <span className="truncate">{kandidat.university ?? '-'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#5b6170] mt-0.5">
              <Briefcase size={15} />
              <span className="truncate">
                {sudahMelamar ? 'Melamar untuk: ' : 'Paling cocok untuk: '}
                {toTitleCase(kandidat.roleMatch)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {sudahMelamar ? (
            <button
              onClick={handleUndangMelamar}
              className="px-6 py-2.5 bg-[#eef4ff] border border-[#d0e0ff] text-[#0f5ce0] text-sm font-bold rounded-xl hover:bg-[#dbe7ff] transition active:scale-95"
            >
              Sudah Melamar
            </button>
          ) : (
            <button
              onClick={handleUndangMelamar}
              disabled={busy || invited}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-sm font-bold rounded-xl transition shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {invited ? 'Undangan Terkirim' : 'Undang Melamar'}
            </button>
          )}
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
            <p className="text-sm text-[#5b6170] leading-relaxed">
              {kandidat.bio || 'Mahasiswa belum mengisi biografi.'}
            </p>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-3">Riwayat Pendidikan</h3>
            <div className="text-sm font-bold text-[#111827]">
              {kandidat.semester ? `Semester ${kandidat.semester}` : 'Semester belum diisi'}
            </div>
            <div className="text-sm text-[#5b6170] mt-1">{kandidat.major ?? '-'}</div>
            <div className="text-xs text-[#7b8191] mt-1">
              NIM: {kandidat.nim ?? '-'} · IPK: {kandidat.gpa ?? '-'}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-3">Keahlian Teknis</h3>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? skills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#f1f4f9] text-[#5b6170] text-[10px] font-bold rounded-md uppercase tracking-wider border border-[#e4e9f4]">
                  {skill}
                </span>
              )) : (
                <span className="text-xs text-[#a0a6b5]">Belum ada keahlian tercatat.</span>
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-3">Sertifikat</h3>
            <div className="flex flex-col gap-2">
              {certificates.length > 0 ? certificates.map((sert) => (
                <div key={sert.id} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <Award size={15} className="text-[#0f5ce0] shrink-0" />
                    <span className="text-xs font-semibold text-[#111827] truncate">{sert.title}</span>
                  </div>
                  {sert.fileUrl ? (
                    <a
                      href={sert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-[#0f5ce0] hover:underline shrink-0"
                    >
                      Lihat <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-[10px] font-bold text-[#a0a6b5] shrink-0">Tanpa berkas</span>
                  )}
                </div>
              )) : (
                <span className="text-xs text-[#a0a6b5]">Belum ada sertifikat terverifikasi.</span>
              )}
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

          {cloAnalysis.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-semibold text-[#5b6170]">Belum ada data CLO</p>
              <p className="text-xs text-[#7b8191] mt-1">
                Analisis muncul setelah nilai mata kuliah mahasiswa diinput dan mata kuliahnya memiliki CLO.
              </p>
            </div>
          ) : (
          <div className="flex flex-col divide-y divide-[#f1f4f9]">
            {cloAnalysis.map((item, idx) => {
              const isOpen = openIds.includes(item.id)
              return (
                <div key={item.id} className="p-6">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <h3 className="text-sm font-bold text-[#111827]">
                      {idx + 1}. {item.matkul} <span className="text-[#0f5ce0]">{item.cloCode}</span>
                    </h3>
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
                        <div className="text-[10px] font-bold text-[#a0a6b5] uppercase tracking-wider">{item.cloCode}</div>
                        <p className="text-sm text-[#5b6170] mt-1 leading-relaxed">{item.deskripsi}</p>
                      </div>
                      <p className="text-xs text-[#7b8191] italic">
                        {item.method === 'semantic' && item.matchedRequirement
                          ? `Kemiripan ${item.skor}% dengan persyaratan: "${item.matchedRequirement}".`
                          : `Mata kuliah asal CLO ini menutup ${item.skor}% kebutuhan keahlian pada posisi ${toTitleCase(kandidat.roleMatch)}.`}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default Company_DetailKandidat