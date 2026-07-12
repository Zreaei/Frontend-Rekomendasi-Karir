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
      <SectionHeader
        title="Selamat Datang, Christian"
        description="Mulai cari, pantau, dan terima lowongan pekerjaan sesuai kriteria Anda "
      />

      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 max-[960px]:grid-cols-1">
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <SectionHeader
            title="Rekomendasi Lowongan Terbaru"
            action={<button className="border-none bg-transparent text-[13px] font-medium">Lihat Semua</button>}
          />
          <div className="mt-4 grid gap-5 p-4">
            {recommendedJobs.map((job) => (
              <div className="flex items-center gap-4" key={job.title}>
                <div className="grid h-11 w-11 flex-none place-items-center rounded-sm bg-[#0d6efd] text-white [&_svg]:h-5 [&_svg]:w-5" aria-hidden="true">
                  {job.icon}
                </div>
                <div>
                  <p className="text-[15px] font-semibold">{job.title}</p>
                  <p className="mt-0.5 text-[13px]">
                    {job.location} ({job.type})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm">
          <SectionHeader
            title="Berkas Lamaran Terbaru"
            action={<button className="border-none bg-transparent text-[13px] font-medium">Detail</button>}
          />
          <div className="mt-4 grid gap-5 p-4">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-sm bg-[#0d6efd] text-white [&_svg]:h-5 [&_svg]:w-5" aria-hidden="true">
                <Network size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-semibold">Fullstack Developer</p>
                <p className="mt-0.5 text-[13px]">Bandung (Full-Time)</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-sm">
        <SectionHeader
          title="Lamaran Terbaru"
          action={<button className="border-none bg-transparent text-[13px] font-medium">Lihat Semua</button>}
        />
        <table className="mt-5 grid p-4 border border-gray-400">
          <thead>
            <tr className="grid grid-cols-4 items-center text-left gap-3 text-md font-bold">
              <th>Posisi</th>
              <th>Tanggal</th>
              <th>Match</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map((item) => (
              <tr className="grid grid-cols-4 items-center gap-3 text-sm" key={item.role}>
                <td>{item.role}</td>
                <td>{item.date}</td>
                <td className={`font-semibold ${Number.parseInt(item.match) < 80 ? 'text-[#c46d00]' : 'text-[#007f65]'}`}>
                  {item.match}
                </td>
                <td><StatusPill label={item.status} tone={item.tone} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </StudentLayout>
  )
}

export default StudentDashboard
