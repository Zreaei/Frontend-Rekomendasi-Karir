import { useState, useMemo, useEffect } from 'react'
import { TrendingUp, Users, Briefcase, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getApplicantSource, CompanyService, type Applicant } from './CompanyData'

const CompanyDashboard = () => {
  const navigate = useNavigate()

  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [lowonganAktif, setLowonganAktif] = useState(0)
  const [totalPelamar, setTotalPelamar] = useState(0)
  const [rekomendasiKandidat, setRekomendasiKandidat] = useState(0)

  useEffect(() => {
    CompanyService.getApplicants().then(data => setApplicants(data))
    CompanyService.getDashboardSummary().then(data => {
      setLowonganAktif(data.lowonganAktif)
      setTotalPelamar(data.totalPelamar)
      setRekomendasiKandidat(data.rekomendasiKandidat)
    })
  }, [])

  const topCandidates = useMemo(() => {
    return [...applicants]
      .filter(a => getApplicantSource(a) === 'Lamar' && a.status === 'Pending')
      .sort((a, b) => b.match - a.match)
      .slice(0, 5)
  }, [applicants])

  return (
    <div className="w-full flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Ringkasan Perusahaan</h1>
        <p className="text-sm text-[#5b6170] mt-1">Real-time metrics for your hiring ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: <Briefcase size={22} />, label: 'Lowongan Aktif', value: lowonganAktif.toString() },
          { icon: <Users size={22} />, label: 'Total Pelamar', value: totalPelamar.toLocaleString('id-ID') },
          { icon: <TrendingUp size={22} />, label: 'Rekomendasi Kandidat', value: rekomendasiKandidat.toString() },
        ].map((m, i) => (
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

        <div className="divide-y divide-[#f1f4f9]">
          {topCandidates.map((k, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 hover:bg-[#fafbfe] transition">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-[12px] bg-[#eef4ff] flex items-center justify-center text-[#0f5ce0] shrink-0 border border-[#d0e0ff]">
                  <User size={28} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-[#111827]">{k.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      k.status === 'Diterima' ? 'bg-[#e6f9f0] text-[#10b981]' :
                      k.status === 'Ditolak' ? 'bg-[#fee2e2] text-[#ef4444]' : 'bg-[#fffbeb] text-[#f59e0b]'
                    }`}>
                      {k.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#5b6170] mt-0.5">{k.university}</p>
                  
                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(k.skills || []).map((s, si) => (
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
                  <button className="bg-[#0f5ce0] text-white text-[12px] font-bold py-2.5 px-4 rounded-[8px] hover:bg-[#0d4ebf] transition shadow-sm">
                    Undang Melamar
                  </button>
                  <button 
                    onClick={() => navigate('/company/daftar-pelamar')}
                    className="bg-white text-[#5b6170] border border-[#e4e9f4] text-[12px] font-bold py-2.5 px-4 rounded-[8px] hover:bg-[#f8faff] transition"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default CompanyDashboard