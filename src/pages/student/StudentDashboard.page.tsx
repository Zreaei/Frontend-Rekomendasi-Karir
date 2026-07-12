import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import {
  BadgeCheck,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Rocket,
  School,
  Sparkles,
} from 'lucide-react'

const StudentDashboard = () => {
  const stats = [
    {
      title: 'Sertifikat Terverifikasi',
      value: '12',
      icon: <BadgeCheck size={18} strokeWidth={2} />,
      accent: 'bg-[#ecfff8] text-[#0f766e]',
    },
    {
      title: 'Rekomendasi Pekerjaan',
      value: '24',
      icon: <Rocket size={18} strokeWidth={2} />,
      accent: 'bg-[#eef5ff] text-[#0d6efd]',
    },
    {
      title: 'Lamaran Aktif',
      value: '05',
      icon: <Briefcase size={18} strokeWidth={2} />,
      accent: 'bg-[#fff4e8] text-[#b45a00]',
    },
  ]

  const profileSummary = [
    { label: 'IPK', value: '3.82' },
    { label: 'SKS', value: '112' },
  ]

  const verificationRows = [
    {
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Oct 12, 2023',
      status: 'Terverifikasi',
      tone: 'success' as const,
    },
    {
      name: 'Google UX Professional',
      issuer: 'Coursera / Google',
      date: 'Nov 02, 2023',
      status: 'Diproses',
      tone: 'warning' as const,
    },
    {
      name: 'Advanced Python Cert',
      issuer: 'Codecademy',
      date: 'Sep 24, 2023',
      status: 'Ditolak',
      tone: 'danger' as const,
    },
  ]

  const jobMatches = [
    {
      title: 'Frontend Developer',
      company: 'TechStream Systems',
      location: 'New York (Remote)',
      tags: ['React', 'Tailwind', 'TypeScript'],
      match: '98%',
      icon: <School size={18} strokeWidth={2} />,
    },
    {
      title: 'UX Research Intern',
      company: 'FinGlobal Solutions',
      location: 'San Francisco',
      tags: ['User Interviews', 'Figma', 'Testing'],
      match: '94%',
      icon: <Building2 size={18} strokeWidth={2} />,
    },
    {
      title: 'Python Developer',
      company: 'EcoScale AI Studio',
      location: 'Austin, Texas',
      tags: ['Python', 'Django', 'PostgreSQL'],
      match: '91%',
      icon: <Sparkles size={18} strokeWidth={2} />,
    },
  ]

  return (
    <StudentLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold leading-tight">Selamat datang kembali, Sigit</h1>
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
                <p className="font-semibold ">Institut Teknologi Sumatera</p>
                <p className="mt-1 leading-relaxed">
                  Jl. Terusan Ryacudu, Desa Way Hui, Kecamatan Jati Agung, Kabupaten Lampung Selatan, Lampung 35365.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 text-[#0d6efd]" size={35} strokeWidth={2} aria-hidden="true" />
              <p className="leading-relaxed">Mahasiswa aktif yang sedang mempersiapkan karir di bidang teknologi dan produk digital.</p>
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
                <p className="mt-6 text-[28px] font-bold leading-none ">{stat.value}</p>
                <p className="mt-1 text-[13px] text-[#4f5a6d]">{stat.title}</p>
              </Card>
            ))}
          </div>

          <Card className="p-6 shadow-sm">
            <SectionHeader
              title="Verifikasi Terbaru"
              action={
                <button className="border-none bg-transparent text-[13px] font-semibold text-[#0d6efd]" type="button">
                  Lihat Semua
                </button>
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
                {verificationRows.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[1.2fr_1fr_0.8fr_0.75fr] gap-4 border-b border-[#d9dce2] px-4 py-4 text-[13px] last:border-b-0"
                  >
                    <span className="font-semibold ">{row.name}</span>
                    <span className="text-[#4f5a6d]">{row.issuer}</span>
                    <span className="text-[#4f5a6d]">{row.date}</span>
                    <span className="inline-flex items-center justify-start text-[13px] font-semibold text-[#047857]">{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <SectionHeader
        title="Top Job Matches"
        action={
          <div className="flex items-center gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-md border border-[#d9dce2] bg-white text-[#232342]" type="button" aria-label="Previous job matches">
              <ChevronLeft size={15} strokeWidth={2} aria-hidden="true" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-md border border-[#d9dce2] bg-white text-[#232342]" type="button" aria-label="Next job matches">
              <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {jobMatches.map((job) => (
          <Card key={job.title} className="p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[5px] bg-[#0d6efd] text-white" aria-hidden="true">
                  {job.icon}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold ">{job.title}</h3>
                  <p className="mt-1 text-[13px] text-[#4f5a6d]">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-[#e7f7f4] px-2.5 py-1 text-[11px] font-semibold text-[#0f766e]">
                {job.match} Match
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {job.tags.map((tag) => (
                <span key={tag} className="bg-[#63a2ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <Button className="mt-6 w-full" type="button">
              Lihat Detail
            </Button>
          </Card>
        ))}
      </div>
    </StudentLayout>
  )
}

export default StudentDashboard
