import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import {
  BadgeCheck,
  Briefcase,
  Building2,
  GraduationCap,
  MapPin,
  Rocket,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import {
  studentProfileApi,
  studentMatchingApi,
  studentApplicationApi,
  studentCertificateApi,
  type StudentProfile,
  type JobMatch,
  type MyCertificate,
} from '../../services/student.service'

const CERT_STATUS_LABEL: Record<string, { label: string; className: string }> = {
  approved: { label: 'Terverifikasi', className: 'text-[#047857]' },
  pending: { label: 'Diproses', className: 'text-[#b45a00]' },
  rejected: { label: 'Ditolak', className: 'text-[#d92d20]' },
}

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const StudentDashboard = () => {
  const user = useAuthStore((state) => state.user)

  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [certificates, setCertificates] = useState<MyCertificate[]>([])
  const [activeApplications, setActiveApplications] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let aktif = true
    Promise.allSettled([
      studentProfileApi.getProfile(),
      studentMatchingApi.listJobs(),
      studentCertificateApi.listMine(),
      studentApplicationApi.listMine(),
    ]).then(([p, j, c, a]) => {
      if (!aktif) return
      if (p.status === 'fulfilled') setProfile(p.value)
      if (j.status === 'fulfilled') setJobs(j.value)
      if (c.status === 'fulfilled') setCertificates(c.value)
      if (a.status === 'fulfilled') {
        setActiveApplications(
          a.value.filter((app) => app.status === 'pending' || app.status === 'processing').length,
        )
      }
      setLoading(false)
    })
    return () => { aktif = false }
  }, [])

  const totalSks = useMemo(
    () => (profile?.subjectsTaken ?? []).reduce((sum, s) => sum + (s.subject?.sks ?? 0), 0),
    [profile],
  )

  const verifiedCerts = certificates.filter((c) => c.status === 'approved').length

  const stats = [
    {
      title: 'Sertifikat Terverifikasi',
      value: String(verifiedCerts),
      icon: <BadgeCheck size={18} strokeWidth={2} />,
      accent: 'bg-[#ecfff8] text-[#0f766e]',
    },
    {
      title: 'Rekomendasi Pekerjaan',
      value: String(jobs.length),
      icon: <Rocket size={18} strokeWidth={2} />,
      accent: 'bg-[#eef5ff] text-[#0d6efd]',
    },
    {
      title: 'Lamaran Aktif',
      value: String(activeApplications).padStart(2, '0'),
      icon: <Briefcase size={18} strokeWidth={2} />,
      accent: 'bg-[#fff4e8] text-[#b45a00]',
    },
  ]

  const profileSummary = [
    { label: 'IPK', value: profile?.gpa != null ? Number(profile.gpa).toFixed(2) : '-' },
    { label: 'SKS', value: totalSks > 0 ? String(totalSks) : '-' },
  ]

  const verificationRows = certificates.slice(0, 3)
  const jobMatches = jobs.slice(0, 3)
  const firstName = (user?.name ?? profile?.user?.name ?? 'Mahasiswa').split(' ')[0]

  return (
    <StudentLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold leading-tight">Selamat datang kembali, {firstName}</h1>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed ">
            Pantau ringkasan profil, progres verifikasi, dan job match terbaik Anda dalam satu tampilan.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)]">
        <Card className="p-6 shadow-sm">
          <h2 className="text-[18px] font-bold ">Ringkasan Profil</h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {profileSummary.map((item) => (
              <div key={item.label} className="rounded-lg border border-[#d9dce2] px-4 py-4">
                <p className="text-[13px] uppercase tracking-wide text-[#5c6577]">{item.label}</p>
                <p className="mt-1 text-[22px] font-semibold ">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-[#d9dce2]" />

          <div className="grid gap-3 text-[14px] ">
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-0.5 text-[#0d6efd]" size={40} strokeWidth={2} aria-hidden="true" />
              <div>
                <p className="font-semibold ">{profile?.university?.name ?? 'Universitas belum terdata'}</p>
                <p className="mt-1 leading-relaxed">
                  {profile?.major ?? '-'}
                  {profile?.semester ? ` • Semester ${profile.semester}` : ''}
                  {profile?.nim ? ` • NIM ${profile.nim}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 text-[#0d6efd]" size={35} strokeWidth={2} aria-hidden="true" />
              <p className="leading-relaxed">
                {profile?.bio ?? 'Mahasiswa aktif yang sedang mempersiapkan karir.'}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.title} className="p-5 shadow-sm">
                <div className={`grid h-10 w-10 place-items-center rounded-full ${stat.accent}`} aria-hidden="true">
                  {stat.icon}
                </div>
                <p className="mt-6 text-[28px] font-bold leading-none ">{loading ? '...' : stat.value}</p>
                <p className="mt-1 text-[13px] text-[#4f5a6d]">{stat.title}</p>
              </Card>
            ))}
          </div>

          <Card className="p-6 shadow-sm">
            <SectionHeader
              title="Verifikasi Terbaru"
              action={
                <Link to="/student/certification" className="border-none bg-transparent text-[13px] font-semibold text-[#0d6efd]!">
                  Lihat Semua
                </Link>
              }
            />

            <div className="mt-4 overflow-hidden rounded-lg border border-[#d9dce2]">
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.75fr] gap-4 border-b border-[#d9dce2] bg-[#f7f9fc] px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#5c6577]">
                <span>Nama Sertifikat</span>
                <span>Penerbit</span>
                <span>Tanggal</span>
                <span>Status</span>
              </div>

              <div className="grid gap-0">
                {verificationRows.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[13px] text-[#5c6577]">
                    {loading ? 'Memuat sertifikat...' : 'Belum ada sertifikat yang diunggah.'}
                  </div>
                ) : (
                  verificationRows.map((row) => {
                    const status = CERT_STATUS_LABEL[row.status] ?? { label: row.status, className: 'text-[#4f5a6d]' }
                    return (
                      <div
                        key={row.id}
                        className="grid grid-cols-[1.2fr_1fr_0.8fr_0.75fr] gap-4 border-b border-[#d9dce2] px-4 py-4 text-[13px] last:border-b-0"
                      >
                        <span className="font-semibold ">{row.title}</span>
                        <span className="text-[#4f5a6d]">{row.issuer ?? '-'}</span>
                        <span className="text-[#4f5a6d]">{formatDate(row.created_at)}</span>
                        <span className={`inline-flex items-center justify-start text-[13px] font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <SectionHeader
        title="Top Job Matches"
        action={
          <Link to="/student/job-matching" className="text-[13px] font-semibold text-[#0d6efd]!">
            Lihat Semua
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {jobMatches.length === 0 ? (
          <Card className="p-5 text-[13px] text-[#5c6577] shadow-sm xl:col-span-3">
            {loading ? 'Memuat rekomendasi pekerjaan...' : 'Belum ada rekomendasi pekerjaan untuk saat ini.'}
          </Card>
        ) : (
          jobMatches.map((job) => (
            <Card key={job.id} className="p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-[5px] bg-[#0d6efd] text-white" aria-hidden="true">
                    <Building2 size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold ">{job.title}</h3>
                    <p className="mt-1 text-[13px] text-[#4f5a6d]">
                      {job.company?.name ?? '-'} • {job.location ?? '-'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#e7f7f4] px-2.5 py-1 text-[11px] font-semibold text-[#0f766e]">
                  {Math.round(job.matchScore)}% Match
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {(job.requiredSkills ?? []).slice(0, 4).map((skill) => (
                  <span key={skill.id} className="bg-[#63a2ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {skill.name}
                  </span>
                ))}
              </div>

              <Link to={`/student/job-matching/${job.id}`}>
                <Button className="mt-6 w-full" type="button">
                  Lihat Detail
                </Button>
              </Link>
            </Card>
          ))
        )}
      </div>
    </StudentLayout>
  )
}

export default StudentDashboard
