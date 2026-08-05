import { useState, useEffect, useCallback, useMemo } from 'react'
import { TrendingUp, Users, Briefcase, User, Loader2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { jobApi, applicationApi, matchingApi } from '../../services/company.service'

// ============================================================
// HELPER
// ============================================================

// Status backend -> label & warna badge yang dipakai tampilan.
const STATUS_BADGE: Record<string, { text: string; cls: string }> = {
  submitted: { text: 'Terkirim', cls: 'bg-[#eef4ff] text-[#0f5ce0]' },
  processing: { text: 'Diproses', cls: 'bg-[#fffbeb] text-[#f59e0b]' },
  accepted: { text: 'Diterima', cls: 'bg-[#e6f9f0] text-[#10b981]' },
  rejected: { text: 'Ditolak', cls: 'bg-[#fee2e2] text-[#ef4444]' },
}

const pickName = (app: any): string =>
  app?.student?.user?.name ?? app?.student?.name ?? 'Tanpa Nama'

const pickUniversity = (app: any): string =>
  app?.student?.university?.name ??
  app?.student?.major ??
  app?.student?.nim ??
  'Data kampus belum tersedia'

const pickMatch = (app: any): number => {
  if (typeof app?.matchScore === 'number') return Math.round(app.matchScore)
  let snap = app?.matchSnapshot
  if (typeof snap === 'string') {
    try { snap = JSON.parse(snap) } catch { snap = null }
  }
  const score = snap?.score ?? snap?.matchScore ?? snap?.matchPercentage
  return typeof score === 'number' ? Math.round(score) : 0
}

// Keahlian yang dimiliki kandidat DAN diminta lowongan (dihitung backend).
// Cadangan: matchSnapshot, lalu daftar skill mahasiswa.
const pickSkills = (app: any): string[] => {
  const matched = app?.matchedSkills
  if (Array.isArray(matched)) {
    return matched.map((s: any) => (typeof s === 'string' ? s : s?.name)).filter(Boolean).slice(0, 3)
  }
  let snap = app?.matchSnapshot
  if (typeof snap === 'string') {
    try { snap = JSON.parse(snap) } catch { snap = null }
  }
  const fromSnap = snap?.matchedSkills ?? snap?.matched ?? null
  if (Array.isArray(fromSnap)) {
    return fromSnap.map((s: any) => (typeof s === 'string' ? s : s?.name)).filter(Boolean).slice(0, 3)
  }
  const fromStudent = app?.student?.skills
  if (Array.isArray(fromStudent)) {
    return fromStudent.map((s: any) => s?.skill?.name ?? s?.name).filter(Boolean).slice(0, 3)
  }
  return []
}

interface TopCandidate {
  applicationId: string
  studentId: string
  name: string
  university: string
  status: string
  match: number
  role: string
  skills: string[]
}

// ============================================================
// HALAMAN
// ============================================================
const CompanyDashboard = () => {
  const navigate = useNavigate()

  const [activeJobCount, setActiveJobCount] = useState(0)
  const [totalPelamar, setTotalPelamar] = useState(0)
  const [rekomendasiKandidat, setRekomendasiKandidat] = useState(0)
  const [topCandidates, setTopCandidates] = useState<TopCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Tiga request: daftar lowongan, seluruh pelamar perusahaan, dan talent pool.
  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const jobs = (await jobApi.listMine()) ?? []
      setActiveJobCount(jobs.filter((j: any) => j.status === 'active').length)

      const { applications, summary } = await applicationApi.listByCompany()
      const list = applications ?? []
      setTotalPelamar(summary?.total ?? list.length)

      // Pelamar teratas = yang belum diputuskan (belum diterima/ditolak),
      // supaya kartu ini jadi antrean kerja HRD, bukan sekadar riwayat.
      const belumDiputuskan = list.filter(
        (app: any) => app.status !== 'accepted' && app.status !== 'rejected',
      )

      setTopCandidates(
        belumDiputuskan
          .map((app: any) => ({
            applicationId: app.id,
            studentId: app?.student?.id ?? '',
            name: pickName(app),
            university: pickUniversity(app),
            status: app.status,
            match: pickMatch(app),
            role: app?.job?.title ?? '-',
            skills: pickSkills(app),
          }))
          .sort((a: TopCandidate, b: TopCandidate) => b.match - a.match)
          .slice(0, 5),
      )

      // "Rekomendasi Kandidat" = mahasiswa hasil mesin pencocokan dengan skor >= 85
      // pada lowongan aktif (sudah unik per mahasiswa dari backend).
      const { candidates } = await matchingApi.companyCandidates()
      setRekomendasiKandidat((candidates ?? []).filter((c: any) => (c?.matchScore ?? 0) >= 80).length)
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat data dashboard. Pastikan server berjalan.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const metrics = useMemo(
    () => [
      { icon: <Briefcase size={22} />, label: 'Lowongan Aktif', value: activeJobCount.toLocaleString('id-ID') },
      { icon: <Users size={22} />, label: 'Total Pelamar', value: totalPelamar.toLocaleString('id-ID') },
      { icon: <TrendingUp size={22} />, label: 'Rekomendasi Kandidat', value: rekomendasiKandidat.toString() },
    ],
    [activeJobCount, totalPelamar, rekomendasiKandidat],
  )

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat ringkasan perusahaan...</p>
      </div>
    )
  }

  // ---------- Error ----------
  if (loadError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl max-w-md">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Gagal memuat data</p>
            <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="px-6 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] transition"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Ringkasan Perusahaan</h1>
        <p className="text-sm text-[#5b6170] mt-1">Pantau ekosistem rekrutmen Anda secara Real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 flex items-center gap-4 shadow-sm">
            <div className="bg-[#eef4ff] p-3 rounded-[10px] text-[#0f5ce0] shrink-0">
              {m.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#7b8191] uppercase tracking-wider">{m.label}</p>
              <p className="text-2xl font-bold text-[#111827] mt-0.5">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] overflow-hidden shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#f1f4f9]">
          <h2 className="text-[16px] font-bold text-[#111827]">Pelamar Teratas (5 Tertinggi)</h2>
          <button
            onClick={() => navigate('/company/daftar-pelamar')}
            className="text-sm text-[#0f5ce0] hover:underline font-semibold"
          >
            Lihat Semua Kandidat 
          </button>
        </div>

        {topCandidates.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-[#5b6170]">Belum ada pelamar</p>
            <p className="text-xs text-[#7b8191] mt-1">
              Pelamar akan muncul di sini setelah mahasiswa melamar lowongan Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f4f9]">
            {topCandidates.map((k) => {
              const badge = STATUS_BADGE[k.status] ?? { text: k.status, cls: 'bg-[#fffbeb] text-[#f59e0b]' }
              return (
                <div key={k.applicationId} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 hover:bg-[#fafbfe] transition">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-[12px] bg-[#eef4ff] flex items-center justify-center text-[#0f5ce0] shrink-0 border border-[#d0e0ff]">
                      <User size={28} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-bold text-[#111827]">{k.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#5b6170] mt-0.5">{k.university}</p>
                      
                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {k.skills.map((s, si) => (
                          <span key={si} className="text-[10px] font-semibold bg-[#f1f4f9] text-[#5b6170] px-2 py-0.5 rounded-[4px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 lg:gap-10 shrink-0 justify-between lg:justify-end">
                    {/* Match + Role badge */}
                    <div className="flex flex-col items-center gap-1.5 w-[180px]">
                      <p className="text-[34px] font-black text-[#0f5ce0] leading-none">{k.match}%</p>
                      <p className="text-[9px] font-bold text-[#7b8191] tracking-widest uppercase">Match For</p>
                      <div className="w-full bg-[#eef4ff] text-[#0f5ce0] text-[10px] font-bold px-2 py-1.5 rounded-[6px] text-center truncate">
                        {k.role}
                      </div>
                    </div>

                    {/* Tombol aksi */}
                    <div className="flex flex-col gap-2 w-[140px]">
                      <button
                        onClick={() => navigate('/company/daftar-pelamar', { state: { filterRole: k.role } })}
                        className="bg-[#0f5ce0] text-white text-[12px] font-bold py-2.5 px-4 rounded-[8px] hover:bg-[#0d4ebf] transition shadow-sm"
                      >
                        Proses Lamaran
                      </button>
                      <button 
                        onClick={() => k.studentId && navigate(`/company/detail-kandidat/${k.studentId}`)}
                        className="bg-white text-[#5b6170] border border-[#e4e9f4] text-[12px] font-bold py-2.5 px-4 rounded-[8px] hover:bg-[#f8faff] transition"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

export default CompanyDashboard