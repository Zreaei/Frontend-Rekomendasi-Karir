import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import StatCard from '../../components/common/StatCard'
import StatusPill from '../../components/common/StatusPill'
import {
  Briefcase,
  FileText,
  GraduationCap,
  Network,
  Smartphone,
  Star,
} from 'lucide-react'

const StudentDashboard = () => {
  const stats = [
    { title: 'IPK', value: '3.75', icon: <Star size={18} strokeWidth={2} /> },
    { title: 'CLO Tercapai', value: '3/15', icon: <GraduationCap size={18} strokeWidth={2} /> },
    { title: 'Lowongan Aktif', value: '3', icon: <Briefcase size={18} strokeWidth={2} /> },
    { title: 'Lamaran Aktif', value: '3', icon: <FileText size={18} strokeWidth={2} /> },
  ]

  const recommendedJobs = [
    {
      title: 'Android Developer',
      location: 'Bandung',
      type: 'Part-Time',
      icon: <Smartphone size={18} strokeWidth={2} />,
    },
  ]

  const recentApplications = [
    {
      role: 'Fullstack Developer',
      date: '1 Maret 2026',
      match: '83%',
      status: 'Dalam Review',
      tone: 'warning' as const,
    },
    {
      role: 'DevOps',
      date: '19 Februari 2026',
      match: '79%',
      status: 'Ditolak',
      tone: 'danger' as const,
    },
    {
      role: 'Backend Developer',
      date: '1 Januari 2026',
      match: '90%',
      status: 'Diterima',
      tone: 'success' as const,
    },
  ]

  return (
    <StudentLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-tight text-[#050505]">Selamat Datang, Christian</h1>
          <p className="mt-2 text-[14px] text-[#050505]">Mulai cari, pantau, dan terima lowongan pekerjaan sesuai kriteria Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5 max-[960px]:grid-cols-2">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[clamp(38px,5vw,72px)] max-[960px]:grid-cols-1">
        <section>
          <SectionHeader
            title="Rekomendasi Lowongan Terbaru"
            action={<button className="border-none bg-transparent text-[13px] font-normal text-[#050505]">Lihat Semua</button>}
          />
          <div className="mt-6 grid gap-5">
            {recommendedJobs.map((job) => (
              <div className="flex items-center gap-4" key={job.title}>
                <div className="grid h-11 w-11 flex-none place-items-center rounded-[5px] bg-[#0d6efd] text-white [&_svg]:h-[20px] [&_svg]:w-[20px]" aria-hidden="true">
                  {job.icon}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#050505]">{job.title}</p>
                  <p className="mt-0.5 text-[13px] text-[#050505]">
                    {job.location} ({job.type})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Berkas Lamaran Terbaru"
            action={<button className="border-none bg-transparent text-[13px] font-normal text-[#050505]">Detail</button>}
          />
          <div className="mt-6 grid gap-5">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-[5px] bg-[#0d6efd] text-white [&_svg]:h-[20px] [&_svg]:w-[20px]" aria-hidden="true">
                <Network size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#050505]">Fullstack Developer</p>
                <p className="mt-0.5 text-[13px] text-[#050505]">Bandung (Full-Time)</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <SectionHeader
          title="Lamaran Terbaru"
          action={<button className="border-none bg-transparent text-[13px] font-normal text-[#050505]">Lihat Semua</button>}
        />
        <div className="mt-5 grid min-w-0 gap-3.5">
          <div className="grid grid-cols-4 items-center gap-3 text-[14px] font-bold text-[#050505] max-sm:grid-cols-1">
            <span>Posisi</span>
            <span>Tanggal</span>
            <span>Match</span>
            <span>Status</span>
          </div>
          {recentApplications.map((item) => (
            <div className="grid grid-cols-4 items-center gap-3 text-[13px] max-sm:grid-cols-1" key={item.role}>
              <span>{item.role}</span>
              <span>{item.date}</span>
              <span className={`font-semibold ${Number.parseInt(item.match) < 80 ? 'text-[#c46d00]' : 'text-[#007f65]'}`}>
                {item.match}
              </span>
              <StatusPill label={item.status} tone={item.tone} />
            </div>
          ))}
        </div>
      </section>
    </StudentLayout>
  )
}

export default StudentDashboard
