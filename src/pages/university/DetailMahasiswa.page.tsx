import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Edit2, GraduationCap, BarChart2, Award, History, CheckCircle2, FileText, Calendar, Mail, ExternalLink } from 'lucide-react'
import { UniversityService, type StudentDetail } from './UniversityData'

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: ReactNode
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6">
    <div className="w-14 h-14 rounded-full bg-[#f8faff] flex items-center justify-center text-[#0f5ce0] mb-4">
      {icon}
    </div>
    <h3 className="text-base font-bold text-[#111827]">{title}</h3>
    <p className="text-sm text-[#7b8191] mt-1 max-w-[360px] leading-relaxed">{description}</p>
    <button
      onClick={onAction}
      className="mt-5 px-5 py-2.5 bg-[#0f5ce0] text-white text-sm font-bold rounded-xl hover:bg-[#0d4ebf] transition shadow-sm active:scale-95"
    >
      {actionLabel}
    </button>
  </div>
)

const DetailMahasiswa = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [studentData, setStudentData] = useState<StudentDetail | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    UniversityService.getStudentDetail(id).then((data) => {
      setStudentData(data)
      setIsLoading(false)
    })
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#7b8191]">Memuat data mahasiswa...</p>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-[#7b8191] mb-4">Data mahasiswa tidak ditemukan.</p>
        <button onClick={() => navigate('/university/manajemen-mahasiswa')} className="px-4 py-2 bg-[#0f5ce0] text-white rounded-xl">Kembali</button>
      </div>
    )
  }

  const handleEditProfile = () => {
    navigate('/university/edit-mahasiswa', { state: { studentData } })
  }

  const handleOpenCertificate = (url?: string) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">

      <div className="flex items-center gap-2 text-sm text-[#7b8191] font-medium">
        <button onClick={() => navigate('/university/manajemen-mahasiswa')} className="hover:text-[#0f5ce0] transition">
          Manajemen Mahasiswa
        </button>
        <ChevronRight size={16} />
        <span className="text-[#111827] font-bold">Detail Mahasiswa</span>
      </div>

      <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start w-full">

          <div className="relative shrink-0">
            {studentData.avatarUrl ? (
              <img src={studentData.avatarUrl} alt={studentData.name} className="w-28 h-28 rounded-2xl object-cover border border-[#e4e9f4]" />
            ) : (
              <div className={`w-28 h-28 rounded-2xl ${studentData.bgColor} flex items-center justify-center text-4xl font-bold border border-[#e4e9f4]`}>
                {studentData.initial}
              </div>
            )}
            {studentData.status === 'Active' && (
              <div className="absolute -top-2 -right-2 bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white uppercase tracking-wider">
                AKTIF
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <h1 className="text-2xl font-bold text-[#111827]">{studentData.name}</h1>
            <p className="text-[15px] font-bold text-[#0f5ce0] mt-0.5">{studentData.faculty}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 mt-5">
              <div className="flex items-center gap-2 text-sm text-[#5b6170]">
                <FileText size={16} className="text-[#a0a6b5]" />
                <span className="text-[#7b8191]">NIM:</span>
                <span className="font-semibold text-[#111827]">{studentData.nim}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5b6170]">
                <GraduationCap size={16} className="text-[#a0a6b5]" />
                <span className="text-[#7b8191]">Jurusan:</span>
                <span className="font-semibold text-[#111827]">{studentData.major}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5b6170]">
                <Calendar size={16} className="text-[#a0a6b5]" />
                <span className="text-[#7b8191]">Angkatan:</span>
                <span className="font-semibold text-[#111827]">{studentData.year}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5b6170]">
                <Mail size={16} className="text-[#a0a6b5]" />
                <span className="text-[#7b8191]">Email:</span>
                <span className="font-semibold text-[#111827]">{studentData.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 mt-4 md:mt-0">
          <div className="bg-[#f8faff] border border-[#eef4ff] rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-[#0f5ce0] uppercase tracking-widest mb-1">IPK Kumulatif</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black text-[#111827]">{studentData.gpa}</span>
              <span className="text-sm font-bold text-[#a0a6b5]">/ 4.0</span>
            </div>
          </div>
          <button
            onClick={handleEditProfile}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-[#e4e9f4] text-[#111827] text-sm font-bold rounded-xl hover:bg-gray-50 transition shadow-sm active:scale-95"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm p-7 flex flex-col justify-between">
          <div className="w-14 h-14 rounded-2xl bg-[#f8faff] flex items-center justify-center text-[#0f5ce0] mb-7">
            <GraduationCap size={26} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-wider">Total SKS</p>
            <p className="text-[42px] font-black text-[#111827] mt-1 leading-none">{studentData.totalSks}</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm p-7 flex flex-col justify-between">
          <div className="w-14 h-14 rounded-2xl bg-[#f8faff] flex items-center justify-center text-[#0f5ce0] mb-7">
            <BarChart2 size={26} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-wider">Total CLO</p>
            <p className="text-[42px] font-black text-[#111827] mt-1 leading-none">{studentData.totalClo}</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm p-7 flex flex-col justify-between">
          <div className="w-14 h-14 rounded-2xl bg-[#f8faff] flex items-center justify-center text-[#0f5ce0] mb-7">
            <Award size={26} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-wider">Certifications</p>
            <p className="text-[42px] font-black text-[#111827] mt-1 leading-none">{studentData.certificationsCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#e4e9f4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#0f5ce0] text-white flex items-center justify-center shrink-0">
              <BarChart2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Analisis Capaian Pembelajaran (CLO)</h2>
              <p className="text-sm text-[#7b8191] mt-0.5">Evaluasi kompetensi berdasarkan kurikulum terbaru program studi</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition shrink-0">
            Historical Data <History size={16} />
          </button>
        </div>

        {studentData.cloDetails.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap">Kode CLO</th>
                  <th className="px-6 py-4 whitespace-nowrap">Mata Kuliah</th>
                  <th className="px-6 py-4">Deskripsi Capaian Pembelajaran</th>
                  <th className="px-6 py-4 whitespace-nowrap">Skill Yang Didapat</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f9]">
                {studentData.cloDetails.map((clo) => (
                  <tr key={clo.id} className="hover:bg-[#fafbfe] transition">
                    <td className="px-6 py-5 whitespace-nowrap align-middle">
                      <span className="text-sm font-bold text-[#0f5ce0]">{clo.code}</span>
                    </td>
                    <td className="px-6 py-5 align-middle max-w-[200px]">
                      <p className="text-sm font-bold text-[#111827] leading-snug">{clo.course}</p>
                    </td>
                    <td className="px-6 py-5 align-top max-w-[350px]">
                      <p className="text-sm text-[#5b6170] leading-relaxed">{clo.description}</p>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <div className="flex flex-wrap gap-2 items-center">
                        {clo.skills.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[#f1f4f9] text-[#5b6170] text-[10px] font-bold rounded-md whitespace-nowrap">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap align-middle text-center">
                      <span className="text-lg font-black text-[#111827]">{clo.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<BarChart2 size={24} />}
            title="Belum Ada Nilai CLO"
            description="Capaian pembelajaran mahasiswa ini akan tampil di sini setelah nilainya diinput lewat Manajemen Nilai."
            actionLabel="Ke Manajemen Nilai"
            onAction={() => navigate('/university/manajemen-nilai')}
          />
        )}
      </div>

      <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#e4e9f4] flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#0f5ce0] text-white flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Sertifikasi Terverifikasi</h2>
            <p className="text-sm text-[#7b8191] mt-0.5">Sertifikat industri yang telah diverifikasi oleh pihak universitas</p>
          </div>
        </div>

        {studentData.certifications.length > 0 ? (
          <div className="p-6 flex flex-wrap gap-5">
            {studentData.certifications.map((cert) => (
              <div key={cert.id} className="w-full sm:w-[260px] bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm p-4 flex flex-col">
                <div className="w-full h-32 bg-[#f8faff] border border-[#e4e9f4] rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                  <Award size={32} className="text-[#a0a6b5] opacity-30" />
                </div>

                <h3 className="text-sm font-bold text-[#111827] leading-snug line-clamp-2">{cert.title}</h3>
                <p className="text-[11px] text-[#7b8191] mt-1 line-clamp-1">{cert.issuer} • {cert.date}</p>

                <div className="flex items-center justify-between mt-auto pt-5">
                  <span className={`px-2.5 py-1 text-[9px] font-extrabold rounded-md uppercase tracking-wider ${
                    cert.status === 'VERIFIED' ? 'bg-[#e6f9f0] text-[#10b981]' : 'bg-[#fffbeb] text-[#f59e0b]'
                  }`}>
                    {cert.status === 'VERIFIED' ? 'VERIFIED' : 'PENDING REVIEW'}
                  </span>

                  {cert.status === 'VERIFIED' ? (
                    <button
                      onClick={() => handleOpenCertificate(cert.url)}
                      disabled={!cert.url}
                      className={`flex items-center gap-1 text-[11px] font-bold transition ${
                        cert.url ? 'text-[#0f5ce0] hover:text-[#0d4ebf] cursor-pointer' : 'text-[#c2c8d6] cursor-not-allowed'
                      }`}
                    >
                      View <ExternalLink size={12} />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/university/verifikasi-sertifikat')}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#111827] hover:text-[#0f5ce0] transition cursor-pointer"
                    >
                      Review <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Award size={24} />}
            title="Belum Ada Sertifikat"
            description="Sertifikat yang diunggah mahasiswa akan tampil di sini setelah diverifikasi lewat Verifikasi Sertifikat."
            actionLabel="Ke Verifikasi Sertifikat"
            onAction={() => navigate('/university/verifikasi-sertifikat')}
          />
        )}
      </div>

    </div>
  )
}

export default DetailMahasiswa